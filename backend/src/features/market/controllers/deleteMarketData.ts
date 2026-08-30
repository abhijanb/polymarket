import type { Request, Response } from "express";
import { deleteMarket, getMarketById } from "../service/market.service";

export async function deleteMarketData(req: Request, res: Response) {
  const { id } = req.params as { id: string };

  try {
    const existing = await getMarketById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Market not found" });
    }

    const deleted = await deleteMarket(id);
    res.json(deleted);
  } catch (error) {
    console.error("[deleteMarketData]", error);
    res.status(500).json({ success: false, message: "Error deleting market data" });
  }
}
