import { prisma } from "../../../lib/prisma";
import { Prisma } from "../../../generated/prisma/client";

export class OrderError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

interface PlaceOrderArgs {
  userId: string;
  productId: string;
  outcome: "YES" | "NO";
  shares: number;
  pricePerShareCents: number;
}

export async function placeOrder({ userId, productId, outcome, shares, pricePerShareCents }: PlaceOrderArgs) {
  return prisma.$transaction(
    async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: productId },
        select: { id: true, status: true, name: true },
      });

      if (!product) {
        throw new OrderError(404, "Product not found");
      }
      if (product.status !== "ACTIVE") {
        throw new OrderError(400, "Product is not active");
      }

      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { balance: true },
      });
      if (!user) {
        throw new OrderError(404, "User not found");
      }

      const totalCost = shares * pricePerShareCents;
      if (totalCost <= 0) {
        throw new OrderError(400, "Invalid cost");
      }

      const balance = Number(user.balance);
      if (balance < totalCost) {
        throw new OrderError(400, "Insufficient balance");
      }

      const order = await tx.order.create({
        data: {
          userId,
          productId,
          outcome,
          shares,
          filled: shares,
          pricePerShareCents,
          totalCostUsd: totalCost,
          status: "FILLED",
        },
      });

      await tx.user.update({
        where: { id: userId },
        data: { balance: { decrement: totalCost } },
      });

      const updatedUser = await tx.user.findUnique({
        where: { id: userId },
        select: { balance: true },
      });

      return {
        order,
        balance: Number(updatedUser!.balance),
        probability: pricePerShareCents / 100,
        shares,
      };
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
  );
}

export async function getUserOrders(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      product: { select: { name: true, status: true } },
    },
  });
}
