import { Router } from "express";
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTasksByProject,
  updateTaskStatus,
} from "../controllers/taskController";
import {
  validateCreateTask,
  validateUpdateTask,
  validateId,
  validateTaskQuery,
} from "../middleware/validation";

const router = Router();

// GET /api/tasks
router.get("/", validateTaskQuery, getTasks);

// GET /api/tasks/:id
router.get("/:id", validateId, getTask);

// POST /api/tasks
router.post("/", validateCreateTask, createTask);

// PUT /api/tasks/:id
router.put("/:id", validateUpdateTask, updateTask);

// DELETE /api/tasks/:id
router.delete("/:id", validateId, deleteTask);

// PATCH /api/tasks/:id/status
router.patch("/:id/status", validateId, updateTaskStatus);

// GET /api/projects/:projectId/tasks
router.get("/projects/:projectId", validateId, getTasksByProject);

export default router;
