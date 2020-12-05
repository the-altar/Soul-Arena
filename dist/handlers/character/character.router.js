"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.characterRouter = void 0;
const express_1 = require("express");
const character_controller_1 = require("./character.controller");
const middlewares_1 = require("../../middlewares");
const router = express_1.Router();
router.get("/", character_controller_1.getAll);
router.get("/ids", character_controller_1.getIds);
router.get('/:id', character_controller_1.find);
router.post('/upload', character_controller_1.upload);
router.post("/file/:filename", character_controller_1.uploadFiles);
router.post('/new', character_controller_1.create);
router.post('/update', character_controller_1.update);
router.post('/purchase', [middlewares_1.authenticate], character_controller_1.purchase);
exports.characterRouter = router;
//# sourceMappingURL=character.router.js.map