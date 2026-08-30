import type { Request, Response } from "express";
import { verifyAccessToken } from "../../../utils/jwt";
import { prisma } from "../../../lib/prisma";

export async function meController(req: Request, res: Response) {
  try {
    const token = (req.cookies as any)?.token || req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ success: false, message: "Not authenticated" });
    const payload = verifyAccessToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, name: true, role: true },
    });
    if (!user) return res.status(401).json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
}
