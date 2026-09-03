import type { Request, Response } from "express";
import { placeOrder, OrderError } from "../service/order.service";
import { logger } from "../../../lib/logger";

export async function placeOrderController(req: Request, res: Response) {
  const userId = req.user!.userId;
  const { productId, outcome, shares, pricePerShareCents } = req.body;
  logger.info("order.place.start", {
    userId,
    productId,
    outcome,
    shares,
    pricePerShareCents,
  });
  try {
    const result = await placeOrder({ userId, productId, outcome, shares, pricePerShareCents });
    logger.info("order.place.success", {
      userId,
      orderId: result.order.id,
      totalCost: result.order.totalCostUsd,
      newBalance: result.balance,
    });
    res.status(201).json({ success: true, ...result });
  } catch (error) {
    if (error instanceof OrderError) {
      logger.warn("order.place.business_error", {
        userId,
        productId,
        status: error.status,
        message: error.message,
      });
      return res.status(error.status).json({ success: false, message: error.message });
    }
    logger.error("order.place.error", { userId, productId }, error);
    res.status(500).json({ success: false, message: "Error placing order" });
  }
}
