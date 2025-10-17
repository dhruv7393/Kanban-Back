import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../types/index.js";

export interface AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
}

export class CustomError extends Error implements AppError {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const createError = (
  message: string,
  statusCode: number
): CustomError => {
  return new CustomError(message, statusCode);
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = "Invalid ID format";
    error = createError(message, 400);
  }

  // Mongoose duplicate key
  if (err.name === "MongoServerError" && (err as any).code === 11000) {
    const message = "Duplicate field value entered";
    error = createError(message, 400);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values((err as any).errors)
      .map((val: any) => val.message)
      .join(", ");
    error = createError(message, 400);
  }

  const response: ApiResponse<null> = {
    success: false,
    error: error.message || "Server Error",
  };

  res.status(error.statusCode || 500).json(response);
};

export const notFound = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = createError(`Not found - ${req.originalUrl}`, 404);
  next(error);
};
