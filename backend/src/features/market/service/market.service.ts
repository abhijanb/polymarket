import { prisma } from "../../../lib/prisma";

export async function createMarket(data: Parameters<typeof prisma.market.create>[0]["data"]) {
  return prisma.market.create({ data });
}

export async function getMarkets() {
  return prisma.market.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      resolutionDate: true,
      oracleUrl: true,
      status: true,
      resolvedAt: true,
      resolvedOutcomeId: true,
      creatorId: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function getActiveMarketsWithOutcomes() {
  return prisma.market.findMany({
    where: { status: "ACTIVE" },
    include: { outcomes: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getMarketById(id: string) {
  return prisma.market.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      resolutionDate: true,
      oracleUrl: true,
      status: true,
      resolvedAt: true,
      resolvedOutcomeId: true,
      creatorId: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function updateMarket(id: string, data: Parameters<typeof prisma.market.update>[0]["data"]) {
  return prisma.market.update({ where: { id }, data });
}

export async function deleteMarket(id: string) {
  return prisma.market.delete({ where: { id } });
}
