import { Router } from 'express';
import { get, create, find, update, remove } from './effect.controller';

const router:Router = Router()  

router.get("/:id", find);
router.post("/", get);
router.post("/delete");
router.post("/update", update);
router.post("/new", create);
router.delete("/:id", remove);

export const effectRouter = router