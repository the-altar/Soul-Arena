"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootRouter = void 0;
const express_1 = require("express");
const root_controller_1 = require("./root.controller");
const router = express_1.Router();
// BACK END SERVICES
router.get("/online", root_controller_1.usersOnline);
router.get("/ladder", root_controller_1.topLadder);
router.get("/streak", root_controller_1.topStreak);
router.get("/game-enums", root_controller_1.enums);
// FRONT END
router.get("/register", root_controller_1.baseController);
router.get("/login", root_controller_1.baseController);
router.get("/user/:username", root_controller_1.baseController);
router.get("/news/:id/:title", root_controller_1.baseController);
router.get("/", root_controller_1.baseController);
exports.rootRouter = router;
//# sourceMappingURL=root.router.js.map