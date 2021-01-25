import { Router, Request, Response } from "express";
import { pool } from "../../db";
import { log } from "../../lib/logger";
import { authenticateAdmin } from "../../middlewares";
import * as queries from "./admin.queries";

const router: Router = Router();
router.get("/", [authenticateAdmin], (req: Request, res: Response) => {
  return res.send("This is the root route");
});

router.get("/roster", [authenticateAdmin], (req: Request, res: Response) => {
  return res.sendFile("index.html", { root: "./public/admin" });
});
router.get("roster/:id", [authenticateAdmin], (req: Request, res: Response) => {
  return res.sendFile("index.html", { root: "./public/admin" });
});
router.get("/skills", [authenticateAdmin], (req: Request, res: Response) => {
  return res.sendFile("index.html", { root: "./public/admin" });
});
router.get(
  "/skills/:id",
  [authenticateAdmin],
  (req: Request, res: Response) => {
    return res.sendFile("index.html", { root: "./public/admin" });
  }
);
router.get(
  "/skills/:effect/:id",
  [authenticateAdmin],
  (req: Request, res: Response) => {
    return res.sendFile("index.html", { root: "./public/admin" });
  }
);
router.get("/license", [authenticateAdmin], (req: Request, res: Response) => {
  return res.sendFile("index.html", { root: "./public/admin" });
});
router.get(
  "/license/:id",
  [authenticateAdmin],
  (req: Request, res: Response) => {
    return res.sendFile("index.html", { root: "./public/admin" });
  }
);
router.get(
  "/game-stats",
  [authenticateAdmin],
  (req: Request, res: Response) => {
    return res.sendFile("index.html", { root: "./public/admin" });
  }
);
router.get("/unauthorized", (req: Request, res: Response) => {
  res.send("UNAUTHORIZED");
});

router.get(
  "/api/game-stats",
  [authenticateAdmin],
  async (req: Request, res: Response) => {
    try {
      const r = await pool.query(queries.gameStatsQuery);
      return res.status(200).json(r.rows);
    } catch (e) {
      log.error(e);
      res.status(500).json({});
    }
  }
);

export const adminRouter = router;
