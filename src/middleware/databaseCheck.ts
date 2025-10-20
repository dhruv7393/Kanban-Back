import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { createError } from "./errorHandler";

export const checkDatabaseConnection = (req: Request, res: Response, next: NextFunction): void => {
  const connectionState = mongoose.connection.readyState;
  
  // Only check for database-dependent routes
  const isDatabaseRoute = req.path.startsWith('/api/');
  
  if (!isDatabaseRoute) {
    next();
    return;
  }

  if (connectionState === 0) {
    // Disconnected
    console.error("❌ Database disconnected when handling request:", req.path);
    next(createError("Database connection not available", 503));
    return;
  }
  
  if (connectionState === 3) {
    // Disconnecting
    console.error("❌ Database disconnecting when handling request:", req.path);
    next(createError("Database connection not available", 503));
    return;
  }
  
  if (connectionState === 2) {
    // Connecting - wait a moment
    console.log("⏳ Database connecting when handling request:", req.path);
    setTimeout(() => {
      if (mongoose.connection.readyState === 1) {
        next();
      } else {
        next(createError("Database connection timeout", 503));
      }
    }, 2000);
    return;
  }
  
  // Connected (state 1) - proceed
  next();
};