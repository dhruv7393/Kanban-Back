// src/index.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import logger from "./config/logger";
import { connectDatabase } from "./config/database";
import {
  config,
  validateEnvironment,
  logConfiguration,
} from "./config/environment";
import { errorHandler } from "./middleware/errorHandler";
import projectRoutes from "./routes/projectRoutes";
import taskRoutes from "./routes/taskRoutes";

dotenv.config();

// Validate environment variables
validateEnvironment();

// Log configuration for debugging
logConfiguration();

const app: express.Application = express();
const port = parseInt(config.port, 10);

// Connect to database
connectDatabase();

app.use(
  cors({
    origin: config.corsOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (_req: express.Request, res: express.Response) => {
  res.json({
    message: "Kanban Dashboard API",
    version: "1.0.0",
    endpoints: ["/api/projects", "/api/tasks"],
    mongodbUri: process.env.MONGO_URI || "no uri",
    mongoUri: process.env.MONGODB_URI || "no uri",
    corsOrigins: process.env.CORS_ORIGINS || "no cors",
    nodeEnv: process.env.NODE_ENV || "no env",
    status: "healthy",
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoint
app.get("/health", (_req: express.Request, res: express.Response) => {
  res.json({
    status: "healthy",
    environment: config.nodeEnv,
    port: config.port,
    corsOrigins: config.corsOrigins,
    mongoConnected: !!config.mongodbUri,
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

app.listen(port, () => {
  logger.info(`Server has been initiated at: ${port}`);
  console.log("Server has been initiated at:", port);
});
