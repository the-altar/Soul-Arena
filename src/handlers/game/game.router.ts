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
import { authUserGameSession, authenticate } from "../../middlewares";

export const gameRouter = Router();

gameRouter.get("/user", [authUserGameSession], user);
gameRouter.get("/character", character);
gameRouter.post("/track", [authenticate], trackMission);
gameRouter.get("/mission", [authenticate], missions);
gameRouter.get("/mission/:mission_id", [authenticate], missionTracks);
gameRouter.delete("/mission/:missionId", [authenticate], deleteMissionTracks);

gameRouter.get("/ingame", file);
gameRouter.get("/lobby", file);
gameRouter.get("/", file);
