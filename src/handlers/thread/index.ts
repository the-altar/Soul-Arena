import { Router } from "express";
import {
  news,
  findThread,
  postThread,
  updateThread,
  postComment,
  getPosts,
  deletePost,
} from "./thread.controller";
import { authenticate } from "../../middlewares";
const router: Router = Router();

router.get("/news", news);
router.get("/:id/:siteArea", findThread);
router.get("/:id/comments/:limit", getPosts);

//NEEDS AUTHENTICATION
router.post("/", [authenticate], postThread);
router.put("/", [authenticate], updateThread);
router.post("/comment", [authenticate], postComment);
router.delete("/comment/:id/:userId", [authenticate], deletePost);

export const threadRouter = router;
