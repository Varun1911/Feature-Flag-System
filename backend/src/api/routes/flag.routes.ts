import { Router } from "express";
import { createFlagController, 
         getAllFlagsController,
         getFlagByKeyController
 } from "../controllers/flag.controller.js";

const router = Router();

router.route("/")
    .post(createFlagController)
    .get(getAllFlagsController);


router.get("/:key", getFlagByKeyController);


export default router;