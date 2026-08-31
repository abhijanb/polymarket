import type { Request, Response } from "express";
import { createMarket } from "../service/market.service";

export async function storeMarketData(req: Request, res: Response) {
  try {
    const creatorId = req.user!.userId;
    const { title, description, category, resolutionDate, oracleUrl } = req.body;

    const market = await createMarket({
      title,
      description,
      category,
      resolutionDate: new Date(resolutionDate),
      oracleUrl,
      creatorId,
    });
    res.status(201).json(market);
  } catch (error) {
    console.error("[storeMarketData]", error);
    res.status(500).json({ success: false, message: "Error storing market data" });
  }
}
