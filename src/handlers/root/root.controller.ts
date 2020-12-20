import { Request, Response } from "express";
import { pool } from "../../db";
import { log } from "../../lib/logger";

export const baseController = async (req: Request, res: Response) => {
  return res.sendFile("index.html", { root: "./public/main" });
};

export const uploadController = async (req: Request, res: Response) => {
  return res.json([{ url: "/absolute/path/to/filename.png" }]);
};

export const usersOnline = async (req: Request, res: Response) => {
  try {
    const sql = `SELECT count(*) as "count" from usersOnline`;
    const rows = await pool.query(sql);
    return res.status(200).json(rows.rows[0]);
  } catch (e) {
    log.error(e);
    return res.status(500).json({ count: 0 });
  }
};
