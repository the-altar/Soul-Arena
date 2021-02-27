"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPosts = exports.deletePost = exports.postComment = exports.updateThread = exports.postThread = exports.findThread = exports.newsBanner = exports.news = void 0;
const logger_1 = require("../../lib/logger");
const db_1 = require("../../db");
exports.news = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const docs = yield db_1.pool.query(text);
        res.status(200).json(docs.rows);
    }
    catch (err) {
        logger_1.log.error(err);
        return res.status(500).json({});
    }
});
exports.newsBanner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const docs = yield db_1.pool.query(text);
        res.status(200).json(docs.rows);
    }
    catch (err) {
        logger_1.log.error(err);
        return res.status(500).json({});
    }
});
exports.findThread = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const docs = yield db_1.pool.query(text, [id, siteArea]);
        return res.status(200).json(docs.rows[0]);
    }
    catch (err) {
        logger_1.log.error(err);
        return res.status(500).json({});
    }
});
exports.postThread = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //const {author, content, siteArea, title} = req.body
    const text = `insert into thread (site_area, title, content, author, meta) values ($1, $2, $3, $4, $5)`;
    try {
        yield db_1.pool.query(text, req.body);
        return res.status(200).json({ success: true });
    }
    catch (err) {
        logger_1.log.error(err);
        return res.status(500).json({});
    }
});
exports.updateThread = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const text = `UPDATE thread SET content = $2, meta=$3 where id = $1`;
    try {
        yield db_1.pool.query(text, req.body);
        return res.status(200).json({ success: true, content: req.body[1] });
    }
    catch (err) {
        logger_1.log.error(err);
        return res.status(500).json({});
    }
});
exports.postComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // first query creates a post, returns ID
    const sql1 = `INSERT INTO post ("content",author,thread_id,site_area,quotes) values ($1, $2, $3, $4, $5) RETURNING id, quotes;`;
    // second query increases post count
    const sql2 = `UPDATE thread SET post_count = post_count + 1 WHERE id = $1`;
    // third and final queries updates quoted posts with the reply's id
    const sql3 = `UPDATE post SET replies = array_append(replies,$2) where id = ANY($1)`;
    const client = yield db_1.pool.connect();
    try {
        //1st
        client.query("BEGIN");
        const post = yield client.query(sql1, req.body);
        //2nd
        const thread_id = req.body[2];
        yield client.query(sql2, [thread_id]);
        // 3rd
        const reply = post.rows[0].id;
        const quotesId = req.body[4];
        if (quotesId.length) {
            yield client.query(sql3, [quotesId, reply]);
        }
        yield client.query("COMMIT");
        return res.status(200).json({ success: true });
    }
    catch (err) {
        client.query("ROLLBACK");
        logger_1.log.error(err);
        return res.status(500).json({});
    }
    finally {
        client.release();
    }
});
exports.deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sql = "UPDATE post set deleted = true WHERE id=$1";
    const value = [Number(req.params.id)];
    const authorId = Number(req.params.userId);
    if (authorId !== req.res.locals.id && req.res.locals.token.authLevel < 100) {
        logger_1.log.info(req.body);
        logger_1.log.info(req.res.locals.token);
        return res.status(401).json({});
    }
    try {
        yield db_1.pool.query(sql, value);
        return res.status(200).send("OK");
    }
    catch (e) {
        logger_1.log.error(e);
        return res.status(500).send("FAILED");
    }
});
exports.getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const data = yield db_1.pool.query(sql, [threadId]);
        return res.status(200).json(data.rows);
    }
    catch (err) {
        logger_1.log.error(err);
        return res.status(500).json({});
    }
});
//# sourceMappingURL=thread.controller.js.map