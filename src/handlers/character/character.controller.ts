import { Request, Response } from "express";
import { join } from "path";
//import { unlink, existsSync } from 'fs'
import * as query from "./character.queries";
import { pool } from "../../db";
import { log } from "../../lib/logger";
import { parse } from "dotenv/types";

export const create = async (req: Request, res: Response) => {
  // Req.body = [released, charData, isFree]
  const text =
    "INSERT INTO entity (released, data, isfree) VALUES ($1, $2, $3)";
  try {
    await pool.query(text, req.body);
    return res.json({ code: 1 });
  } catch (err) {
    log.error(err)
    return res.status(500).json({})
  }
};

export const update = async (req: Request, res: Response) => {
  // Req.body = [id, released, charData, isFree]
  const text =
    "UPDATE entity SET released = $2, data = $3, isfree = $4 WHERE id = $1";
  try {
    await pool.query(text, req.body);
    return res.json({ code: 1 });
  } catch (err) {
    log.error(err)
    return res.status(500).json({})
  }
};

export const find = async (req: Request, res: Response) => {
  try {
    const char = await pool.query("SELECT * from entity where entity.id = $1", [
      req.params.id,
    ]);
    return res.json(char.rows[0]);
  } catch (err) {
    log.error(err);
    return res.status(500).json({});
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const docs = await pool.query("SELECT * from entity");
    return res.json(docs.rows);
  } catch (err) {
    log.error(err);
    return res.status(500).json({});
  }
};

export const getIds = async (req: Request, res: Response) => {
  const text = `SELECT id, data -> 'name' AS name, data -> 'dexNumber' as "dexNumber" from entity`;
  try {
    const r = await pool.query(text);
    return res.json(r.rows);
  } catch (err) {
    log.error(err);
    return res.status(500).json({});
  }
};

export const purchase = async (req: Request, res: Response) => {
  const sql0 = `SELECT coins from users where id=$1`;
  const sql1 = `UPDATE users SET coins = coins - $1 where id = $2`;
  const sql2 = `INSERT into obtained_entity (entity_id, user_id) VALUES ($1, $2)`;
  try {
    const data = await pool.query(sql0, [req.body.userId]);
    if (data.rows[0].coins <= parseInt(req.body.coins))
      return res.status(406).json({});
    await pool.query(sql1, [req.body.coins, req.body.userId]);
    await pool.query(sql2, [req.body.characterId, req.body.userId]);
    return res.status(200).json({ success: true });
  } catch (err) {
    log.error(err);
    return res.status(500).json({});
  }
};

export const profiles = async (req: Request, res: Response) => {
  try {
    const data = await pool.query(query.profilesQuery);
    return res.status(200).json(data.rows);
  } catch (e) {
    log.error(e);
    return res.status(500).json([]);
  }
};

export const profile = async (req: Request, res: Response) => {
  try {
    const data = await pool.query(query.profileQuery, [Number(req.params.id)]);
    return res.status(200).json(data.rows[0]);
  } catch (e) {
    log.error(e);
    return res.status(500).json([]);
  }
};

export const upload = async (req: Request, res: Response) => {
  for (const file in req.files) {
    const f: any = req.files[file];
    const p = join(process.cwd(), "/public/game/uploads", f.name + ".jpg");
    f.mv(p, (err: any) => {
      if (err) {
        console.log(err);
        return res.status(500).json({});
      }
    });
  }

  return res.send("File uploaded!");
};

export const uploadFiles = async (req: Request, res: Response) => {
  const response = [];
  for (const file in req.files) {
    const f: any = req.files[file];
    const p = join(
      process.cwd(),
      "/public/game/uploads",
      req.params.filename + ".jpg"
    );
    f.mv(p, (err: any) => {
      if (err) {
        return res.status(500).json({});
      }
      response.push({
        url: `http://localhost:3000/img/game/${req.params.filename}.jpg`,
      });
    });
  }
  return 1;
};
