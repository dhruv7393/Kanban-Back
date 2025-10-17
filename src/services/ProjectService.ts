import { Project, ProjectDocument } from "../models/Project.js";
import { Task } from "../models/Task.js";
import {
  CreateProjectDTO,
  UpdateProjectDTO,
  ApiResponse,
} from "../types/index.js";
import { createError } from "../middleware/errorHandler.js";
import mongoose from "mongoose";

export class ProjectService {
  async getAllProjects(): Promise<any[]> {
    try {
      const projects = await Project.find()
        .populate("taskCount")
        .sort({ createdAt: -1 });
      return projects;
    } catch (error) {
      throw createError("Failed to fetch projects", 500);
    }
  }

  async getProjectById(id: string): Promise<any> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw createError("Invalid project ID format", 400);
      }

      const project = await Project.findById(id).populate("taskCount");

      if (!project) {
        throw createError("Project not found", 404);
      }

      return project;
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message.includes("Invalid") ||
          error.message.includes("not found"))
      ) {
        throw error;
      }
      throw createError("Failed to fetch project", 500);
    }
  }

  async createProject(projectData: CreateProjectDTO): Promise<any> {
    try {
      // Check if project with same name already exists
      const existingProject = await Project.findOne({ name: projectData.name });
      if (existingProject) {
        throw createError("Project with this name already exists", 409);
      }

      const project = new Project(projectData);
      await project.save();
      return project;
    } catch (error) {
      if (error instanceof Error && error.message.includes("already exists")) {
        throw error;
      }
      throw createError("Failed to create project", 500);
    }
  }

  async updateProject(id: string, updateData: UpdateProjectDTO): Promise<any> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw createError("Invalid project ID format", 400);
      }

      // Check if name is being updated and already exists
      if (updateData.name) {
        const existingProject = await Project.findOne({
          name: updateData.name,
          _id: { $ne: id },
        });
        if (existingProject) {
          throw createError("Project with this name already exists", 409);
        }
      }

      const project = await Project.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });

      if (!project) {
        throw createError("Project not found", 404);
      }

      return project;
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message.includes("Invalid") ||
          error.message.includes("not found") ||
          error.message.includes("already exists"))
      ) {
        throw error;
      }
      throw createError("Failed to update project", 500);
    }
  }

  async deleteProject(id: string): Promise<void> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw createError("Invalid project ID format", 400);
      }

      // Check if project has tasks
      const taskCount = await Task.countDocuments({ project_id: id });
      if (taskCount > 0) {
        throw createError(
          "Cannot delete project with existing tasks. Please delete all tasks first.",
          400
        );
      }

      const project = await Project.findByIdAndDelete(id);

      if (!project) {
        throw createError("Project not found", 404);
      }
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message.includes("Invalid") ||
          error.message.includes("not found") ||
          error.message.includes("Cannot delete"))
      ) {
        throw error;
      }
      throw createError("Failed to delete project", 500);
    }
  }

  async getProjectStats(id: string): Promise<any> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw createError("Invalid project ID format", 400);
      }

      const project = await Project.findById(id);
      if (!project) {
        throw createError("Project not found", 404);
      }

      const stats = await Task.aggregate([
        { $match: { project_id: new mongoose.Types.ObjectId(id) } },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);

      const priorityStats = await Task.aggregate([
        { $match: { project_id: new mongoose.Types.ObjectId(id) } },
        {
          $group: {
            _id: "$priority",
            count: { $sum: 1 },
          },
        },
      ]);

      return {
        project,
        statusStats: stats,
        priorityStats,
        totalTasks: await Task.countDocuments({ project_id: id }),
      };
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message.includes("Invalid") ||
          error.message.includes("not found"))
      ) {
        throw error;
      }
      throw createError("Failed to fetch project stats", 500);
    }
  }
}
