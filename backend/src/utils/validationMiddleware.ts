import type { NextFunction, Request, Response } from "express";
import type { ZodSchema, ZodError } from "zod";
import ValidationError from "./validationError.js";

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
      throw new ValidationError(formatZodErrors(result.error));
    }
    req.body = result.data;
    next();
  };
};

export default validationMiddleware;
