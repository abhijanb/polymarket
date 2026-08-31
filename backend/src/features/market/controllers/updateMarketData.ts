import type { Request, Response } from "express";
import { updateMarket, getMarketById } from "../service/market.service";

export async function updateMarketData(req: Request, res: Response) {
  const { id } = req.params as { id: string };

  try {
    const existing = await getMarketById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Market not found" });
    }

    const { title, description, category, resolutionDate, oracleUrl, status, resolvedOutcomeId } = req.body;

    const market = await updateMarket(id, {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(category !== undefined && { category }),
      ...(resolutionDate !== undefined && { resolutionDate: new Date(resolutionDate) }),
      ...(oracleUrl !== undefined && { oracleUrl }),
      ...(status !== undefined && { status }),
      ...(resolvedOutcomeId !== undefined && { resolvedOutcomeId }),
    });

    res.json(market);
  } catch (error) {
    console.error("[updateMarketData]", error);
    res.status(500).json({ success: false, message: "Error updating market data" });
  }
}
