/**
 * Pure helpers for deriving the win/loss/pending/void result of an order
 * based on the underlying product's resolution state.
 *
 * Rules:
 *   - order.status === "CANCELLED"  → "VOID"
 *   - product.status !== "RESOLVED"  → "PENDING"
 *   - product.outcome is null/empty  → "VOID"   (data integrity)
 *   - order.outcome === product.outcome → "WIN"
 *   - otherwise                       → "LOSS"
 *
 * No imports from react, network, or the prisma client so this stays testable.
 */

export type OrderResult = "WIN" | "LOSS" | "PENDING" | "VOID";

export interface ProductSnapshot {
  status: string;
  outcome: string | null;
}

export interface OrderSnapshot {
  outcome: string;
  status: string;
}

export function deriveResult(order: OrderSnapshot, product: ProductSnapshot): OrderResult {
  if (order.status === "CANCELLED") return "VOID";
  if (product.status !== "RESOLVED") return "PENDING";
  if (!product.outcome) return "VOID";
  return order.outcome === product.outcome ? "WIN" : "LOSS";
}

export function resultLabel(result: OrderResult): string {
  switch (result) {
    case "WIN": return "Won";
    case "LOSS": return "Lost";
    case "PENDING": return "Pending";
    case "VOID": return "Void";
  }
}
