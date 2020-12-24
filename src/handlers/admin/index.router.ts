import { Router, Request, Response } from "express";
import { authenticateAdmin } from "../../middlewares";

const router: Router = Router();
router.get("/", [authenticateAdmin], (req:Request, res:Response)=>{
  return res.send("This is the root route")
})  

router.get("/roster", [authenticateAdmin], (req: Request, res: Response) => {
  return res.sendFile("index.html", { root: "./public/admin" });
});
router.get("roster/:id", [authenticateAdmin], (req: Request, res: Response) => {
  return res.sendFile("index.html", { root: "./public/admin" });
});
router.get("/skills", [authenticateAdmin], (req: Request, res: Response) => {
  console.log("Asking for roster");
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
router.get("/unauthorized", (req: Request, res: Response) => {
  res.send("UNAUTHORIZED");
});
router.get("/*", (req: Request, res: Response) => {
  res.send("Page doesn't exist");
});

export const adminRouter = router;
