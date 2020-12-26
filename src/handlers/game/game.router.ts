import {
  file,
  missions,
  missionTracks,
  trackMission,
  deleteMissionTracks,
  user,
  character,
} from "./game.controller";
import { Router } from "express";
import { authUserGameSession } from "../../middlewares";

export const gameRouter = Router();

gameRouter.get("/user", [authUserGameSession], user);
gameRouter.get("/character", [authUserGameSession], character);
gameRouter.post("/track", [authUserGameSession], trackMission);
gameRouter.get("/mission", [authUserGameSession], missions);
gameRouter.get("/mission/:mission_id", [authUserGameSession], missionTracks);
gameRouter.delete(
  "/mission/:missionId",
  [authUserGameSession],
  deleteMissionTracks
);

gameRouter.get("/ingame", [authUserGameSession], file);
gameRouter.get("/lobby", [authUserGameSession], file);
gameRouter.get("/missions", [authUserGameSession], file);
gameRouter.get("/login", file);
gameRouter.get("/", [authUserGameSession], file);
