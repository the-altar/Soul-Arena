"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const middlewares_1 = require("../../middlewares");
const router = express_1.Router();
//router.get("/unlocked",)
router.post("/register", user_controller_1.register);
router.post("/login", user_controller_1.login);
router.post("/logout", user_controller_1.logout);
router.post("/:username", user_controller_1.user);
router.post("/avatar/:id", [middlewares_1.authenticate], user_controller_1.uploadAvatar);
router.post("/avatar/:id/:filename", [middlewares_1.authenticate], user_controller_1.defaultAvatar);
router.get("/match-history/:id", user_controller_1.matchHistory);
router.get("/", [user_controller_1.loggerMiddleware], user_controller_1.mount);
exports.userRouter = router;
//# sourceMappingURL=index.js.map