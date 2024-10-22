import { Request, Response } from "express";
import { log } from "../../lib/logger";
import { pool } from "../../db";

export const news = async (req: Request, res: Response) => {
  const text = `
        SELECT t.id, t.created_at, t.title, t."content", t.post_count, t.meta, t.locked,
            JSON_BUILD_OBJECT('username', u.username, 'avatar', u.avatar) as "author" 
        FROM thread AS t 
        LEFT JOIN users AS u 
            ON t.author = u.id 	
        WHERE t.site_area=0
        ORDER BY created_at DESC
        limit 5;`;

  try {
    const docs = await pool.query(text);
    res.status(200).json(docs.rows);
  } catch (err) {
    log.error(err);
    return res.status(500).json({});
  }
};

export const newsBanner = async (req: Request, res: Response) => {
  const text = `
    select
      t.id,
      t.created_at,
      t.title,
      t."content",
      t.post_count,
      t.meta,
      t.locked,
      JSON_BUILD_OBJECT('username', u.username, 'avatar', u.avatar) as "author"
    from
      thread as t
    left join users as u on
      t.author = u.id
    where
      t.site_area = 0
      and length(t.meta->>'bannerUrl')>0
    order by
      created_at desc
    limit 5;
  `;

  try {
    const docs = await pool.query(text);
    res.status(200).json(docs.rows);
  } catch (err) {
    log.error(err);
    return res.status(500).json({});
  }
};

export const findThread = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const siteArea = Number(req.params.siteArea);

  const text = `
        SELECT t.id, t.created_at, t.post_count, t.title, t."content", t.meta, t.locked,
        JSON_BUILD_OBJECT('username', u.username, 'avatar', u.avatar) as "author"
        FROM
            thread as t
        LEFT JOIN users AS u
            ON u.id = t.author
        WHERE t.id = $1 AND t.site_area = $2;
    `;

  try {
    const docs = await pool.query(text, [id, siteArea]);
    return res.status(200).json(docs.rows[0]);
  } catch (err) {
    log.error(err);
    return res.status(500).json({});
  }
};

export const postThread = async (req: Request, res: Response) => {
  //const {author, content, siteArea, title} = req.body
  const text = `insert into thread (site_area, title, content, author, meta) values ($1, $2, $3, $4, $5)`;
  try {
    await pool.query(text, req.body);
    return res.status(200).json({ success: true });
  } catch (err) {
    log.error(err);
    return res.status(500).json({});
  }
};

export const updateThread = async (req: Request, res: Response) => {
  const text = `UPDATE thread SET content = $2, meta=$3 where id = $1`;
  try {
    await pool.query(text, req.body);
    return res.status(200).json({ success: true, content: req.body[1] });
  } catch (err) {
    log.error(err);
    return res.status(500).json({});
  }
};

export const postComment = async (req: Request, res: Response) => {
  // first query creates a post, returns ID
  const sql1 = `INSERT INTO post ("content",author,thread_id,site_area,quotes) values ($1, $2, $3, $4, $5) RETURNING id, quotes;`;
  // second query increases post count
  const sql2 = `UPDATE thread SET post_count = post_count + 1 WHERE id = $1`;
  // third and final queries updates quoted posts with the reply's id
  const sql3 = `UPDATE post SET replies = array_append(replies,$2) where id = ANY($1)`;
  const client = await pool.connect();

  try {
    //1st
    client.query("BEGIN");
    const post = await client.query(sql1, req.body);
    //2nd
    const thread_id = req.body[2];
    await client.query(sql2, [thread_id]);
    // 3rd
    const reply = post.rows[0].id;
    const quotesId = req.body[4];
    if (quotesId.length) {
      await client.query(sql3, [quotesId, reply]);
    }
    await client.query("COMMIT");
    return res.status(200).json({ success: true });
  } catch (err) {
    client.query("ROLLBACK");
    log.error(err);
    return res.status(500).json({});
  } finally {
    client.release();
  }
};

export const deletePost = async (req: Request, res: Response) => {
  const sql = "UPDATE post set deleted = true WHERE id=$1";
  const value = [Number(req.params.id)];
  const authorId = Number(req.params.userId);
  if (authorId !== req.res.locals.id && req.res.locals.token.authLevel < 100) {
    log.info(req.body);
    log.info(req.res.locals.token);
    return res.status(401).json({});
  }
  try {
    await pool.query(sql, value);
    return res.status(200).send("OK");
  } catch (e) {
    log.error(e);
    return res.status(500).send("FAILED");
  }
};

export const getPosts = async (req: Request, res: Response) => {
  const offset = Number(req.params.limit);
  const threadId = Number(req.params.id);

  const sql = `
        select post.id, post."content", post.replies, post.quotes, post.created_at, post.deleted, jsonb_build_object('username', users.username, 'rank', user_rank."name", 'avatar', users.avatar, 'id', users.id) as "author"  from post 
        join users on post.author = users.id 
        join user_rank on user_rank.id = users.user_rank_id
        where post.thread_id = $1
        order by post.id;
    `;
  try {
    const data = await pool.query(sql, [threadId]);
    return res.status(200).json(data.rows);
  } catch (err) {
    log.error(err);
    return res.status(500).json({});
  }
};
