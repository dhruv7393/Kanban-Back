import { body, param, query, ValidationChain } from "express-validator";

// Task validation rules
export const validateCreateTask: ValidationChain[] = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 1, max: 200 })
    .withMessage("Title must be between 1 and 200 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 1, max: 1000 })
    .withMessage("Description must be between 1 and 1000 characters"),

  body("status")
    .isIn(["backlog", "blocked", "todo", "done"])
    .withMessage("Status must be one of: backlog, blocked, todo, done"),

  body("priority")
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be one of: low, medium, high"),

  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Due date must be a valid ISO 8601 date"),

  body("blockedReason")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Blocked reason cannot exceed 500 characters"),

  body("project_id")
    .isMongoId()
    .withMessage("Project ID must be a valid MongoDB ObjectId"),
];

export const validateUpdateTask: ValidationChain[] = [
  param("id")
    .isMongoId()
    .withMessage("Task ID must be a valid MongoDB ObjectId"),

  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ min: 1, max: 200 })
    .withMessage("Title must be between 1 and 200 characters"),

  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty")
    .isLength({ min: 1, max: 1000 })
    .withMessage("Description must be between 1 and 1000 characters"),

  body("status")
    .optional()
    .isIn(["backlog", "blocked", "todo", "done"])
    .withMessage("Status must be one of: backlog, blocked, todo, done"),

  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be one of: low, medium, high"),

  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Due date must be a valid ISO 8601 date"),

  body("blockedReason")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Blocked reason cannot exceed 500 characters"),

  body("project_id")
    .optional()
    .isMongoId()
    .withMessage("Project ID must be a valid MongoDB ObjectId"),
];

// Project validation rules
export const validateCreateProject: ValidationChain[] = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Project name is required")
    .isLength({ min: 1, max: 100 })
    .withMessage("Project name must be between 1 and 100 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Project description is required")
    .isLength({ min: 1, max: 500 })
    .withMessage("Project description must be between 1 and 500 characters"),

  body("color")
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage("Color must be a valid hex color code"),
];

export const validateUpdateProject: ValidationChain[] = [
  param("id")
    .isMongoId()
    .withMessage("Project ID must be a valid MongoDB ObjectId"),

  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Project name cannot be empty")
    .isLength({ min: 1, max: 100 })
    .withMessage("Project name must be between 1 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Project description cannot be empty")
    .isLength({ min: 1, max: 500 })
    .withMessage("Project description must be between 1 and 500 characters"),

  body("color")
    .optional()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage("Color must be a valid hex color code"),
];

// Common validation rules
export const validateId: ValidationChain[] = [
  param("id").isMongoId().withMessage("ID must be a valid MongoDB ObjectId"),
];

export const validateTaskQuery: ValidationChain[] = [
  query("sortBy").optional().isString().withMessage("Sort by must be a string"),

  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Sort order must be asc or desc"),

  query("status")
    .optional()
    .isIn(["backlog", "blocked", "todo", "done"])
    .withMessage("Status must be one of: backlog, blocked, todo, done"),

  query("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be one of: low, medium, high"),

  query("project_id")
    .optional()
    .isMongoId()
    .withMessage("Project ID must be a valid MongoDB ObjectId"),

  query("search")
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Search term must not be empty"),
];
