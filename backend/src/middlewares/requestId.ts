import type { Request, Response, NextFunction } from "express";
import { runWithContext, updateContext } from "../lib/logger";

export function requestId(req: Request, res: Response, next: NextFunction) {
  const incoming = req.header("x-request-id");
  const id = incoming && incoming.length <= 128 ? incoming : crypto.randomUUID();
  res.setHeader("X-Request-Id", id);
  runWithContext({ requestId: id, route: req.originalUrl || req.url }, () => {
    next();
  });
}

export function setRequestUser(userId: string | undefined) {
  if (userId) updateContext({ userId });
}
