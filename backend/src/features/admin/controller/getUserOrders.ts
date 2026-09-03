import type { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";
import { getOrdersForUserAdmin } from "../../order/lib/orders";
import { logger } from "../../../lib/logger";

export async function getUserOrdersController(req: Request, res: Response) {
  const adminId = req.user?.userId;
  const userId = String(req.params.id ?? "");
  if (!userId) {
    return res.status(400).json({ success: false, message: "Missing user id" });
  }
  logger.info("admin.users.orders.fetch", { adminId, userId });
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!user) {
      logger.warn("admin.users.orders.user_not_found", { adminId, userId });
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const orders = await getOrdersForUserAdmin(userId);
    logger.info("admin.users.orders.success", { adminId, userId, count: orders.length });
    res.json(orders);
  } catch (error) {
    logger.error("admin.users.orders.error", { adminId, userId }, error);
    res.status(500).json({ success: false, message: "Error fetching user orders" });
  }
}
