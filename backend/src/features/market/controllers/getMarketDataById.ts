import type { Request, Response } from "express";
import { getMarketById } from "../service/market.service";

export async function getMarketDataById(req: Request, res: Response) {
  const { id } = req.params as { id: string };

  try {
    const market = await getMarketById(id);
    if (!market) {
      return res.status(404).json({ success: false, message: "Market data not found" });
    }
    res.json(market);
  } catch (error) {
    console.error("[getMarketDataById]", error);
    res.status(500).json({ success: false, message: "Error fetching market data by ID" });
  }
}
