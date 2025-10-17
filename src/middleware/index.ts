import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { createError } from "./errorHandler.js";

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessage = errors.array()[0]?.msg || "Validation error";
    throw createError(errorMessage, 400);
  }
  next();
};
