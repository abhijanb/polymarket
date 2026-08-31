import type { Request, Response } from "express";
import { getPortfolioSummary } from "../service/portfolio.service";

export async function getPortfolioController(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;
    const summary = await getPortfolioSummary(userId);
    res.json(summary);
  } catch (error) {
    console.error("[getPortfolioController]", error);
    res.status(500).json({ success: false, message: "Error fetching portfolio summary" });
  }
}
