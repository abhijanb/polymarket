import type { Request, Response } from "express";
import { logger } from "../../../lib/logger";

export function logoutController(req: Request, res: Response) {
  logger.info("auth.logout", { userId: req.user?.userId });
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.json({ success: true, message: "Logged out" });
}
