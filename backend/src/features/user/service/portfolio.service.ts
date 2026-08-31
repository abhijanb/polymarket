import { prisma } from "../../../lib/prisma";

export async function getPortfolioSummary(userId: string) {
  const [positionCount, user] = await Promise.all([
    prisma.position.count({ where: { userId } }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { balance: true },
    }),
  ]);

  const balance = Number(user?.balance ?? 0);

  return {
    totalValue: balance,
    dayChange: 0,
    dayChangePct: 0,
    activePositions: positionCount,
    availableCash: balance,
  };
}
