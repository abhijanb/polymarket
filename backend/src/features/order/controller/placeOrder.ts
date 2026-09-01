import type { Request, Response } from "express";
import { placeOrder, OrderError } from "../service/order.service";

export async function placeOrderController(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;
    const { marketId, side, amountUsd } = req.body;
    const result = await placeOrder({ userId, marketId, side, amountUsd });
    res.status(201).json({ success: true, ...result });
  } catch (error) {
    if (error instanceof OrderError) {
      return res.status(error.status).json({ success: false, message: error.message });
    }
    console.error("[placeOrderController]", error);
    res.status(500).json({ success: false, message: "Error placing order" });
  }
}
