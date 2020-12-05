import { Router } from 'express'
import { upload, getAll, getIds, create, update, find, uploadFiles, purchase} from './character.controller'
import { authenticate } from "../../middlewares"

const router: Router = Router()
router.get("/", getAll)
router.get("/ids", getIds)
router.get('/:id', find)
router.post('/upload', upload)
router.post("/file/:filename", uploadFiles)
router.post('/new', create)
router.post('/update', update)
router.post('/purchase', [authenticate], purchase)

export const characterRouter: Router = router 