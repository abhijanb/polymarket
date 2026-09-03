import type { Request, Response } from "express";
import { getUserOrders } from "../service/order.service";
import { logger } from "../../../lib/logger";

export async function getOrdersController(req: Request, res: Response) {
  const userId = req.user!.userId;
  logger.info("order.list.start", { userId });
  try {
    const orders = await getUserOrders(userId);
    logger.info("order.list.success", { userId, count: orders.length });
    res.json(orders);
  } catch (error) {
    logger.error("order.list.error", { userId }, error);
    res.status(500).json({ success: false, message: "Error fetching orders" });
  }
}
