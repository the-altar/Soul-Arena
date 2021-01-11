import { Request, Response } from "express";
import { log } from "../../lib/logger";
import { pool } from "../../db";
import * as sql from "./game.queries";

export const file = async (req: Request, res: Response) => {
  return res.sendFile("index.html", { root: "./public/game/build" });
};

export const user = async (req: Request, res: Response) => {
  const id = req.res.locals.id;
  try {
    const doc = await pool.query(sql.userQuery, [id]);
    const user = { ...doc.rows[0], auth: true };
    res.status(200).json(user);
  } catch (err) {
    throw err;
  }
};

export const trackMission = async (req: Request, res: Response) => {
  const id = req.res.locals.id;
  try {
    await pool.query(sql.trackMissionQuery, [req.body[0], req.body[1], id]);
    return res.status(200).json({ success: true });
  } catch (err) {
    res.status(501).json({ success: false });
    throw err;
  }
};

export const missionTracks = async (req: Request, res: Response) => {
  const id = req.res.locals.id;
  const mission_id = Number(req.params.mission_id);

  try {
    const r = await pool.query(sql.missionTrackQuery, [id, mission_id]);
    res.status(200).json({ success: true, goals: r.rows });
  } catch (err) {
    res.status(401).json({ success: false });
    throw err;
  }
};

export const deleteMissionTracks = async (req: Request, res: Response) => {
  const userId = req.res.locals.id;
  const missionId = Number(req.params.missionId);

  try {
    await pool.query(sql.deleteMissionTrackQuery, [userId, missionId]);
    return res.status(200).json({ success: true });
  } catch (err) {
    res.status(501).json({ success: false });
    throw err;
  }
};

export const missions = async (req: Request, res: Response) => {
  const id = req.res.locals.id;
  try {
    const r = await pool.query(sql.selectMissionQuery, [id]);
    return res.status(200).json(r.rows);
  } catch (err) {
    res.status(501);
    throw err;
  }
};

export const character = async (req: Request, res: Response) => {
  try {
    const r = await pool.query(sql.selectCharacterQuery);
    return res.json(r.rows);
  } catch (err) {
    res.status(500).send("Something went wrong...");
    throw err;
  }
};

export const themes = async (req: Request, res: Response) => {
  const level = req.res.locals.token.authLevel;
  try {
    const r = await pool.query(sql.selectThemeQuery, [level]);
    res.status(200).json(r.rows);
  } catch (e) {
    log.error(e);
    res.status(501).json({});
  }
};

export const setTheme = async (req: Request, res: Response) => {
  const userId = req.res.locals.id;
  const themeId = req.body.themeId;
  try {
    await pool.query(sql.updateUserThemeQuery, [userId, themeId]);
    return res.status(200).json({});
  } catch (err) {
    log.error(err);
    return res.status(500).json({});
  }
};
