import { prisma } from "../../../lib/prisma";
import { deriveResult, type OrderResult } from "./result";

const PRODUCT_SELECT = {
  id: true,
  name: true,
  status: true,
  outcome: true,
} as const;

export interface OrderWithResult {
  id: string;
  userId: string;
  productId: string;
  outcome: string;
  shares: number;
  filled: number;
  pricePerShareCents: number;
  totalCostUsd: number;
  status: string;
  createdAt: Date;
  result: OrderResult;
  product: { id: string; name: string; status: string; outcome: string | null };
}

function attachResult<T extends { outcome: string; status: string; product: { status: string; outcome: string | null } }>(row: T): T & { result: OrderResult } {
  return { ...row, result: deriveResult(row, row.product) };
}

export async function getOrdersForUser(userId: string): Promise<OrderWithResult[]> {
  const rows = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { product: { select: PRODUCT_SELECT } },
  });
  return rows.map(attachResult);
}

export interface OrderWithResultAndUser extends OrderWithResult {
  user: { id: string; email: string; name: string | null; role: string };
}

export async function getOrdersForUserAdmin(userId: string): Promise<OrderWithResultAndUser[]> {
  const rows = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      product: { select: PRODUCT_SELECT },
      user: { select: { id: true, email: true, name: true, role: true } },
    },
  });
  return rows.map(attachResult);
}
