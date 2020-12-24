import { Router, Request, Response } from "express";

const router: Router = Router();
router.get("/roster", (req: Request, res: Response) => {
  return res.sendFile("index.html", { root: "./public/admin" });
});
router.get("roster/:id", (req: Request, res: Response) => {
  return res.sendFile("index.html", { root: "./public/admin" });
});

router.get("/skills", (req: Request, res: Response) => {
  console.log("Asking for roster");
  return res.sendFile("index.html", { root: "./public/admin" });
});

router.get("/skills/:id", (req: Request, res: Response) => {
  return res.sendFile("index.html", { root: "./public/admin" });
});
router.get("/skills/:effect/:id", (req: Request, res: Response) => {
  return res.sendFile("index.html", { root: "./public/admin" });
});
router.get("/license", (req: Request, res: Response) => {
  return res.sendFile("index.html", { root: "./public/admin" });
});
router.get("/license/:id", (req: Request, res: Response) => {
  return res.sendFile("index.html", { root: "./public/admin" });
});

export const adminRouter = router;
