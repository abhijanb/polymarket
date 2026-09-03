import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { logger } from "../lib/logger";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  if (status >= 500) {
    logger.error("http.error", { status, message }, err);
  } else {
    logger.warn("http.client_error", { status, message }, err);
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
    });
  }

  if (err.status === 400 && Array.isArray(err.errors)) {
    return res.status(400).json({
      success: false,
      message: err.message || "Validation failed",
      errors: err.errors.map((e: any) => ({
        path: e.field ?? e.path ?? "root",
        message: e.message,
      })),
    });
  }

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
}
