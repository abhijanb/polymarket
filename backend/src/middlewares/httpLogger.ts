import type { Request, Response, NextFunction } from "express";
import { logger } from "../lib/logger";

export function httpLogger(req: Request, res: Response, next: NextFunction) {
  const start = process.hrtime.bigint();
  logger.info("http.request", {
    method: req.method,
    url: req.originalUrl || req.url,
    ip: req.ip,
  });
  res.on("finish", () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1e6;
    logger.info("http.response", {
      method: req.method,
      url: req.originalUrl || req.url,
      status: res.statusCode,
      durationMs: Math.round(durationMs * 100) / 100,
    });
  });
  next();
}
