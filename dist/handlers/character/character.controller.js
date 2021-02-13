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
exports.uploadFiles = exports.upload = exports.profile = exports.profiles = exports.purchase = exports.getIds = exports.getAll = exports.find = exports.update = exports.create = void 0;
const path_1 = require("path");
//import { unlink, existsSync } from 'fs'
const query = __importStar(require("./character.queries"));
const db_1 = require("../../db");
const logger_1 = require("../../lib/logger");
exports.create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Req.body = [released, charData, isFree]
    const text = "INSERT INTO entity (released, data, isfree) VALUES ($1, $2, $3)";
    try {
        yield db_1.pool.query(text, req.body);
        return res.json({ code: 1 });
    }
    catch (err) {
        logger_1.log.error(err);
        return res.status(500).json({});
    }
});
exports.update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Req.body = [id, released, charData, isFree]
    const text = "UPDATE entity SET released = $2, data = $3, isfree = $4 WHERE id = $1";
    try {
        yield db_1.pool.query(text, req.body);
        return res.json({ code: 1 });
    }
    catch (err) {
        logger_1.log.error(err);
        return res.status(500).json({});
    }
});
exports.find = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const char = yield db_1.pool.query("SELECT * from entity where entity.id = $1", [
            req.params.id,
        ]);
        return res.json(char.rows[0]);
    }
    catch (err) {
        logger_1.log.error(err);
        return res.status(500).json({});
    }
});
exports.getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const docs = yield db_1.pool.query("SELECT * from entity");
        return res.json(docs.rows);
    }
    catch (err) {
        logger_1.log.error(err);
        return res.status(500).json({});
    }
});
exports.getIds = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const text = `SELECT id, data -> 'name' AS name, data -> 'dexNumber' as "dexNumber" from entity`;
    try {
        const r = yield db_1.pool.query(text);
        return res.json(r.rows);
    }
    catch (err) {
        logger_1.log.error(err);
        return res.status(500).json({});
    }
});
exports.purchase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sql0 = `SELECT coins from users where id=$1`;
    const sql1 = `UPDATE users SET coins = coins - $1 where id = $2`;
    const sql2 = `INSERT into obtained_entity (entity_id, user_id) VALUES ($1, $2)`;
    try {
        const data = yield db_1.pool.query(sql0, [req.body.userId]);
        if (data.rows[0].coins <= parseInt(req.body.coins))
            return res.status(406).json({});
        yield db_1.pool.query(sql1, [req.body.coins, req.body.userId]);
        yield db_1.pool.query(sql2, [req.body.characterId, req.body.userId]);
        return res.status(200).json({ success: true });
    }
    catch (err) {
        logger_1.log.error(err);
        return res.status(500).json({});
    }
});
exports.profiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield db_1.pool.query(query.profilesQuery);
        return res.status(200).json(data.rows);
    }
    catch (e) {
        logger_1.log.error(e);
        return res.status(500).json([]);
    }
});
exports.profile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield db_1.pool.query(query.profileQuery, [Number(req.params.id)]);
        return res.status(200).json(data.rows[0]);
    }
    catch (e) {
        logger_1.log.error(e);
        return res.status(500).json([]);
    }
});
exports.upload = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    for (const file in req.files) {
        const f = req.files[file];
        const p = path_1.join(process.cwd(), "/public/game/uploads", f.name + ".jpg");
        f.mv(p, (err) => {
            if (err) {
                console.log(err);
                return res.status(500).json({});
            }
        });
    }
    return res.send("File uploaded!");
});
exports.uploadFiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = [];
    for (const file in req.files) {
        const f = req.files[file];
        const p = path_1.join(process.cwd(), "/public/game/uploads", req.params.filename + ".jpg");
        f.mv(p, (err) => {
            if (err) {
                return res.status(500).json({});
            }
            response.push({
                url: `http://localhost:3000/img/game/${req.params.filename}.jpg`,
            });
        });
    }
    return 1;
});
//# sourceMappingURL=character.controller.js.map