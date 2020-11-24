import { Router } from 'express'
import { baseController, uploadController} from './root.controller'
import { authenticate } from "../../middlewares"
const router: Router = Router()

router.get('/', baseController)
router.put('/upload', uploadController)
router.post('/upload', uploadController)

export const rootRouter = router