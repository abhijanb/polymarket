import type { Request, Response } from "express";
import { getMarkets } from "../service/market.service";

export async function getMarketData(req: Request, res: Response) {
  try {
    const markets = await getMarkets();
    res.json(markets);
  } catch (error) {
    console.error("[getMarketData]", error);
    res.status(500).json({ success: false, message: "Error fetching market data" });
  }
}
