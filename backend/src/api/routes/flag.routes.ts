import { Router } from "express";
import {
  createFlagController,
  getAllFlagsController,
  getFlagByKeyController,
  updateFlagController,
  deleteFlagController,
  evaluateFlagController,
  rollbackFlagController
} from "../controllers/flag.controller.js";

const router = Router();

router.post("/", createFlagController);
router.get("/", getAllFlagsController);

router.post("/evaluate", evaluateFlagController);

router.post("/:key/rollback/:version", rollbackFlagController);

router.route("/:key")
  .get(getFlagByKeyController)
  .patch(updateFlagController)
  .delete(deleteFlagController);

export default router;
