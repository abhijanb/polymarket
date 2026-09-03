import { useGetOrdersQuery } from "@/features/user/api/ordersApi";
import {
  takeRecent,
  toRecentOrderList,
  type RecentOrderVm,
} from "@/features/user/model/userModel";

export interface UseRecentOrdersResult {
  items: RecentOrderVm[];
  totalCount: number;
  isLoading: boolean;
  isUninitialized: boolean;
  error: unknown;
  refetch: () => void;
}

export function useRecentOrders(limit = 5): UseRecentOrdersResult {
  const { data, isLoading, isUninitialized, error, refetch } = useGetOrdersQuery();
  const all = toRecentOrderList(data);
  return {
    items: takeRecent(all, limit),
    totalCount: all.length,
    isLoading,
    isUninitialized,
    error,
    refetch,
  };
}
