const { Router } = require("express");
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getProjectStats,
} = require("../controllers/projectController");
const {
  validateCreateProject,
  validateUpdateProject,
  validateId,
} = require("../middleware/validation");

const router = Router();

// GET /api/projects
router.get("/", getProjects);

// GET /api/projects/:id
router.get("/:id", validateId, getProject);

// POST /api/projects
router.post("/", validateCreateProject, createProject);

// PUT /api/projects/:id
router.put("/:id", validateUpdateProject, updateProject);

// DELETE /api/projects/:id
router.delete("/:id", validateId, deleteProject);

// GET /api/projects/:id/stats
router.get("/:id/stats", validateId, getProjectStats);

module.exports = router;
