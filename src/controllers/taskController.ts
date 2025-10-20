const { TaskService } = require("../services/TaskService");

const taskService = new TaskService();

// @desc    Get all tasks with filtering
// @route   GET /api/tasks
// @access  Public
const getTasks = async (req, res) => {
  try {
    const tasks = await taskService.getAllTasks(req.query);
    res.status(200).json({
      success: true,
      data: tasks,
      message: "Tasks retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve tasks",
    });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Public
const getTask = async (req, res) => {
  try {
    const task = await taskService.getTaskById(req.params.id);
    res.status(200).json({
      success: true,
      data: task,
      message: "Task retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve task",
    });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Public
const createTask = async (req, res) => {
  try {
    const task = await taskService.createTask(req.body);
    res.status(201).json({
      success: true,
      data: task,
      message: "Task created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create task",
    });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Public
const updateTask = async (req, res) => {
  try {
    const task = await taskService.updateTask(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: task,
      message: "Task updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update task",
    });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Public
const deleteTask = async (req, res) => {
  try {
    await taskService.deleteTask(req.params.id);
    res.status(200).json({
      success: true,
      data: null,
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete task",
    });
  }
};

// @desc    Update task status
// @route   PATCH /api/tasks/:id/status
// @access  Public
const updateTaskStatus = async (req, res) => {
  try {
    const task = await taskService.updateTaskStatus(
      req.params.id,
      req.body.status
    );
    res.status(200).json({
      success: true,
      data: task,
      message: "Task status updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update task status",
    });
  }
};

// @desc    Get tasks by project
// @route   GET /api/projects/:projectId/tasks
// @access  Public
const getTasksByProject = async (req, res) => {
  try {
    const tasks = await taskService.getTasksByProject(req.params.projectId);
    res.status(200).json({
      success: true,
      data: tasks,
      message: "Project tasks retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve project tasks",
    });
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  getTasksByProject,
};

const taskService = new TaskService();

// @desc    Get all tasks with filtering
// @route   GET /api/tasks
// @access  Public
export const getTasks = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError(errors.array()[0]?.msg || "Validation error", 400);
    }

    const query: TaskQuery = {
      sortBy: (req.query.sortBy as string) || "createdAt",
      sortOrder: (req.query.sortOrder as "asc" | "desc") || "desc",
      status: req.query.status as "backlog" | "blocked" | "todo" | "done",
      priority: req.query.priority as "low" | "medium" | "high",
      project_id: req.query.project_id as string,
      search: req.query.search as string,
    };

    const tasks = await taskService.getAllTasks(query);

    const response: ApiResponse<typeof tasks> = {
      success: true,
      data: tasks,
      message: "Tasks retrieved successfully",
    };

    res.status(200).json(response);
  }
);

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Public
export const getTask = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError(errors.array()[0]?.msg || "Validation error", 400);
    }

    const task = await taskService.getTaskById(req.params.id!);

    const response: ApiResponse<typeof task> = {
      success: true,
      data: task,
      message: "Task retrieved successfully",
    };

    res.status(200).json(response);
  }
);

// @desc    Create new task
// @route   POST /api/tasks
// @access  Public
export const createTask = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError(errors.array()[0]?.msg || "Validation error", 400);
    }

    const taskData: CreateTaskDTO = req.body;
    const task = await taskService.createTask(taskData);

    const response: ApiResponse<typeof task> = {
      success: true,
      data: task,
      message: "Task created successfully",
    };

    res.status(201).json(response);
  }
);

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Public
export const updateTask = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError(errors.array()[0]?.msg || "Validation error", 400);
    }

    const updateData: UpdateTaskDTO = req.body;
    const task = await taskService.updateTask(req.params.id!, updateData);

    const response: ApiResponse<typeof task> = {
      success: true,
      data: task,
      message: "Task updated successfully",
    };

    res.status(200).json(response);
  }
);

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Public
export const deleteTask = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError(errors.array()[0]?.msg || "Validation error", 400);
    }

    await taskService.deleteTask(req.params.id!);

    const response: ApiResponse<null> = {
      success: true,
      message: "Task deleted successfully",
    };

    res.status(200).json(response);
  }
);

// @desc    Get tasks by project
// @route   GET /api/projects/:projectId/tasks
// @access  Public
export const getTasksByProject = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError(errors.array()[0]?.msg || "Validation error", 400);
    }

    const tasks = await taskService.getTasksByProject(req.params.projectId!);

    const response: ApiResponse<typeof tasks> = {
      success: true,
      data: tasks,
      message: "Project tasks retrieved successfully",
    };

    res.status(200).json(response);
  }
);

// @desc    Update task status
// @route   PATCH /api/tasks/:id/status
// @access  Public
export const updateTaskStatus = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError(errors.array()[0]?.msg || "Validation error", 400);
    }

    const { status, blockedReason } = req.body;
    const task = await taskService.updateTaskStatus(
      req.params.id!,
      status,
      blockedReason
    );

    const response: ApiResponse<typeof task> = {
      success: true,
      data: task,
      message: "Task status updated successfully",
    };

    res.status(200).json(response);
  }
);
