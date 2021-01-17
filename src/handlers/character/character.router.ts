import { Router } from "express";
import {
  upload,
  getAll,
  getIds,
  create,
  update,
  find,
  uploadFiles,
  purchase,
  profiles,
  profile,
} from "./character.controller";
import { authenticate } from "../../middlewares";

const router: Router = Router();
router.get("/", getAll);
router.get("/ids", getIds);
router.get("/:id", find);
router.get("/api/profile", profiles);
router.get("/api/profile/:id", profile);

router.post("/upload", upload);
router.post("/new", create);
router.post("/update", update);
router.post("/purchase", [authenticate], purchase);
router.post("/file/:filename", uploadFiles);

export const characterRouter: Router = router;
