import type { Request, Response } from "express";
import { getDashboardMarkets } from "../service/dashboard.service";

export async function getDashboardMarketsController(req: Request, res: Response) {
  try {
    const markets = await getDashboardMarkets();
    res.json(markets);
  } catch (error) {
    console.error("[getDashboardMarketsController]", error);
    res.status(500).json({ success: false, message: "Error fetching dashboard markets" });
  }
}
