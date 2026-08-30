import type { Request, Response } from "express";
import { validate } from "../../../utils/validate";
import { updateMarketSchema } from "../validation/market.schema";
import { updateMarket, getMarketById } from "../service/market.service";

export async function updateMarketData(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const result = validate(updateMarketSchema, req.body);
  if (!result.success) {
    return res.status(400).json({ success: false, message: "Invalid market data", errors: result.errors });
  }

  try {
    const existing = await getMarketById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Market not found" });
    }

    const market = await updateMarket(id, {
      ...(result.data.title !== undefined && { title: result.data.title }),
      ...(result.data.description !== undefined && { description: result.data.description }),
      ...(result.data.category !== undefined && { category: result.data.category }),
      ...(result.data.resolutionDate !== undefined && { resolutionDate: new Date(result.data.resolutionDate) }),
      ...(result.data.oracleUrl !== undefined && { oracleUrl: result.data.oracleUrl }),
      ...(result.data.status !== undefined && { status: result.data.status }),
      ...(result.data.resolvedOutcomeId !== undefined && { resolvedOutcomeId: result.data.resolvedOutcomeId }),
    });

    res.json(market);
  } catch (error) {
    console.error("[updateMarketData]", error);
    res.status(500).json({ success: false, message: "Error updating market data" });
  }
}
