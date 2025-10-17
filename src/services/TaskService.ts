import { Task, TaskDocument } from "../models/Task.js";
import { Project } from "../models/Project.js";
import { CreateTaskDTO, UpdateTaskDTO, TaskQuery } from "../types/index.js";
import { createError } from "../middleware/errorHandler.js";
import mongoose from "mongoose";

export class TaskService {
  async getAllTasks(query: TaskQuery): Promise<any[]> {
    try {
      const {
        sortBy = "createdAt",
        sortOrder = "desc",
        status,
        priority,
        project_id,
        search,
      } = query;

      // Build filter object
      const filter: any = {};

      if (status) filter.status = status;
      if (priority) filter.priority = priority;
      if (project_id) {
        if (!mongoose.Types.ObjectId.isValid(project_id)) {
          throw createError("Invalid project ID format", 400);
        }
        filter.project_id = project_id;
      }

      if (search) {
        filter.$text = { $search: search };
      }

      const sortOptions: any = {};
      sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

      // Execute query - get all tasks without pagination
      const tasks = await Task.find(filter)
        .populate("project_id", "name color")
        .sort(sortOptions);

      return tasks;
    } catch (error) {
      if (error instanceof Error && error.message.includes("Invalid")) {
        throw error;
      }
      throw createError("Failed to fetch tasks", 500);
    }
  }

  async getTaskById(id: string): Promise<any> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw createError("Invalid task ID format", 400);
      }

      const task = await Task.findById(id).populate("project_id", "name color");

      if (!task) {
        throw createError("Task not found", 404);
      }

      return task;
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message.includes("Invalid") ||
          error.message.includes("not found"))
      ) {
        throw error;
      }
      throw createError("Failed to fetch task", 500);
    }
  }

  async createTask(taskData: CreateTaskDTO): Promise<any> {
    try {
      // Verify project exists
      if (!mongoose.Types.ObjectId.isValid(taskData.project_id)) {
        throw createError("Invalid project ID format", 400);
      }

      const project = await Project.findById(taskData.project_id);
      if (!project) {
        throw createError("Project not found", 404);
      }

      // Validate blocked reason requirement
      if (taskData.status === "blocked" && !taskData.blockedReason) {
        throw createError(
          "Blocked reason is required when status is blocked",
          400
        );
      }

      const task = new Task({
        ...taskData,
        dueDate: taskData.dueDate ? new Date(taskData.dueDate) : new Date(),
      });

      await task.save();
      await task.populate("project_id", "name color");

      return task;
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message.includes("Invalid") ||
          error.message.includes("not found") ||
          error.message.includes("required"))
      ) {
        throw error;
      }
      throw createError("Failed to create task", 500);
    }
  }

  async updateTask(id: string, updateData: UpdateTaskDTO): Promise<any> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw createError("Invalid task ID format", 400);
      }

      // Verify project exists if project_id is being updated
      if (updateData.project_id) {
        if (!mongoose.Types.ObjectId.isValid(updateData.project_id)) {
          throw createError("Invalid project ID format", 400);
        }

        const project = await Project.findById(updateData.project_id);
        if (!project) {
          throw createError("Project not found", 404);
        }
      }

      // Get current task to validate blocked reason logic
      const currentTask = await Task.findById(id);
      if (!currentTask) {
        throw createError("Task not found", 404);
      }

      // Validate blocked reason requirement
      const newStatus = updateData.status || currentTask.status;
      const newBlockedReason =
        updateData.blockedReason !== undefined
          ? updateData.blockedReason
          : currentTask.blockedReason;

      if (
        newStatus === "blocked" &&
        (!newBlockedReason || newBlockedReason.trim() === "")
      ) {
        throw createError(
          "Blocked reason is required when status is blocked",
          400
        );
      }

      // Convert date if provided
      const updatePayload: any = { ...updateData };
      if (updateData.dueDate) {
        updatePayload.dueDate = new Date(updateData.dueDate);
      }

      // Clear blockedReason when status changes from blocked to non-blocked
      if (currentTask.status === "blocked" && newStatus !== "blocked") {
        updatePayload.blockedReason = null;
      }

      const task = await Task.findByIdAndUpdate(id, updatePayload, {
        new: true,
        runValidators: true,
      }).populate("project_id", "name color");

      if (!task) {
        throw createError("Task not found", 404);
      }

      return task;
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message.includes("Invalid") ||
          error.message.includes("not found") ||
          error.message.includes("required"))
      ) {
        throw error;
      }
      throw createError("Failed to update task", 500);
    }
  }

  async deleteTask(id: string): Promise<void> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw createError("Invalid task ID format", 400);
      }

      const task = await Task.findByIdAndDelete(id);

      if (!task) {
        throw createError("Task not found", 404);
      }
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message.includes("Invalid") ||
          error.message.includes("not found"))
      ) {
        throw error;
      }
      throw createError("Failed to delete task", 500);
    }
  }

  async getTasksByProject(projectId: string): Promise<any[]> {
    try {
      if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw createError("Invalid project ID format", 400);
      }

      const project = await Project.findById(projectId);
      if (!project) {
        throw createError("Project not found", 404);
      }

      const tasks = await Task.find({ project_id: projectId })
        .populate("project_id", "name color")
        .sort({ createdAt: -1 });

      return tasks;
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message.includes("Invalid") ||
          error.message.includes("not found"))
      ) {
        throw error;
      }
      throw createError("Failed to fetch project tasks", 500);
    }
  }

  async updateTaskStatus(
    id: string,
    status: "backlog" | "blocked" | "todo" | "done",
    blockedReason?: string
  ): Promise<any> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw createError("Invalid task ID format", 400);
      }

      if (
        status === "blocked" &&
        (!blockedReason || blockedReason.trim() === "")
      ) {
        throw createError(
          "Blocked reason is required when status is blocked",
          400
        );
      }

      const updateData: any = { status };
      if (status === "blocked") {
        updateData.blockedReason = blockedReason;
      } else {
        updateData.blockedReason = undefined;
      }

      const task = await Task.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      }).populate("project_id", "name color");

      if (!task) {
        throw createError("Task not found", 404);
      }

      return task;
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message.includes("Invalid") ||
          error.message.includes("not found") ||
          error.message.includes("required"))
      ) {
        throw error;
      }
      throw createError("Failed to update task status", 500);
    }
  }
}
