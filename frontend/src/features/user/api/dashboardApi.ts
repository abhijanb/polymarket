import { baseApi } from "@/shared/api/baseApi";
import type { MarketApiResponse, PortfolioSummary } from "../model/dashboardTypes";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDashboardMarkets: build.query<MarketApiResponse[], void>({
      query: () => "/api/user/dashboard/markets",
      providesTags: ["Market"],
    }),
    getPortfolioSummary: build.query<PortfolioSummary, void>({
      query: () => "/api/user/portfolio",
      providesTags: ["Auth"],
    }),
  }),
});

export const { useGetDashboardMarketsQuery, useGetPortfolioSummaryQuery } = dashboardApi;
