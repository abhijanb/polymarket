import { baseApi } from "@/shared/api/baseApi";

export interface MarketDto {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  outcome: string | null;
  outcomeTime: string | null;
}

export const marketsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getActiveMarkets: build.query<MarketDto[], void>({
      query: () => "/api/markets",
      providesTags: ["Market"],
    }),
  }),
});

export const { useGetActiveMarketsQuery } = marketsApi;
