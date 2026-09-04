import { redis } from "./redis";
import { logger } from "../lib/logger";

export interface OrderCacheEntry {
  orderId: string;
  productId: string;
  shares: number;
  pricePerShareCents: number;
  createdAt: string;
}

const REDIS_ORDER_PREFIX = "orders:";
const REDIS_ORDER_TTL_SECONDS = Number(process.env.REDIS_ORDER_TTL_SECONDS ?? 3600);

function keyFor(productId: string): string {
  return `${REDIS_ORDER_PREFIX}${productId}`;
}

export async function saveOrder(entry: OrderCacheEntry): Promise<void> {
  const key = keyFor(entry.productId);
  const value = JSON.stringify(entry);
  try {
    await redis
      .multi()
      .lPush(key, value)
      .expire(key, REDIS_ORDER_TTL_SECONDS)
      .exec();
  } catch (err) {
    logger.warn("redis.order_cache_save_failed", {
      productId: entry.productId,
      orderId: entry.orderId,
    }, err);
  }
}

export async function getProductOrders(
  productId: string,
  limit: number = 100,
): Promise<OrderCacheEntry[]> {
  const key = keyFor(productId);
  try {
    const end = limit - 1;
    const raw = await redis.lRange(key, 0, end);
    const out: OrderCacheEntry[] = [];
    for (const line of raw) {
      if (!line) continue;
      out.push(JSON.parse(line) as OrderCacheEntry);
    }
    return out;
  } catch (err) {
    logger.warn("redis.order_cache_read_failed", { productId, limit }, err);
    return [];
  }
}
