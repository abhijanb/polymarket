import type { Request, Response } from "express";
import { getPortfolioSummary } from "../service/portfolio.service";
import { logger } from "../../../lib/logger";

export async function getPortfolioController(req: Request, res: Response) {
  const userId = req.user!.userId;
  logger.info("user.portfolio.fetch", { userId });
  try {
    const summary = await getPortfolioSummary(userId);
    logger.info("user.portfolio.success", {
      userId,
      totalValue: summary.totalValue,
      availableCash: summary.availableCash,
    });
    res.json(summary);
  } catch (error) {
    logger.error("user.portfolio.error", { userId }, error);
    res.status(500).json({ success: false, message: "Error fetching portfolio summary" });
  }
}
