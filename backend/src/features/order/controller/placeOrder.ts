import type { Request, Response } from "express";
import { placeOrder, OrderError } from "../service/order.service";

export async function placeOrderController(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;
    const { productId, outcome, shares, pricePerShareCents } = req.body;
    const result = await placeOrder({ userId, productId, outcome, shares, pricePerShareCents });
    res.status(201).json({ success: true, ...result });
  } catch (error) {
    if (error instanceof OrderError) {
      return res.status(error.status).json({ success: false, message: error.message });
    }
    console.error("[placeOrderController]", error);
    res.status(500).json({ success: false, message: "Error placing order" });
  }
}
