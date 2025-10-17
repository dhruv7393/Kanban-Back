import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { ProjectService } from "../services/ProjectService.js";
import { asyncHandler, createError } from "../middleware/errorHandler.js";
import {
  ApiResponse,
  CreateProjectDTO,
  UpdateProjectDTO,
} from "../types/index.js";

const projectService = new ProjectService();

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
export const getProjects = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const projects = await projectService.getAllProjects();

    const response: ApiResponse<typeof projects> = {
      success: true,
      data: projects,
      message: "Projects retrieved successfully",
    };

    res.status(200).json(response);
  }
);

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
export const getProject = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError(errors.array()[0]?.msg || "Validation error", 400);
    }

    const project = await projectService.getProjectById(req.params.id!);

    const response: ApiResponse<typeof project> = {
      success: true,
      data: project,
      message: "Project retrieved successfully",
    };

    res.status(200).json(response);
  }
);

// @desc    Create new project
// @route   POST /api/projects
// @access  Public
export const createProject = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError(errors.array()[0]?.msg || "Validation error", 400);
    }

    const projectData: CreateProjectDTO = req.body;
    const project = await projectService.createProject(projectData);

    const response: ApiResponse<typeof project> = {
      success: true,
      data: project,
      message: "Project created successfully",
    };

    res.status(201).json(response);
  }
);

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Public
export const updateProject = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError(errors.array()[0]?.msg || "Validation error", 400);
    }

    const updateData: UpdateProjectDTO = req.body;
    const project = await projectService.updateProject(
      req.params.id!,
      updateData
    );

    const response: ApiResponse<typeof project> = {
      success: true,
      data: project,
      message: "Project updated successfully",
    };

    res.status(200).json(response);
  }
);

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Public
export const deleteProject = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError(errors.array()[0]?.msg || "Validation error", 400);
    }

    await projectService.deleteProject(req.params.id!);

    const response: ApiResponse<null> = {
      success: true,
      message: "Project deleted successfully",
    };

    res.status(200).json(response);
  }
);

// @desc    Get project statistics
// @route   GET /api/projects/:id/stats
// @access  Public
export const getProjectStats = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError(errors.array()[0]?.msg || "Validation error", 400);
    }

    const stats = await projectService.getProjectStats(req.params.id!);

    const response: ApiResponse<typeof stats> = {
      success: true,
      data: stats,
      message: "Project statistics retrieved successfully",
    };

    res.status(200).json(response);
  }
);
