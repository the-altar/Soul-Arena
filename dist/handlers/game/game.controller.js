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
exports.setTheme = exports.themes = exports.character = exports.missions = exports.deleteMissionTracks = exports.missionTracks = exports.trackMission = exports.user = exports.file = void 0;
const logger_1 = require("../../lib/logger");
const db_1 = require("../../db");
const sql = __importStar(require("./game.queries"));
exports.file = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.sendFile("index.html", { root: "./public/game/build" });
});
exports.user = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.res.locals.id;
    try {
        const doc = yield db_1.pool.query(sql.userQuery, [id]);
        const user = Object.assign(Object.assign({}, doc.rows[0]), { auth: true });
        res.status(200).json(user);
    }
    catch (err) {
        throw err;
    }
});
exports.trackMission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.res.locals.id;
    try {
        yield db_1.pool.query(sql.trackMissionQuery, [req.body[0], req.body[1], id]);
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
    try {
        const r = yield db_1.pool.query(sql.missionTrackQuery, [id, mission_id]);
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
    try {
        yield db_1.pool.query(sql.deleteMissionTrackQuery, [userId, missionId]);
        return res.status(200).json({ success: true });
    }
    catch (err) {
        res.status(501).json({ success: false });
        throw err;
    }
});
exports.missions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.res.locals.id;
    try {
        const r = yield db_1.pool.query(sql.selectMissionQuery, [id]);
        return res.status(200).json(r.rows);
    }
    catch (err) {
        res.status(501);
        throw err;
    }
});
exports.character = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let r;
    try {
        if (req.res.locals.token.authLevel < 10) {
            r = yield db_1.pool.query(sql.selectCharacterQuery);
        }
        else {
            r = yield db_1.pool.query(sql.selectMasterCharacterQuery);
        }
        return res.json(r.rows);
    }
    catch (err) {
        res.status(500).send("Something went wrong...");
        throw err;
    }
});
exports.themes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const level = req.res.locals.token.authLevel;
    try {
        const r = yield db_1.pool.query(sql.selectThemeQuery, [level]);
        res.status(200).json(r.rows);
    }
    catch (e) {
        logger_1.log.error(e);
        res.status(501).json({});
    }
});
exports.setTheme = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.res.locals.id;
    const themeId = req.body.themeId;
    try {
        yield db_1.pool.query(sql.updateUserThemeQuery, [userId, themeId]);
        return res.status(200).json({});
    }
    catch (err) {
        logger_1.log.error(err);
        return res.status(500).json({});
    }
});
//# sourceMappingURL=game.controller.js.map