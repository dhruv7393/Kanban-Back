export const TASK_STATUS = {
  BACKLOG: "backlog",
  BLOCKED: "blocked",
  TODO: "todo",
  DONE: "done",
} as const;

export const TASK_PRIORITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 10,
  MAX_LIMIT: 100,
  SORT_BY: "createdAt",
  SORT_ORDER: "desc",
} as const;

export const VALIDATION_RULES = {
  TASK: {
    TITLE_MAX_LENGTH: 200,
    DESCRIPTION_MAX_LENGTH: 1000,
    BLOCKED_REASON_MAX_LENGTH: 500,
  },
  PROJECT: {
    NAME_MAX_LENGTH: 100,
    DESCRIPTION_MAX_LENGTH: 500,
  },
} as const;
