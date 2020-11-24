import { Router } from 'express';
import {create, findAll, findOne, update, remove} from "./missions.handler";

const router:Router = Router()  

router.get("/", findAll);
router.get("/:id", findOne);
router.post("/create", create);
router.post("/update", update);
router.delete("/:missionId/:banner", remove);

export const missionRouter = router