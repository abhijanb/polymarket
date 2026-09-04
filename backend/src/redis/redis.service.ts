import { redis } from "./redis";
import { logger } from "../lib/logger";

export interface OrderCacheEntry {
  orderId: string;
  productId: string;
  shares: number;
  pricePerShareCents: number;
  createdAt: string;
}

export interface SaveOrderOptions {
  outcomeTime?: Date | null;
}

const REDIS_ORDER_PREFIX = "orders:";
const REDIS_RESOLVE_BUFFER_SECONDS = Number(
  process.env.REDIS_RESOLVE_BUFFER_SECONDS ?? 60,
);
const REDIS_ORDER_TTL_MIN_SECONDS = Number(
  process.env.REDIS_ORDER_TTL_MIN_SECONDS ?? 60,
);
const REDIS_ORDER_TTL_SECONDS = Number(process.env.REDIS_ORDER_TTL_SECONDS ?? 3600);

function keyFor(productId: string): string {
  return `${REDIS_ORDER_PREFIX}${productId}`;
}

function ttlFor(outcomeTime?: Date | null): number {
  if (!outcomeTime) {
    return REDIS_ORDER_TTL_SECONDS;
  }
  // Evict ~1 minute before the product resolves (when the cache is no longer
  // the source of truth for outcomes).
  const expiryAt = outcomeTime.getTime() - REDIS_RESOLVE_BUFFER_SECONDS * 1000;
  const ttlMs = expiryAt - Date.now();
  const ttlSeconds = Math.ceil(ttlMs / 1000);
  return Math.max(REDIS_ORDER_TTL_MIN_SECONDS, ttlSeconds);
}

export async function saveOrder(
  entry: OrderCacheEntry,
  opts?: SaveOrderOptions,
): Promise<void> {
  const key = keyFor(entry.productId);
  const value = JSON.stringify(entry);
  const ttl = ttlFor(opts?.outcomeTime);
  try {
    await redis
      .multi()
      .lPush(key, value)
      .expire(key, ttl)
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
