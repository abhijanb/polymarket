import { prisma } from "../../../lib/prisma";
import { Prisma } from "../../../generated/prisma/client";
import { logger } from "../../../lib/logger";
import { saveOrder } from "../../../redis/redis.service";
import { deriveResult } from "../lib/result";
import type { OrderResult } from "../lib/result";
import { getOrdersForUser as _getOrdersForUser } from "../lib/orders";

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
  logger.debug("order.service.place.start", { userId, productId, shares });
  let outcomeTime: Date | null = null;
  const result = await prisma.$transaction(
    async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: productId },
        select: { id: true, status: true, name: true, outcome: true, outcomeTime: true },
      });

      if (!product) {
        logger.warn("order.service.place.product_not_found", { userId, productId });
        throw new OrderError(404, "Product not found");
      }
      if (product.status !== "ACTIVE") {
        logger.warn("order.service.place.product_inactive", {
          userId,
          productId,
          status: product.status,
        });
        throw new OrderError(400, "Product is not active");
      }

      outcomeTime = product.outcomeTime;

      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { balance: true },
      });
      if (!user) {
        logger.warn("order.service.place.user_not_found", { userId });
        throw new OrderError(404, "User not found");
      }

      const totalCost = shares * pricePerShareCents;
      if (totalCost <= 0) {
        logger.warn("order.service.place.invalid_cost", { userId, totalCost });
        throw new OrderError(400, "Invalid cost");
      }

      const balance = Number(user.balance);
      if (balance < totalCost) {
        logger.warn("order.service.place.insufficient_balance", {
          userId,
          balance,
          totalCost,
        });
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

      logger.debug("order.service.place.committed", {
        userId,
        orderId: order.id,
        totalCost,
      });

      const result: OrderResult = deriveResult(order, product);
      return {
        order: { ...order, result },
        balance: Number(updatedUser!.balance),
        probability: pricePerShareCents / 100,
        shares,
        result,
      };
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
  );

  void saveOrder({
    orderId: result.order.id,
    productId: result.order.productId,
    shares: result.order.shares,
    pricePerShareCents: result.order.pricePerShareCents,
    createdAt: result.order.createdAt.toISOString(),
  }, { outcomeTime }).catch((err) =>
    logger.warn("order.redis_cache_failed", { orderId: result.order.id }, err),
  );

  return result;
}

export async function getUserOrders(userId: string) {
  logger.debug("order.service.list.start", { userId });
  const orders = await _getOrdersForUser(userId);
  logger.debug("order.service.list.done", { userId, count: orders.length });
  return orders;
}
