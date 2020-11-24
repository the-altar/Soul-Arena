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
exports.remove = exports.update = exports.find = exports.get = exports.create = void 0;
const db_1 = require("../../db");
exports.create = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const skill = req.body;
        const text = "INSERT INTO effect (data,skill_id) values ($1, $2)";
        try {
            yield db_1.pool.query(text, skill);
            return res.json({ code: 1 });
        }
        catch (err) {
            return res.json({ code: 0 });
        }
    });
};
exports.get = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const values = [req.body];
        const TEXT = "select * from effect where skill_id = any ($1);";
        try {
            const data = yield db_1.pool.query(TEXT, values);
            return res.json(data.rows);
        }
        catch (err) {
            res.status(500);
            return res.json({});
        }
    });
};
exports.find = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const value = [id];
        const text = "SELECT * FROM effect WHERE id = $1 order by priority DESC";
        try {
            const data = yield db_1.pool.query(text, value);
            return res.json(data.rows[0]);
        }
        catch (err) {
            return res.status(500);
        }
    });
};
exports.update = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const text = "UPDATE effect SET data = $1, skill_id = $3, priority = $4 where id = $2";
        const values = req.body;
        try {
            yield db_1.pool.query(text, values);
            return res.json({ code: 1 });
        }
        catch (err) {
            return res.json({ code: 0 });
        }
    });
};
exports.remove = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const text = "DELETE from effect where id = $1";
        const values = [Number(req.params.id)];
        try {
            yield db_1.pool.query(text, values);
            res.status(200);
            return res.json({ code: 1 });
        }
        catch (err) {
            res.status(404);
            throw (err);
        }
    });
};
//# sourceMappingURL=effect.controller.js.map