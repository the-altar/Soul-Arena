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
exports.enums = exports.topStreak = exports.topLadder = exports.usersOnline = exports.baseController = void 0;
const e = __importStar(require("../../lib/engine/enums"));
const db_1 = require("../../db");
const logger_1 = require("../../lib/logger");
exports.baseController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.sendFile("index.html", { root: "./public/main" });
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
    const sql = `select u.username, u.avatar, u.id, l.season_level, l.experience
  from
    ladderboard l
  join users u on
    u.id = l.user_id
  order by l.season_level desc limit 5;`;
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
        const data = yield db_1.pool.query(sql);
        return res.status(200).json(data.rows);
    }
    catch (e) {
        logger_1.log.error(e);
        return res.status(500).json([]);
    }
});
exports.enums = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.json({
        pokemonTypings: e.Types,
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
});
//# sourceMappingURL=root.controller.js.map