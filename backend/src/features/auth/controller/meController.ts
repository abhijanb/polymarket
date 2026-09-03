import type { Request, Response } from "express";
import { verifyAccessToken } from "../../../utils/jwt";
import { prisma } from "../../../lib/prisma";
import { logger } from "../../../lib/logger";
import { setRequestUser } from "../../../middlewares/requestId";

export async function meController(req: Request, res: Response) {
  logger.debug("auth.me.start");
  try {
    const token =
      (req.cookies as any)?.token || req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      logger.warn("auth.me.missing_token");
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    const payload = verifyAccessToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, name: true, role: true },
    });
    if (!user) {
      logger.warn("auth.me.user_not_found", { userId: payload.userId });
      return res.status(401).json({ success: false, message: "User not found" });
    }
    setRequestUser(user.id);
    logger.info("auth.me.success", { userId: user.id });
    res.json({ success: true, user });
  } catch (err) {
    logger.warn("auth.me.invalid_token", {}, err);
    res.status(401).json({ success: false, message: "Invalid token" });
  }
}
