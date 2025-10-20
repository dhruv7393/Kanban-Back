import { Router } from "express";

const router = Router();

// Health check endpoint
router.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;
