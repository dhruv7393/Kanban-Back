import mongoose, { Schema, Document } from "mongoose";

interface ITask {
  title: string;
  description: string;
  status: "backlog" | "blocked" | "todo" | "done";
  priority: "low" | "medium" | "high";
  dueDate: Date;
  blockedReason?: string | null;
  project_id: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      maxlength: [200, "Task title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Task description is required"],
      trim: true,
      maxlength: [1000, "Task description cannot exceed 1000 characters"],
    },
    status: {
      type: String,
      required: [true, "Task status is required"],
      enum: {
        values: ["backlog", "blocked", "todo", "done"],
        message: "Status must be one of: backlog, blocked, todo, done",
      },
      default: "backlog",
    },
    priority: {
      type: String,
      required: [true, "Task priority is required"],
      enum: {
        values: ["low", "medium", "high"],
        message: "Priority must be one of: low, medium, high",
      },
      default: "medium",
    },
    dueDate: {
      type: Date,
      default: Date.now,
    },
    blockedReason: {
      type: String,
      trim: true,
      maxlength: [500, "Blocked reason cannot exceed 500 characters"],
    },
    project_id: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project ID is required"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes
taskSchema.index({ project_id: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ createdAt: -1 });
taskSchema.index({ title: "text", description: "text" });

// Compound indexes
taskSchema.index({ project_id: 1, status: 1 });
taskSchema.index({ project_id: 1, priority: 1 });

// Pre-save middleware
taskSchema.pre("save", function (next) {
  if (this.status === "blocked" && !this.blockedReason) {
    next(new Error("Blocked reason is required when status is blocked"));
  } else if (this.status !== "blocked") {
    this.blockedReason = undefined;
  }
  next();
});

export interface TaskDocument extends ITask, Document {}

export const Task = mongoose.model("Task", taskSchema);
