import { Router } from "express";
import flagRoutes from "./routes/flag.routes.js"

const router = Router();

router.use("/flags", flagRoutes);

router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

export default router;
