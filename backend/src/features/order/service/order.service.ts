import { prisma } from "../../../lib/prisma";
import { Prisma } from "../../../generated/prisma/client";

export class OrderError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

interface PlaceOrderArgs {
  userId: string;
  marketId: string;
  side: "YES" | "NO";
  amountUsd: number;
}

export async function placeOrder({ userId, marketId, side, amountUsd }: PlaceOrderArgs) {
  return prisma.$transaction(
    async (tx) => {
      const market = await tx.market.findUnique({
        where: { id: marketId },
        select: { id: true, status: true, outcomes: { where: { label: side }, select: { id: true, probability: true } } },
      });

      if (!market) {
        throw new OrderError(404, "Market not found");
      }
      if (market.status !== "ACTIVE") {
        throw new OrderError(400, "Market is not active");
      }
      const outcome = market.outcomes[0];
      if (!outcome) {
        throw new OrderError(404, `Outcome "${side}" not found for this market`);
      }

      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { balance: true },
      });
      if (!user) {
        throw new OrderError(404, "User not found");
      }

      const balance = Number(user.balance);
      if (balance < amountUsd) {
        throw new OrderError(400, "Insufficient balance");
      }

      const probability = Number(outcome.probability);
      const price = new Prisma.Decimal(probability.toFixed(4));
      const amountUsdDecimal = new Prisma.Decimal(amountUsd.toFixed(2));
      const sharesDecimal = amountUsdDecimal.dividedBy(price);
      const shares = Number(sharesDecimal.toFixed(6));

      await tx.user.update({
        where: { id: userId },
        data: { balance: { decrement: amountUsdDecimal } },
      });

      const existingPosition = await tx.position.findUnique({
        where: { userId_outcomeId: { userId, outcomeId: outcome.id } },
      });

      let position;
      if (existingPosition) {
        const oldShares = Number(existingPosition.shares);
        const oldAvg = Number(existingPosition.avgPrice);
        const newShares = oldShares + shares;
        const newAvg = newShares > 0 ? (oldShares * oldAvg + shares * probability) / newShares : 0;
        position = await tx.position.update({
          where: { userId_outcomeId: { userId, outcomeId: outcome.id } },
          data: {
            shares: new Prisma.Decimal(newShares.toFixed(6)),
            avgPrice: new Prisma.Decimal(newAvg.toFixed(4)),
          },
        });
      } else {
        position = await tx.position.create({
          data: {
            userId,
            marketId,
            outcomeId: outcome.id,
            shares: new Prisma.Decimal(shares.toFixed(6)),
            avgPrice: new Prisma.Decimal(probability.toFixed(4)),
          },
        });
      }

      const order = await tx.order.create({
        data: {
          userId,
          marketId,
          outcomeId: outcome.id,
          side: "BUY",
          price,
          amount: new Prisma.Decimal(shares.toFixed(6)),
          filled: new Prisma.Decimal(shares.toFixed(6)),
          status: "FILLED",
        },
      });

      const trade = await tx.trade.create({
        data: {
          marketId,
          outcomeId: outcome.id,
          buyOrderId: order.id,
          sellOrderId: order.id,
          buyerId: userId,
          sellerId: userId,
          price,
          amount: new Prisma.Decimal(shares.toFixed(6)),
        },
      });

      const updatedUser = await tx.user.findUnique({
        where: { id: userId },
        select: { balance: true },
      });

      return {
        order,
        position,
        trade,
        balance: Number(updatedUser!.balance),
        probability,
        shares,
      };
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
  );
}
