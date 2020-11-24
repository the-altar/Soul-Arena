"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.effectRouter = void 0;
const express_1 = require("express");
const effect_controller_1 = require("./effect.controller");
const router = express_1.Router();
router.get("/:id", effect_controller_1.find);
router.post("/", effect_controller_1.get);
router.post("/delete");
router.post("/update", effect_controller_1.update);
router.post("/new", effect_controller_1.create);
router.delete("/:id", effect_controller_1.remove);
exports.effectRouter = router;
//# sourceMappingURL=effect.router.js.map