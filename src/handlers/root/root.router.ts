import { Router } from "express";
import {
  baseController,
  enums,
  topLadder,
  topStreak,
  usersOnline,
} from "./root.controller";
import { authenticate } from "../../middlewares";
const router: Router = Router();

// BACK END SERVICES
router.get("/online", usersOnline);
router.get("/ladder", topLadder);
router.get("/streak", topStreak);
router.get("/game-enums", enums);

// FRONT END
router.get("/register", baseController);
router.get("/login", baseController);
router.get("/user/:username", baseController);
router.get("/news/:id/:title", baseController);
router.get("/game-manual", baseController);
router.get("/characters-and-skills", baseController);
router.get("/characters-and-skills/:characterId", baseController);
router.get("/", baseController);

export const rootRouter = router;
