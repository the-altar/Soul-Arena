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
exports.defaultAvatar = exports.uploadAvatar = exports.user = exports.logout = exports.login = exports.register = exports.mount = exports.loggerMiddleware = void 0;
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
const path_1 = require("path");
const db_1 = require("../../db");
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
            return res.json({ authLevel: -1, auth: false });
        }
        const u = req.res.locals.user;
        return res.json({
            username: u.username,
            authLevel: u.authLevel,
            id: u.id,
            auth: u.auth,
        });
    });
};
exports.register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const text = `INSERT INTO users (username, passhash, email) values ($1, $2, $3);`;
    try {
        const hashed = yield bcrypt_1.hash(req.body.password, 10);
        yield db_1.pool.query(text, [req.body.username, hashed, req.body.email]);
        return res.json({ success: true });
    }
    catch (err) {
        return res.json({ success: false, err: err });
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
        if (match) {
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
            });
            return res.json({ userData: response, success: true });
        }
        return res.json({ success: false });
    }
    catch (err) {
        throw err;
    }
});
exports.logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("session_id");
    return res.status(200).end();
});
exports.user = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username || req.params.username;
    const text = `select u.id, u.avatar, u.username, 
    jsonb_build_object('elo', lb.elo, 'wins', lb.wins, 'losses', lb.losses, 'streak', lb.streak, 'maxStreak', lb.max_streak, 'exp', lb.experience, 'seasonRank', lb.season_rank, 'seasonLevel', lb.season_level) as season, 
    jsonb_build_object('authLevel', ur.auth_level, 'rankName', ur."name") as rank 
    from users as u 
    left join ladderboard as lb 
        on u.id = lb.user_id 
    left join user_rank as ur 
        on u.user_rank_id = ur.id
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
    const file = req.files.file;
    const p = path_1.join(process.cwd(), `/public/img/avatars/${filename}.jpg`);
    try {
        yield file.mv(p);
        yield db_1.pool.query("UPDATE users SET avatar = $1 where id = $2", [
            `${filename}.jpg`,
            id,
        ]);
        return res.status(200).json({ success: true });
    }
    catch (err) {
        res.status(501).end();
        throw err;
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
//# sourceMappingURL=user.controller.js.map