import { Router } from "express";

const router = Router();

// TODO: will add route modules in Step 3
router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

export default router;
