const { Router } = require("express");
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTasksByProject,
  updateTaskStatus,
} = require("../controllers/taskController");

const router = Router();

// GET /api/tasks
router.get("/", getTasks);

// GET /api/tasks/:id
router.get("/:id", getTask);

// POST /api/tasks
router.post("/", createTask);

// PUT /api/tasks/:id
router.put("/:id", updateTask);

// DELETE /api/tasks/:id
router.delete("/:id", deleteTask);

// PATCH /api/tasks/:id/status
router.patch("/:id/status", updateTaskStatus);

// GET /api/projects/:projectId/tasks
router.get("/projects/:projectId", getTasksByProject);

module.exports = router;
