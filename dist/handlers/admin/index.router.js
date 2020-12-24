"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const express_1 = require("express");
const router = express_1.Router();
router.get("/roster", (req, res) => {
    return res.sendFile("index.html", { root: "./public/admin" });
});
router.get("roster/:id", (req, res) => {
    return res.sendFile("index.html", { root: "./public/admin" });
});
router.get("/skills", (req, res) => {
    console.log("Asking for roster");
    return res.sendFile("index.html", { root: "./public/admin" });
});
router.get("/skills/:id", (req, res) => {
    return res.sendFile("index.html", { root: "./public/admin" });
});
router.get("/skills/:effect/:id", (req, res) => {
    return res.sendFile("index.html", { root: "./public/admin" });
});
router.get("/license", (req, res) => {
    return res.sendFile("index.html", { root: "./public/admin" });
});
router.get("/license/:id", (req, res) => {
    return res.sendFile("index.html", { root: "./public/admin" });
});
exports.adminRouter = router;
//# sourceMappingURL=index.router.js.map