import { Router } from "express";
import {
  baseController,
  topLadder,
  topStreak,
  uploadController,
  usersOnline,
} from "./root.controller";
import { authenticate } from "../../middlewares";
const router: Router = Router();

// BACK END SERVICES
router.get("/online", usersOnline);
router.get("/ladder", topLadder);
router.get("/streak", topStreak);
router.put("/upload", uploadController);
router.post("/upload", uploadController);

// FRONT END
router.get("/register", baseController);
router.get("/login", baseController);
router.get("/user/:username", baseController);
router.get("/news/:id/:title", baseController);
router.get("/", baseController);

export const rootRouter = router;
