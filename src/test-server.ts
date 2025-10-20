import express from "express";
import cors from "cors";
import { connectDatabase } from "./config/database.js";
import { TaskService } from "./services/TaskService.js";
import { ProjectService } from "./services/ProjectService.js";
import { ApiResponse } from "./types/index.js";
import { asyncHandler } from "./middleware/errorHandler.js";
import { config, validateEnvironment, logConfiguration } from "./config/environment.js";

// Validate environment variables
validateEnvironment();

const app = express();

// CORS configuration
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Log current configuration
logConfiguration();

// Initialize services
const taskService = new TaskService();
const projectService = new ProjectService();

// API routes
app.get("/api/health", (req, res) => {
  const response: ApiResponse<{
    status: string;
    timestamp: string;
    uptime: number;
  }> = {
    success: true,
    data: {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
    message: "API is running",
  };
  res.status(200).json(response);
});

app.get(
  "/api/projects",
  asyncHandler(async (req, res) => {
    const projects = await projectService.getAllProjects();
    const response: ApiResponse<typeof projects> = {
      success: true,
      data: projects,
      message: "Projects retrieved successfully",
    };
    res.status(200).json(response);
  })
);

app.get(
  "/api/tasks",
  asyncHandler(async (req, res) => {
    const query = {
      sortBy: (req.query.sortBy as string) || "createdAt",
      sortOrder: (req.query.sortOrder as "asc" | "desc") || "desc",
      status: req.query.status as "backlog" | "blocked" | "todo" | "done",
      priority: req.query.priority as "low" | "medium" | "high",
      project_id: req.query.project_id as string,
      search: req.query.search as string,
    };

    const tasks = await taskService.getAllTasks(query);
    const response: ApiResponse<typeof tasks> = {
      success: true,
      data: tasks,
      message: "Tasks retrieved successfully",
    };
    res.status(200).json(response);
  })
);

// Root endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Kanban Dashboard API - Test Mode",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      projects: "/api/projects",
      tasks: "/api/tasks",
    },
  });
});

// Start server
const startServer = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    await connectDatabase();

    // Start the server
    app.listen(config.port, () => {
      console.log(`🚀 Test server running on port ${config.port}`);
      console.log(`📚 API available at http://localhost:${config.port}`);
      console.log(`🔍 Health check: http://localhost:${config.port}/api/health`);
      console.log(`💾 Connected to database - using real data`);
    });
  } catch (error) {
    console.error("❌ Failed to start test server:", error);
    process.exit(1);
  }
};

// Start the server
startServer();

export default app;
