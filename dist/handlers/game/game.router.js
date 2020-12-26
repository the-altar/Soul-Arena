"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameRouter = void 0;
const game_controller_1 = require("./game.controller");
const express_1 = require("express");
const middlewares_1 = require("../../middlewares");
exports.gameRouter = express_1.Router();
exports.gameRouter.get("/user", [middlewares_1.authUserGameSession], game_controller_1.user);
exports.gameRouter.get("/character", [middlewares_1.authUserGameSession], game_controller_1.character);
exports.gameRouter.post("/track", [middlewares_1.authUserGameSession], game_controller_1.trackMission);
exports.gameRouter.get("/mission", [middlewares_1.authUserGameSession], game_controller_1.missions);
exports.gameRouter.get("/mission/:mission_id", [middlewares_1.authUserGameSession], game_controller_1.missionTracks);
exports.gameRouter.delete("/mission/:missionId", [middlewares_1.authUserGameSession], game_controller_1.deleteMissionTracks);
exports.gameRouter.get("/ingame", [middlewares_1.authUserGameSession], game_controller_1.file);
exports.gameRouter.get("/lobby", [middlewares_1.authUserGameSession], game_controller_1.file);
exports.gameRouter.get("/missions", [middlewares_1.authUserGameSession], game_controller_1.file);
exports.gameRouter.get("/login", game_controller_1.file);
exports.gameRouter.get("/", [middlewares_1.authUserGameSession], game_controller_1.file);
//# sourceMappingURL=game.router.js.map