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
exports.topStreak = exports.topLadder = exports.usersOnline = exports.uploadController = exports.baseController = void 0;
const db_1 = require("../../db");
const logger_1 = require("../../lib/logger");
exports.baseController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.sendFile("index.html", { root: "./public/main" });
});
exports.uploadController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.json([{ url: "/absolute/path/to/filename.png" }]);
});
exports.usersOnline = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sql = `SELECT count(*) as "count" from usersOnline`;
        const rows = yield db_1.pool.query(sql);
        return res.status(200).json(rows.rows[0]);
    }
    catch (e) {
        logger_1.log.error(e);
        return res.status(500).json({ count: 0 });
    }
});
exports.topLadder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sql = `select u.username, u.id, l.season_level, l.experience
  from
    ladderboard l
  join users u on
    u.id = l.user_id
  order by l.season_level desc limit 10;`;
    try {
        const data = yield db_1.pool.query(sql);
        return res.status(200).json(data.rows);
    }
    catch (e) {
        logger_1.log.error(e);
        return res.status(500).json([]);
    }
});
exports.topStreak = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sql = `select
    u.username ,
    u.id,
    l.max_streak
  from
    ladderboard l
  join users u on
    u.id = l.user_id
  order by l.max_streak desc;`;
    try {
        const data = yield db_1.pool.query(sql);
        return res.status(200).json(data.rows);
    }
    catch (e) {
        logger_1.log.error(e);
        return res.status(500).json([]);
    }
});
//# sourceMappingURL=root.controller.js.map