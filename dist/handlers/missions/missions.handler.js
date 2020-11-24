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
exports.remove = exports.update = exports.findOne = exports.findAll = exports.create = void 0;
const db_1 = require("../../db");
const path_1 = require("path");
const fs_1 = require("fs");
exports.create = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const sql = `INSERT INTO mission (name, description, goals, level_requirement, unlocked_entity, cost, banner, released) 
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`;
        try {
            db_1.pool.query(sql, req.body);
            res.status(200).json({ success: true });
        }
        catch (err) {
            res.status(401).json({ success: false });
            throw (err);
        }
    });
};
exports.findAll = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const sql = `SELECT * from mission`;
        try {
            const r = yield db_1.pool.query(sql);
            return res.status(200).json({ success: true, missions: r.rows });
        }
        catch (err) {
            res.status(501).json({ success: false });
            throw (err);
        }
    });
};
exports.findOne = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const sql = `select * from mission where id = $1`;
        try {
            const r = yield db_1.pool.query(sql, [req.params.id]);
            return res.status(200).json({ success: true, mission: r.rows[0] });
        }
        catch (err) {
            res.status(401).json({ success: false });
            throw (err);
        }
    });
};
exports.update = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const sql = `UPDATE mission 
    SET name = $1, description = $2, goals = $3, level_requirement = $4, unlocked_entity = $5, cost = $6, banner = $7, released = $8 
    WHERE id = $9`;
        try {
            yield db_1.pool.query(sql, req.body);
            return res.status(200).json({ success: true });
        }
        catch (err) {
            res.status(401).json({ success: false });
            throw (err);
        }
    });
};
exports.remove = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = Number(req.params.missionId);
        const banner = req.params.banner;
        try {
            yield db_1.pool.query("DELETE from mission WHERE id = $1", [id]);
            const p = path_1.join(process.cwd(), '/public/img/game/', banner + ".jpg");
            if (fs_1.existsSync(p)) {
                fs_1.unlink(p, () => { });
            }
            return res.status(200).json({ success: true });
        }
        catch (e) {
            res.status(501).json({ success: false });
            throw (e);
        }
    });
};
//# sourceMappingURL=missions.handler.js.map