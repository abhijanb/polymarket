import { baseApi } from "@/shared/api/baseApi";
import type { PortfolioDto } from "@/features/user/model/dashboardTypes";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPortfolioSummary: build.query<PortfolioDto, void>({
      query: () => "/api/user/portfolio",
      providesTags: ["Auth"],
    }),
  }),
});

export const { useGetPortfolioSummaryQuery } = dashboardApi;
