import { Request, Response } from "express";
import { pool } from "../../db";
import { join } from "path";
import {log} from "../../lib/logger"
import { unlink, existsSync } from "fs";

export const create = async function (req: Request, res: Response) {
  const sql = `INSERT INTO mission (name, description, goals, level_requirement, unlocked_entity, cost, banner, released, difficulty_level) 
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`;
  try {
    pool.query(sql, req.body);
    res.status(200).json({ success: true });
  } catch (err) {
    log.error(err)
    return res.status(500).json({})
  }
};

export const findAll = async function (req: Request, res: Response) {
  const sql = `SELECT * from mission`;
  try {
    const r = await pool.query(sql);
    return res.status(200).json({ success: true, missions: r.rows });
  } catch (err) {
    log.error(err)
    return res.status(500).json({})
  }
};

export const findOne = async function (req: Request, res: Response) {
  const sql = `select * from mission where id = $1`;
  try {
    const r = await pool.query(sql, [req.params.id]);
    return res.status(200).json({ success: true, mission: r.rows[0] });
  } catch (err) {
    log.error(err)
    return res.status(500).json({})
  }
};

export const update = async function (req: Request, res: Response) {
  const sql = `UPDATE mission 
    SET name = $1, description = $2, goals = $3, level_requirement = $4, unlocked_entity = $5, cost = $6, banner = $7, released = $8, difficulty_level = $9
    WHERE id = $10`;

  try {
    await pool.query(sql, req.body);
    return res.status(200).json({ success: true });
  } catch (err) {
    log.error(err)
    return res.status(500).json({})
  }
};

export const remove = async function (req: Request, res: Response) {
  const id = Number(req.params.missionId);
  const banner = req.params.banner;

  try {
    await pool.query("DELETE from mission WHERE id = $1", [id]);
    const p: string = join(process.cwd(), "/public/img/game/", banner + ".jpg");
    if (existsSync(p)) {
      unlink(p, () => {});
    }
    return res.status(200).json({ success: true });
  } catch (e) {
    log.error(e)
    return res.status(500).json({})
  }
};
