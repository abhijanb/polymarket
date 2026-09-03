import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import type { JwtPayload } from "../utils/jwt";
import { logger } from "../lib/logger";
import { setRequestUser } from "./requestId";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const path = req.originalUrl || req.url;
  const token =
    (req.cookies as any)?.token || req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    logger.warn("auth.missing_token", { path });
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }
  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    setRequestUser(payload.userId);
    logger.debug("auth.token_verified", { path, role: payload.role });
    next();
  } catch (err) {
    logger.warn("auth.invalid_token", { path }, err);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
}
