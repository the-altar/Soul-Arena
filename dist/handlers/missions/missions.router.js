"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.missionRouter = void 0;
const express_1 = require("express");
const missions_handler_1 = require("./missions.handler");
const router = express_1.Router();
router.get("/", missions_handler_1.findAll);
router.get("/:id", missions_handler_1.findOne);
router.post("/create", missions_handler_1.create);
router.post("/update", missions_handler_1.update);
router.delete("/:missionId/:banner", missions_handler_1.remove);
exports.missionRouter = router;
//# sourceMappingURL=missions.router.js.map