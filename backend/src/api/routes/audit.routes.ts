import { Router } from "express";
import { getAuditLogs } from "../controllers/audit.controller.js";

const router = Router();

router.get("/flags/:key/audit", getAuditLogs);

export default router;
