import { Router } from "express";
import { createFlagController, 
         getAllFlagsController,
         getFlagByKeyController,
         evaluateFlagController
 } from "../controllers/flag.controller.js";

const router = Router();

router.route("/")
    .post(createFlagController)
    .get(getAllFlagsController);
    
router.post("/evaluate", evaluateFlagController);

router.get("/:key", getFlagByKeyController);


export default router;