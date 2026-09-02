import { prisma } from "../../../lib/prisma";

export async function getPortfolioSummary(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { balance: true },
  });

  const balance = Number(user?.balance ?? 0);

  return {
    totalValue: balance,
    dayChange: 0,
    dayChangePct: 0,
    availableCash: balance,
  };
}
