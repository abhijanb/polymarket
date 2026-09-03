import type { Request, Response, NextFunction } from "express";
import { logger } from "../lib/logger";

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== "ADMIN") {
    logger.warn("admin.forbidden", {
      userId: req.user?.userId,
      role: req.user?.role,
      path: req.originalUrl || req.url,
    });
    return res.status(403).json({ success: false, message: "Admin access required" });
  }
  logger.debug("admin.allowed", { userId: req.user.userId });
  next();
}
