import { useGetOrdersQuery } from "@/features/user/api/ordersApi";
import type { OrderHistoryItem } from "@/features/user/api/ordersApi";
import { formatCurrency, formatNumber } from "@/shared/lib/utils";

export interface FormattedOrder {
  id: string;
  productName: string;
  outcome: string;
  isYes: boolean;
  shares: string;
  pricePerShare: string;
  totalCost: string;
  status: string;
  time: string;
}

export function useOrderHistory() {
  const { data: orders = [], isLoading, error, refetch } = useGetOrdersQuery();

  const formattedOrders: FormattedOrder[] = (orders ?? []).map((o: OrderHistoryItem) => ({
    id: o.id,
    productName: o.product?.name ?? "Unknown",
    outcome: o.outcome,
    isYes: o.outcome === "YES",
    shares: formatNumber(o.shares),
    pricePerShare: formatCurrency(o.pricePerShareCents / 100),
    totalCost: formatCurrency(o.totalCostUsd),
    status: o.status,
    time: new Date(o.createdAt).toLocaleString(),
  }));

  return { orders: formattedOrders, isLoading, error, refetch, count: formattedOrders.length };
}
