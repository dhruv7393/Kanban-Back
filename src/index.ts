import express from "express";
import cors from "cors";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import { connectDatabase } from "./config/database.js";
import {
  config,
  validateEnvironment,
  logConfiguration,
} from "./config/environment.js";
import { errorHandler } from "./middleware/errorHandler.js";

// Validate environment variables
validateEnvironment();

const app = express();

// Basic middleware
app.use(
  cors({
    origin: config.corsOrigins,
    credentials: true,
  })
);
app.use(express.json());

// Log current configuration
logConfiguration();

// Connect to database (required for API functionality)
connectDatabase().catch((err) => {
  console.error("❌ Database connection failed:", err.message);
  console.error("Full error:", err);
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Kanban Dashboard API",
    version: "1.0.0",
    endpoints: ["/api/projects", "/api/tasks"],
    mongodbUri: process.env.MONGODB_URI || "no uri",
    corsOrigins: process.env.CORS_ORIGINS || "no cors",
    nodeEnv: process.env.NODE_ENV || "no env",
  });
});

// API routes
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

// Global error handler (must be last middleware)
app.use(errorHandler);

// For serverless deployment (AWS Amplify)
export default app;

// For local development
if (process.env.NODE_ENV !== "production") {
  app.listen(config.port, () => {
    console.log(`🚀 Server running on port ${config.port}`);
    console.log(
      `📚 API endpoints available at http://localhost:${config.port}/api`
    );
  });
}
