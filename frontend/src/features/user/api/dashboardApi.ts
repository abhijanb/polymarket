import { baseApi } from "@/shared/api/baseApi";
import type { PortfolioSummary } from "../model/dashboardTypes";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPortfolioSummary: build.query<PortfolioSummary, void>({
      query: () => "/api/user/portfolio",
      providesTags: ["Auth"],
    }),
  }),
});

export const { useGetPortfolioSummaryQuery } = dashboardApi;
