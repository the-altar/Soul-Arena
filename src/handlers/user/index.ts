import { Router } from 'express'
import { loggerMiddleware, register, login, logout, mount, user, uploadAvatar, defaultAvatar } from "./user.controller"
import { authenticate } from "../../middlewares"
const router: Router = Router()

//router.get("/unlocked",)
router.post("/register", register)
router.post("/login", login)
router.post("/logout", logout)
router.post("/:username", user)
router.post("/avatar/:id", [authenticate], uploadAvatar)
router.post("/avatar/:id/:filename", [authenticate], defaultAvatar)
router.get("/", [loggerMiddleware], mount)

export const userRouter = router;