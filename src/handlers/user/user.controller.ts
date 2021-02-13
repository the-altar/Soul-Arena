import { Request, Response, NextFunction } from "express";
import { hash, compare } from "bcrypt";
import { sign, verify } from "jsonwebtoken";
import { join } from "path";
import { pool } from "../../db";
import { log } from "../../lib/logger";
import * as helper from "./user.helpers";

export async function loggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.cookies.session_id;
    if (token) {
      const u: any = await verify(token, process.env.TOKEN_SECRET as string);
      req.res.locals.user = u;
      req.res.locals.guest = false;
    } else req.res.locals.guest = true;
    next();
  } catch (err) {
    log.error(err)
    return res.status(401).end();
  }
}

export const mount = async function (req: Request, res: Response) {
  if (req.res.locals.guest) {
    return res.json({ authLevel: -1, auth: false, id: -1 });
  }
  const u = req.res.locals.user;
  return res.json({ ...u });
};

export const register = async (req: Request, res: Response) => {
  const text = `INSERT INTO users (username, passhash, email) values ($1, $2, $3) RETURNING id;`;
  const query2 = `INSERT INTO ladderboard (season, user_id, wins, losses, elo, streak, max_streak, experience, season_level, season_rank)
  values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`;

  if (
    !helper.validEmail(req.body.email) ||
    !helper.validUsername(req.body.username) ||
    !helper.validPassword(req.body.password)
  )
    return res.status(500).json({});

  const client = await pool.connect();
  try {
    const hashed = await hash(req.body.password, 10);

    await client.query("BEGIN");
    const response = await pool.query(text, [
      req.body.username,
      hashed,
      req.body.email,
    ]);
    const userId = response.rows[0].id;
    await pool.query(query2, [0, userId, 0, 0, 0, 0, 0, 0, 0, 0]);
    await client.query("COMMIT");

    return res.status(200).json({
      id: userId,
      authLevel: 0,
      auth: true,
      username: req.body.username,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    log.error(err)
    return res.status(500).json({ success: false, err: err });
  } finally {
    client.release();
  }
};

export const login = async (req: Request, res: Response) => {
  const text = `select u.id, u.username, u.passhash, ur.auth_level as "authLevel"
    from users as u
    left join user_rank as ur 
        on u.user_rank_id = ur.id
    where u.username = $1;`;
  try {
    const data = await pool.query(text, [req.body.username]);
    const user = data.rows[0];
    if (data.rowCount === 0) return res.json({ success: false });

    const match = await compare(req.body.password, user.passhash);
    console.log(match);
    if (!match) return res.json({ success: false });

    delete user.passhash;
    const response = {
      id: user.id,
      authLevel: user.authLevel,
      auth: true,
      username: user.username,
    };
    const token = sign(response, process.env.TOKEN_SECRET, {
      expiresIn: "365d",
    });

    res.cookie("session_id", token, {
      httpOnly: true,
      maxAge: 365 * 24 * 60 * 60 * 1000,
      domain: process.env.DOMAIN,
    });

    return res.json({ userData: response, success: true });
  } catch (err) {
    throw err;
  }
};

export const logout = async (req: Request, res: Response) => {
  res.cookie(
    "session_id",
    {},
    {
      maxAge: 0,
      domain: process.env.DOMAIN,
    }
  );
  return res.status(200).end();
};

export const user = async (req: Request, res: Response) => {
  const username = req.body.username || req.params.username;

  const text = `select u.id, u.avatar, u.username, u.joined_at, 
	  case when u2.user_id is not null then true else false end online,
    jsonb_build_object('elo', lb.elo, 'wins', lb.wins, 'losses', lb.losses, 'streak', lb.streak, 'maxStreak', lb.max_streak, 'exp', lb.experience, 'seasonRank', lb.season_rank, 'seasonLevel', lb.season_level) as season, 
    jsonb_build_object('authLevel', ur.auth_level, 'rankName', ur."name") as rank 
    from users as u 
    left join ladderboard as lb 
        on u.id = lb.user_id 
    left join user_rank as ur 
        on u.user_rank_id = ur.id
    left join usersonline u2 
    	on u2.user_id = u.id 
    where u.username = $1;
    `;

  try {
    const doc = await pool.query(text, [username]);
    res.status(200).json(doc.rows[0]);
  } catch (err) {
    throw err;
  }
};

export const uploadAvatar = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const filename = id * 100;
  const p = join(process.cwd(), `/public/img/avatars/${filename}.jpg`);

  const file = req.files.file;
  try {
    await file.mv(p);
    await pool.query("UPDATE users SET avatar = $1 where id = $2", [
      `${filename}.jpg`,
      id,
    ]);
    return res.status(200).json({ success: true });
  } catch (err) {
    log.error(err);
    return res.status(501).end();
  }
};

export const defaultAvatar = async (req: Request, res: Response) => {
  const filename = req.params.filename + ".jpg";
  const id = Number(req.params.id);
  try {
    await pool.query("UPDATE users SET avatar = $1 where id = $2", [
      filename,
      id,
    ]);
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false });
  }
};

export const resetStats = async (req: Request, res: Response) => {
  const query = `
  update
    ladderboard
  set
    experience = 0,
    season_level = 1,
    season_rank = 'Substitute Shinigami',
    streak = 0,
    wins = 0,
    losses = 0
  where
    user_id = $1
  `;
  try {
    await pool.query(query, [req.res.locals.id]);
    return res.status(200).json({});
  } catch (e) {
    log.error(e);
    return res.status(500).json({});
  }
};

export const matchHistory = async (req: Request, res: Response) => {
  const query = `
  select gr.game_room, gr.created_at, winner_id, jsonb_agg(jsonb_build_object('username', u2.username, 'id', u2.id)) as players from game_result gr 
  left join users u2 
    on u2.id = gr.winner_id or u2.id = gr.loser_id 
  left join ladderboard l2 
    on l2.user_id = $1
  where (gr.winner_id = $1 or gr.loser_id = $1) and gr.created_at >= (NOW() - INTERVAL '24 HOURS')
  group by gr.winner_id, gr.loser_id, gr.created_at, gr.game_room 
  order by gr.created_at DESC;
  `;
  try {
    const data = await pool.query(query, [req.params.id]);
    return res.status(200).json(data.rows);
  } catch (e) {
    log.error(e);
    return res.status(500).json({});
  }
};
