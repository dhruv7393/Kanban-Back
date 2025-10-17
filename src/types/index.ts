import { Schema } from "mongoose";

export interface ITask {
  _id: Schema.Types.ObjectId;
  title: string;
  description: string;
  status: "backlog" | "blocked" | "todo" | "done";
  priority: "low" | "medium" | "high";
  dueDate: Date;
  blockedReason?: string;
  project_id: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProject {
  _id: Schema.Types.ObjectId;
  name: string;
  description: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskDTO {
  title: string;
  description: string;
  status: "backlog" | "blocked" | "todo" | "done";
  priority: "low" | "medium" | "high";
  dueDate?: string;
  blockedReason?: string;
  project_id: string;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: "backlog" | "blocked" | "todo" | "done";
  priority?: "low" | "medium" | "high";
  dueDate?: string;
  blockedReason?: string;
  project_id?: string;
}

export interface CreateProjectDTO {
  name: string;
  description: string;
  color: string;
}

export interface UpdateProjectDTO {
  name?: string;
  description?: string;
  color?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface TaskQuery {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: "backlog" | "blocked" | "todo" | "done";
  priority?: "low" | "medium" | "high";
  project_id?: string;
  search?: string;
}
