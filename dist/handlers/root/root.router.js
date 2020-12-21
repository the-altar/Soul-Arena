"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootRouter = void 0;
const express_1 = require("express");
const root_controller_1 = require("./root.controller");
const router = express_1.Router();
router.get("/online", root_controller_1.usersOnline);
router.get("/ladder", root_controller_1.topLadder);
router.get("/streak", root_controller_1.topStreak);
router.put("/upload", root_controller_1.uploadController);
router.post("/upload", root_controller_1.uploadController);
router.get("/", root_controller_1.baseController);
exports.rootRouter = router;
//# sourceMappingURL=root.router.js.map