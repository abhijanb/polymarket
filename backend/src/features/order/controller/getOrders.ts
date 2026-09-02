import type { Request, Response } from "express";
import { getUserOrders } from "../service/order.service";

export async function getOrdersController(req: Request, res: Response) {
  try {
    const orders = await getUserOrders(req.user!.userId);
    res.json(orders);
  } catch (error) {
    console.error("[getOrdersController]", error);
    res.status(500).json({ success: false, message: "Error fetching orders" });
  }
}
