const { Router } = require("express");
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getProjectStats,
} = require("../controllers/projectController");

const router = Router();

// GET /api/projects
router.get("/", getProjects);

// GET /api/projects/:id
router.get("/:id", getProject);

// POST /api/projects
router.post("/", createProject);

// PUT /api/projects/:id
router.put("/:id", updateProject);

// DELETE /api/projects/:id
router.delete("/:id", deleteProject);

// GET /api/projects/:id/stats
router.get("/:id/stats", getProjectStats);

module.exports = router;
