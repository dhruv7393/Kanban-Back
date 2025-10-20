import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import apiRoutes from "./routes/index.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import { connectDatabase } from "./config/database.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Basic middleware
app.use(cors());
app.use(express.json());

// Connect to database (optional - fallback to in-memory if not available)
if (process.env.MONGODB_URI) {
  connectDatabase().catch((err) => {
    console.warn(
      "⚠️ Database connection failed, using in-memory storage:",
      err.message
    );
  });
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
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 API endpoints available at http://localhost:${PORT}/api`);
});

export default app;
