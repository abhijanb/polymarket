import type { NextFunction, Request, Response } from "express";
import type { ZodSchema, ZodError } from "zod";
import ValidationError from "./validationError.js";
import { logger } from "../lib/logger";

function formatZodErrors(error: ZodError) {
  return error.issues.map((issue) => ({
    field: issue.path.length ? issue.path.join(".") : "root",
    message: issue.message,
  }));
}

const validationMiddleware = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = formatZodErrors(result.error);
      logger.warn("validation.failed", {
        path: req.originalUrl || req.url,
        method: req.method,
        errors,
      });
      return next(new ValidationError(errors));
    }
    req.body = result.data;
    logger.debug("validation.passed", { path: req.originalUrl || req.url });
    next();
  };
};

export default validationMiddleware;
