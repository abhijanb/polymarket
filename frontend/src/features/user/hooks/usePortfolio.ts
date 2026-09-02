import { useGetPortfolioSummaryQuery } from "@/features/user/api/dashboardApi";
import type { PortfolioSummary } from "@/features/user/model/dashboardTypes";

export function usePortfolio() {
  const { data: portfolio, isLoading, error } = useGetPortfolioSummaryQuery();
  return { portfolio, isLoading, error } as {
    portfolio: PortfolioSummary | undefined;
    isLoading: boolean;
    error: unknown;
  };
}
