import type { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Optional wrapper for async handlers.
 * NOT required in Express 5 — Express 5 already handles rejected promises.
 * Keep this only if you want explicitness or Express 4 compatibility.
 */
export const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
