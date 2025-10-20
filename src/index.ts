// src/index.ts
import express from "express";
import cors from "cors";
import process from "process";
import dotenv from "dotenv";
import logger from "./config/logger";
import { connectDatabase } from "./config/database";
import projectRoutes from "./routes/projectRoutes";
import taskRoutes from "./routes/taskRoutes";

dotenv.config();

const app: express.Application = express();
const port = 3001;

// Connect to database
connectDatabase();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (_req: express.Request, res: express.Response) => {
  res.json({
    message: "Kanban Dashboard API",
    version: "1.0.0",
    endpoints: ["/api/projects", "/api/tasks"],
    mongodbUri: process.env.MONGO_URI || "no uri",
    corsOrigins: process.env.CORS_ORIGINS || "no cors",
    nodeEnv: process.env.NODE_ENV || "no env",
  });
});

app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

app.listen(port, () => {
  logger.info(`Server has been initiated at: ${port}`);
  console.log("Server has been initiated at:", port);
});
