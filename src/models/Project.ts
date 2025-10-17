import mongoose, { Schema, Document } from "mongoose";

interface IProject {
  name: string;
  description: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
      maxlength: [100, "Project name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Project description is required"],
      trim: true,
      maxlength: [500, "Project description cannot exceed 500 characters"],
    },
    color: {
      type: String,
      required: [true, "Project color is required"],
      match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color format"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes
projectSchema.index({ name: 1 });
projectSchema.index({ createdAt: -1 });

// Virtual for task count
projectSchema.virtual("taskCount", {
  ref: "Task",
  localField: "_id",
  foreignField: "project_id",
  count: true,
});

// Ensure virtual fields are serialized
projectSchema.set("toJSON", { virtuals: true });

export interface ProjectDocument extends IProject, Document {}

export const Project = mongoose.model("Project", projectSchema);
