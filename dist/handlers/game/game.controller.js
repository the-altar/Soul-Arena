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
exports.missions = exports.deleteMissionTracks = exports.missionTracks = exports.trackMission = exports.user = exports.pokemonTypeEnums = exports.file = void 0;
const enums_1 = require("../../lib/engine/enums");
const db_1 = require("../../db");
exports.file = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.sendFile("index.html", { root: "./public/game" });
});
exports.pokemonTypeEnums = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.json({
        pokemonTypings: enums_1.Types,
        effectTypings: enums_1.effectType,
        activationTypings: enums_1.activationType,
        damageTypings: enums_1.DamageType,
        costTypings: enums_1.CostTypes,
        reiatsuTypings: enums_1.ReiatsuTypes,
        characterTypings: enums_1.CharacterTypes,
        controlTypings: enums_1.ControlType,
        skillClassTypings: enums_1.SkillClassType,
        targetModeTypings: enums_1.targetType,
        effectTargetBehaviorTypings: enums_1.effectTargetBehavior,
        triggerClauseTypings: enums_1.triggerClauseType,
    });
});
exports.user = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const doc = yield db_1.pool.query(text, [id]);
        res.status(200).json(doc.rows[0]);
    }
    catch (err) {
        throw err;
    }
});
exports.trackMission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sql = `INSERT INTO tracking_mission
    (mission_id, goals, user_id)
    VALUES($1, $2, $3);`;
    const id = req.res.locals.id;
    try {
        yield db_1.pool.query(sql, [req.body[0], req.body[1], id]);
        return res.status(200).json({ success: true });
    }
    catch (err) {
        res.status(501).json({ success: false });
        throw err;
    }
});
exports.missionTracks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.res.locals.id;
    const mission_id = Number(req.params.mission_id);
    const sql = `select goals from tracking_mission where user_id = $1 and mission_id = $2`;
    try {
        const r = yield db_1.pool.query(sql, [id, mission_id]);
        res.status(200).json({ success: true, goals: r.rows });
    }
    catch (err) {
        res.status(401).json({ success: false });
        throw err;
    }
});
exports.deleteMissionTracks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.res.locals.id;
    const missionId = Number(req.params.missionId);
    const sql = `delete
    from
        public.tracking_mission
    where
        user_id = $1
        and mission_id = $2;`;
    try {
        yield db_1.pool.query(sql, [userId, missionId]);
        return res.status(200).json({ success: true });
    }
    catch (err) {
        res.status(501).json({ success: false });
        throw err;
    }
});
exports.missions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const r = yield db_1.pool.query(sql, [id]);
        return res.status(200).json(r.rows);
    }
    catch (err) {
        res.status(501);
        throw err;
    }
});
//# sourceMappingURL=game.controller.js.map