import express from "express";
import cors from "cors";
import apiRoutes from "./routes/index.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import { connectDatabase } from "./config/database.js";
import { config, validateEnvironment, logConfiguration } from "./config/environment.js";

// Validate environment variables
validateEnvironment();

const app = express();

// Basic middleware
app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}));
app.use(express.json());

// Log current configuration
logConfiguration();

// Connect to database (optional - fallback to in-memory if not available)
if (config.mongodbUri && config.mongodbUri !== "mongodb://localhost:27017/kanban") {
  connectDatabase().catch((err) => {
    console.warn(
      "⚠️ Database connection failed, using in-memory storage:",
      err.message
    );
  });
} else {
  console.log("🔄 Using in-memory storage (no database configured)");
}

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Kanban Dashboard API",
    version: "1.0.0",
    endpoints: ["/api/projects", "/api/tasks"],
  });
});

// API routes
app.use("/api", apiRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

// Start server
app.listen(config.port, () => {
  console.log(`🚀 Server running on port ${config.port}`);
  console.log(`📚 API endpoints available at http://localhost:${config.port}/api`);
});

export default app;
