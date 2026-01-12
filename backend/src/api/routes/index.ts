import { Router } from "express";
import flagRoutes from "./flag.routes.js";
import auditRoutes from "./audit.routes.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});


router.use(auditRoutes);

router.use("/flags", flagRoutes);

export default router;
