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
exports.getIds = exports.update = exports.find = exports.get = exports.create = void 0;
const db_1 = require("../../db");
exports.create = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const text = "INSERT INTO skill (data) values ($1)";
        try {
            yield db_1.pool.query(text, req.body);
            return res.json({ code: 1 });
        }
        catch (err) {
            return res.json({ code: 0 });
        }
    });
};
exports.get = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield db_1.pool.query("SELECT * FROM skill order by priority");
            return res.json(data.rows);
        }
        catch (err) {
            return res.status(500);
        }
    });
};
exports.find = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const value = [id];
        const text = "SELECT * FROM skill WHERE id = $1";
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
        const text = "UPDATE skill SET data = $1, entity_id = $3, priority = $4  where id = $2";
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
exports.getIds = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const text = "SELECT id, data -> 'name' AS name from skill";
        try {
            const r = yield db_1.pool.query(text);
            return res.json(r.rows);
        }
        catch (err) {
            res.status(500);
            return res.send("Something went wrong...");
        }
    });
};
//# sourceMappingURL=skill.controller.js.map