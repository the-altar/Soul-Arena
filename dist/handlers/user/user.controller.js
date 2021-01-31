"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.matchHistory = exports.resetStats = exports.defaultAvatar = exports.uploadAvatar = exports.user = exports.logout = exports.login = exports.register = exports.mount = exports.loggerMiddleware = void 0;
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
const path_1 = require("path");
const db_1 = require("../../db");
const logger_1 = require("../../lib/logger");
const helper = __importStar(require("./user.helpers"));
function loggerMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = req.cookies.session_id;
            if (token) {
                const u = yield jsonwebtoken_1.verify(token, process.env.TOKEN_SECRET);
                req.res.locals.user = u;
                req.res.locals.guest = false;
            }
            else
                req.res.locals.guest = true;
            next();
        }
        catch (err) {
            res.status(401).end();
            throw err;
        }
    });
}
exports.loggerMiddleware = loggerMiddleware;
exports.mount = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.res.locals.guest) {
            return res.json({ authLevel: -1, auth: false, id: -1 });
        }
        const u = req.res.locals.user;
        return res.json(Object.assign({}, u));
    });
};
exports.register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const text = `INSERT INTO users (username, passhash, email) values ($1, $2, $3) RETURNING id;`;
    const query2 = `INSERT INTO ladderboard (season, user_id, wins, losses, elo, streak, max_streak, experience, season_level, season_rank)
  values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`;
    if (!helper.validEmail(req.body.email) ||
        !helper.validUsername(req.body.username) ||
        !helper.validPassword(req.body.password))
        return res.status(500).json({});
    const client = yield db_1.pool.connect();
    try {
        const hashed = yield bcrypt_1.hash(req.body.password, 10);
        yield client.query("BEGIN");
        const response = yield db_1.pool.query(text, [
            req.body.username,
            hashed,
            req.body.email,
        ]);
        const userId = response.rows[0].id;
        yield db_1.pool.query(query2, [0, userId, 0, 0, 0, 0, 0, 0, 0, 0]);
        yield client.query("COMMIT");
        return res.status(200).json({
            id: userId,
            authLevel: 0,
            auth: true,
            username: req.body.username,
        });
    }
    catch (err) {
        yield client.query("ROLLBACK");
        return res.status(500).json({ success: false, err: err });
    }
    finally {
        client.release();
    }
});
exports.login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const text = `select u.id, u.username, u.passhash, ur.auth_level as "authLevel"
    from users as u
    left join user_rank as ur 
        on u.user_rank_id = ur.id
    where u.username = $1;`;
    try {
        const data = yield db_1.pool.query(text, [req.body.username]);
        const user = data.rows[0];
        if (data.rowCount === 0)
            return res.json({ success: false });
        const match = yield bcrypt_1.compare(req.body.password, user.passhash);
        console.log(match);
        if (!match)
            return res.json({ success: false });
        delete user.passhash;
        const response = {
            id: user.id,
            authLevel: user.authLevel,
            auth: true,
            username: user.username,
        };
        const token = jsonwebtoken_1.sign(response, process.env.TOKEN_SECRET, {
            expiresIn: "365d",
        });
        res.cookie("session_id", token, {
            httpOnly: true,
            maxAge: 365 * 24 * 60 * 60 * 1000,
            domain: process.env.DOMAIN,
        });
        return res.json({ userData: response, success: true });
    }
    catch (err) {
        throw err;
    }
});
exports.logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.cookie("session_id", {}, {
        maxAge: 0,
        domain: process.env.DOMAIN,
    });
    return res.status(200).end();
});
exports.user = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const doc = yield db_1.pool.query(text, [username]);
        res.status(200).json(doc.rows[0]);
    }
    catch (err) {
        throw err;
    }
});
exports.uploadAvatar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const filename = id * 100;
    const p = path_1.join(process.cwd(), `/public/img/avatars/${filename}.jpg`);
    const file = req.files.file;
    try {
        yield file.mv(p);
        yield db_1.pool.query("UPDATE users SET avatar = $1 where id = $2", [
            `${filename}.jpg`,
            id,
        ]);
        return res.status(200).json({ success: true });
    }
    catch (err) {
        logger_1.log.error(err);
        return res.status(501).end();
    }
});
exports.defaultAvatar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filename = req.params.filename + ".jpg";
    const id = Number(req.params.id);
    try {
        yield db_1.pool.query("UPDATE users SET avatar = $1 where id = $2", [
            filename,
            id,
        ]);
        return res.status(200).json({ success: true });
    }
    catch (err) {
        return res.status(500).json({ success: false });
    }
});
exports.resetStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        yield db_1.pool.query(query, [req.res.locals.id]);
        return res.status(200).json({});
    }
    catch (e) {
        logger_1.log.error(e);
        return res.status(500).json({});
    }
});
exports.matchHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const data = yield db_1.pool.query(query, [req.params.id]);
        return res.status(200).json(data.rows);
    }
    catch (e) {
        logger_1.log.error(e);
        return res.status(500).json({});
    }
});
//# sourceMappingURL=user.controller.js.map