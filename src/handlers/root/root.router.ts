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

router.get("/online", usersOnline);
router.get("/ladder", topLadder);
router.get("/streak", topStreak);
router.put("/upload", uploadController);
router.post("/upload", uploadController);
router.get("/", baseController);

export const rootRouter = router;
