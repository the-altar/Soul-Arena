import { Router } from "express";
import {
  baseController,
  uploadController,
  usersOnline,
} from "./root.controller";
import { authenticate } from "../../middlewares";
const router: Router = Router();

router.get("/online", usersOnline);
router.put("/upload", uploadController);
router.post("/upload", uploadController);
router.get("/", baseController);

export const rootRouter = router;
