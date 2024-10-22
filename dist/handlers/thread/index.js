"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.threadRouter = void 0;
const express_1 = require("express");
const thread_controller_1 = require("./thread.controller");
const middlewares_1 = require("../../middlewares");
const router = express_1.Router();
router.get("/news", thread_controller_1.news);
router.get("/news/heading", thread_controller_1.newsBanner);
router.get("/:id/:siteArea", thread_controller_1.findThread);
router.get("/:id/comments/:limit", thread_controller_1.getPosts);
//NEEDS AUTHENTICATION
router.post("/", [middlewares_1.authenticate], thread_controller_1.postThread);
router.put("/", [middlewares_1.authenticate], thread_controller_1.updateThread);
router.post("/comment", [middlewares_1.authenticate], thread_controller_1.postComment);
router.delete("/comment/:id/:userId", [middlewares_1.authenticate], thread_controller_1.deletePost);
exports.threadRouter = router;
//# sourceMappingURL=index.js.map