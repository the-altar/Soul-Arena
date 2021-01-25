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
exports.adminRouter = void 0;
const express_1 = require("express");
const db_1 = require("../../db");
const logger_1 = require("../../lib/logger");
const middlewares_1 = require("../../middlewares");
const queries = __importStar(require("./admin.queries"));
const router = express_1.Router();
router.get("/", [middlewares_1.authenticateAdmin], (req, res) => {
    return res.send("This is the root route");
});
router.get("/roster", [middlewares_1.authenticateAdmin], (req, res) => {
    return res.sendFile("index.html", { root: "./public/admin" });
});
router.get("roster/:id", [middlewares_1.authenticateAdmin], (req, res) => {
    return res.sendFile("index.html", { root: "./public/admin" });
});
router.get("/skills", [middlewares_1.authenticateAdmin], (req, res) => {
    return res.sendFile("index.html", { root: "./public/admin" });
});
router.get("/skills/:id", [middlewares_1.authenticateAdmin], (req, res) => {
    return res.sendFile("index.html", { root: "./public/admin" });
});
router.get("/skills/:effect/:id", [middlewares_1.authenticateAdmin], (req, res) => {
    return res.sendFile("index.html", { root: "./public/admin" });
});
router.get("/license", [middlewares_1.authenticateAdmin], (req, res) => {
    return res.sendFile("index.html", { root: "./public/admin" });
});
router.get("/license/:id", [middlewares_1.authenticateAdmin], (req, res) => {
    return res.sendFile("index.html", { root: "./public/admin" });
});
router.get("/game-stats", [middlewares_1.authenticateAdmin], (req, res) => {
    return res.sendFile("index.html", { root: "./public/admin" });
});
router.get("/unauthorized", (req, res) => {
    res.send("UNAUTHORIZED");
});
router.get("/api/game-stats", [middlewares_1.authenticateAdmin], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const r = yield db_1.pool.query(queries.gameStatsQuery);
        return res.status(200).json(r.rows);
    }
    catch (e) {
        logger_1.log.error(e);
        res.status(500).json({});
    }
}));
exports.adminRouter = router;
//# sourceMappingURL=index.router.js.map