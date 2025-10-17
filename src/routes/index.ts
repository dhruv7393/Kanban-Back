import { Router } from "express";
import projectRoutes from "./projectRoutes.js";
import taskRoutes from "./taskRoutes.js";

const router = Router();

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API routes
router.use("/projects", projectRoutes);
router.use("/tasks", taskRoutes);

export default router;
