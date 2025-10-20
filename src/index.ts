// src/index.ts
import express from "express";
import cors from "cors";
import process from "process";
import dotenv from "dotenv";
import logger from "./config/logger";
dotenv.config();

const app: express.Application = express();
const port = 3000;
const mongourl: string = process.env.MONGODB_URI as string;

const connectDB = require("./config/db");
connectDB(mongourl);

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

const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");

app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

app.listen(port, () => {
  logger.info(`Server has been initiated at: ${port}`);
  console.log("Server has been initiated at:", port);
});
