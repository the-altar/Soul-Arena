"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const express_1 = require("express");
const middlewares_1 = require("../../middlewares");
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
    console.log("Asking for roster");
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
router.get("/unauthorized", (req, res) => {
    res.send("UNAUTHORIZED");
});
router.get("/*", (req, res) => {
    res.send("Page doesn't exist");
});
exports.adminRouter = router;
//# sourceMappingURL=index.router.js.map