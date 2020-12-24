import { Request, Response } from "express";
import { pool } from "../../db";

export const file = async (req: Request, res: Response) => {
  return res.sendFile("index.html", { root: "./public/game/build" });
};

export const user = async (req: Request, res: Response) => {
  const id = req.res.locals.id;

  const text = `
        select
            u.id,
            u.avatar,
            u.username,
            u.coins,
            jsonb_build_object('elo', lb.elo, 'wins', lb.wins, 'losses', lb.losses, 'streak', lb.streak, 'maxStreak', lb.max_streak, 'exp', lb.experience, 'seasonRank', lb.season_rank, 'seasonLevel', lb.season_level) as season,
            jsonb_build_object('authLevel', ur.auth_level, 'rankName', ur."name") as rank,
            array_agg(obtained_entity.entity_id) as unlocked
        from
            users as u
        left join ladderboard as lb on
            u.id = lb.user_id
        left join user_rank as ur on
            u.user_rank_id = ur.id
        left join obtained_entity on
            obtained_entity.user_id = u.id
        where
            u.id = $1
        group by
            (u.id,
            lb.elo,
            lb.wins,
            lb.losses,
            lb.streak,
            lb.max_streak,
            lb.experience,
            lb.season_rank,
            lb.season_level,
            ur.auth_level,
	        ur."name")
    `;
  try {
    const doc = await pool.query(text, [id]);
    const user = { ...doc.rows[0], auth: true };
    res.status(200).json(user);
  } catch (err) {
    throw err;
  }
};

export const trackMission = async (req: Request, res: Response) => {
  const sql = `INSERT INTO tracking_mission
    (mission_id, goals, user_id)
    VALUES($1, $2, $3);`;
  const id = req.res.locals.id;
  try {
    await pool.query(sql, [req.body[0], req.body[1], id]);
    return res.status(200).json({ success: true });
  } catch (err) {
    res.status(501).json({ success: false });
    throw err;
  }
};

export const missionTracks = async (req: Request, res: Response) => {
  const id = req.res.locals.id;
  const mission_id = Number(req.params.mission_id);

  const sql = `select goals from tracking_mission where user_id = $1 and mission_id = $2`;
  try {
    const r = await pool.query(sql, [id, mission_id]);
    res.status(200).json({ success: true, goals: r.rows });
  } catch (err) {
    res.status(401).json({ success: false });
    throw err;
  }
};

export const deleteMissionTracks = async (req: Request, res: Response) => {
  const userId = req.res.locals.id;
  const missionId = Number(req.params.missionId);
  const sql = `delete
    from
        public.tracking_mission
    where
        user_id = $1
        and mission_id = $2;`;

  try {
    await pool.query(sql, [userId, missionId]);
    return res.status(200).json({ success: true });
  } catch (err) {
    res.status(501).json({ success: false });
    throw err;
  }
};

export const missions = async (req: Request, res: Response) => {
  const id = req.res.locals.id;
  const sql = `select
	m2.*,
	case
		when cm.user_id is null then false
		else true
	end as completed,
	case
		when tm.user_id is null then false
		else true
	end as tracking
    from
        mission m2
    left join completed_mission cm on
        cm.mission_id = m2.id
        and cm.user_id = $1
    left join tracking_mission tm on 
        tm.user_id = $1 
        and tm.mission_id = m2.id
    where m2.released = true;`;

  try {
    const r = await pool.query(sql, [id]);
    return res.status(200).json(r.rows);
  } catch (err) {
    res.status(501);
    throw err;
  }
};

export const character = async (req: Request, res: Response) => {
  const text = `
        select
            jsonb_build_object('id', entity.id, 'isFree', entity.isfree) || entity.data || jsonb_build_object('skills', jsonb_agg(sk.data order by sk.priority)) as data
        from
            entity
        join skill as sk on
            sk.entity_id = entity.id
        where entity.released = true    
        group by
            entity.id;        
    `;

  try {
    const r = await pool.query(text);
    return res.json(r.rows);
  } catch (err) {
    res.status(500).send("Something went wrong...");
    throw err;
  }
};
