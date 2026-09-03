import { useGetOrdersQuery } from "@/features/user/api/ordersApi";
import { toRecentOrderList, type RecentOrderVm } from "@/features/user/model/userModel";

export interface UseOrderHistoryResult {
  orders: RecentOrderVm[];
  isLoading: boolean;
  isUninitialized: boolean;
  error: unknown;
  refetch: () => void;
  count: number;
}

export function useOrderHistory(): UseOrderHistoryResult {
  const { data, isLoading, isUninitialized, error, refetch } = useGetOrdersQuery();
  const orders = toRecentOrderList(data);
  return {
    orders,
    isLoading,
    isUninitialized,
    error,
    refetch,
    count: orders.length,
  };
}
