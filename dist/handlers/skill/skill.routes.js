"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.skillRouter = void 0;
const express_1 = require("express");
const skill_controller_1 = require("./skill.controller");
const router = express_1.Router();
router.get("/", skill_controller_1.get);
router.get("/ids", skill_controller_1.getIds);
router.get("/:id", skill_controller_1.find);
router.post("/delete");
router.post("/update", skill_controller_1.update);
router.post("/new", skill_controller_1.create);
exports.skillRouter = router;
//# sourceMappingURL=skill.routes.js.map