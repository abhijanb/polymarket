import type { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";
import { logger } from "../../../lib/logger";

export async function getMarketsController(_req: Request, res: Response) {
  logger.info("market.list.start");
  try {
    const products = await prisma.product.findMany({
      where: { status: "ACTIVE" },
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        outcome: true,
        outcomeTime: true,
      },
      orderBy: { id: "desc" },
    });

    const markets = products.map((p) => {
      const categoryMatch = p.description.match(/^\[([^\]]+)\]/);
      const category = categoryMatch ? categoryMatch[1] : "Uncategorized";
      return {
        id: p.id,
        title: p.name,
        description: p.description,
        category,
        status: p.status,
        outcome: p.outcome,
        outcomeTime: p.outcomeTime,
      };
    });

    logger.info("market.list.success", { count: markets.length });
    res.json(markets);
  } catch (error) {
    logger.error("market.list.error", {}, error);
    res.status(500).json({ success: false, message: "Error fetching markets" });
  }
}
