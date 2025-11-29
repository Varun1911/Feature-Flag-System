import { Router } from "express";
import { createFlagController } from "../controllers/flag.controller.js";

const router = Router();

router.post("/", createFlagController);

export default router;