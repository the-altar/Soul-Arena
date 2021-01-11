import {
  file,
  missions,
  missionTracks,
  trackMission,
  deleteMissionTracks,
  user,
  character,
  themes,
  setTheme,
} from "./game.controller";
import { Router } from "express";
import { authUserGameSession } from "../../middlewares";

export const gameRouter = Router();

gameRouter.get("/user", [authUserGameSession], user);
gameRouter.post("/user/set-theme", [authUserGameSession], setTheme);
gameRouter.get("/character", [authUserGameSession], character);
gameRouter.post("/track", [authUserGameSession], trackMission);
gameRouter.get("/api/themes", [authUserGameSession], themes);
gameRouter.get("/mission", [authUserGameSession], missions);
gameRouter.get("/mission/:mission_id", [authUserGameSession], missionTracks);
gameRouter.delete(
  "/mission/:missionId",
  [authUserGameSession],
  deleteMissionTracks
);

gameRouter.get("/ingame", [authUserGameSession], file);
gameRouter.get("/lobby", [authUserGameSession], file);
gameRouter.get("/assignments", [authUserGameSession], file);
gameRouter.get("/login", file);
gameRouter.get("/", [authUserGameSession], file);
