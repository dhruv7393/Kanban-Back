// src/index.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import logger from "./config/logger";
import { connectDatabase } from "./config/database";
import {
  config,
  validateEnvironment,
  logConfiguration,
} from "./config/environment";
import { errorHandler } from "./middleware/errorHandler";
import { checkDatabaseConnection } from "./middleware/databaseCheck";
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

// Check database connection for API routes
app.use(checkDatabaseConnection);

app.get("/", (_req: express.Request, res: express.Response) => {
  const dbConnectionState = mongoose.connection.readyState;
  const dbStates = {
    0: "disconnected",
    1: "connected", 
    2: "connecting",
    3: "disconnecting"
  };

  res.json({
    message: "Kanban Dashboard API",
    version: "1.0.0",
    endpoints: ["/api/projects", "/api/tasks"],
    database: {
      mongodbUri: process.env.MONGODB_URI ? "configured" : "missing",
      connectionState: dbStates[dbConnectionState as keyof typeof dbStates] || "unknown",
      connectionStateCode: dbConnectionState,
      databaseName: mongoose.connection.name || "none"
    },
    environment: {
      nodeEnv: process.env.NODE_ENV || "no env",
      corsOrigins: process.env.CORS_ORIGINS ? "configured" : "missing",
      port: process.env.PORT || config.port
    },
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoint
app.get("/health", (_req: express.Request, res: express.Response) => {
  const dbConnectionState = mongoose.connection.readyState;
  const dbStates = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting"
  };

  res.json({
    status: "healthy",
    environment: config.nodeEnv,
    port: config.port,
    corsOrigins: config.corsOrigins,
    mongoConnected: !!config.mongodbUri,
    mongoState: dbStates[dbConnectionState as keyof typeof dbStates] || "unknown",
    mongoStateCode: dbConnectionState,
    dbName: mongoose.connection.name || "none",
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
