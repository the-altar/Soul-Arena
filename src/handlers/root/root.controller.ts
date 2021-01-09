import { Request, Response } from "express";
import * as e from "../../lib/engine/enums";
import { pool } from "../../db";
import { log } from "../../lib/logger";

export const baseController = async (req: Request, res: Response) => {
  return res.sendFile("index.html", { root: "./public/main" });
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

export const topLadder = async (req: Request, res: Response) => {
  const sql = `select u.username, u.avatar, u.id, l.season_level, l.experience
  from
    ladderboard l
  join users u on
    u.id = l.user_id
  order by l.season_level desc limit 5;`;

  try {
    const data = await pool.query(sql);
    return res.status(200).json(data.rows);
  } catch (e) {
    log.error(e);
    return res.status(500).json([]);
  }
};

export const topStreak = async (req: Request, res: Response) => {
  const sql = `select u.avatar,
    u.username ,
    u.id,
    l.max_streak
  from
    ladderboard l
  join users u on
    u.id = l.user_id
  order by l.max_streak desc limit 5;`;

  try {
    const data = await pool.query(sql);
    return res.status(200).json(data.rows);
  } catch (e) {
    log.error(e);
    return res.status(500).json([]);
  }
};

export const enums = async (req: Request, res: Response) => {
  return res.json({
    effectTypings: e.effectType,
    activationTypings: e.activationType,
    damageTypings: e.DamageType,
    costTypings: e.CostTypes,
    reiatsuTypings: e.ReiatsuTypes,
    characterTypings: e.CharacterTypes,
    controlTypings: e.ControlType,
    skillClassTypings: e.SkillClassType,
    targetModeTypings: e.targetType,
    effectTargetBehaviorTypings: e.effectTargetBehavior,
    triggerClauseTypings: e.triggerClauseType,
  });
};
