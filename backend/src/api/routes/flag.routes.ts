import { Router } from "express";
import { createFlagController, 
         getAllFlagsController,
         getFlagByKeyController,
         evaluateFlagController,
         updateFlagController,
         deleteFlagController
 } from "../controllers/flag.controller.js";

const router = Router();

router.route("/")
    .post(createFlagController)
    .get(getAllFlagsController);

router.post("/evaluate", evaluateFlagController);
    
router.route("/:key")
    .get(getFlagByKeyController)
    .patch(updateFlagController)
    .delete(deleteFlagController);
    


export default router;