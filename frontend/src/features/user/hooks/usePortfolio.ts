import { useGetPortfolioSummaryQuery } from "@/features/user/api/dashboardApi";
import { toPortfolioVm, type PortfolioVm } from "@/features/user/model/userModel";

export interface UsePortfolioResult {
  portfolio: PortfolioVm | null;
  isLoading: boolean;
  isUninitialized: boolean;
  error: unknown;
  refetch: () => void;
}

export function usePortfolio(): UsePortfolioResult {
  const { data, isLoading, isUninitialized, error, refetch } = useGetPortfolioSummaryQuery();
  return {
    portfolio: toPortfolioVm(data ?? null),
    isLoading,
    isUninitialized,
    error,
    refetch,
  };
}
