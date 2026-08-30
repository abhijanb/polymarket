import type { Request, Response } from "express";
import { validate } from "../../../utils/validate";
import { createMarketSchema } from "../validation/market.schema";
import { createMarket } from "../service/market.service";

export async function storeMarketData(req: Request, res: Response) {
  const result = validate(createMarketSchema, req.body);
  if (!result.success) {
    return res.status(400).json({ success: false, message: "Invalid market data", errors: result.errors });
  }

  try {
    const creatorId = req.user!.userId;

    const market = await createMarket({
      title: result.data.title,
      description: result.data.description,
      category: result.data.category,
      resolutionDate: new Date(result.data.resolutionDate),
      oracleUrl: result.data.oracleUrl,
      creatorId,
    });
    res.status(201).json(market);
  } catch (error) {
    console.error("[storeMarketData]", error);
    res.status(500).json({ success: false, message: "Error storing market data" });
  }
}
