import { baseApi } from "@/shared/api/baseApi";
import type { CreateMarketInput } from "@/features/admin/market/lib/schemas";
import type { Market, UpdateMarketInput } from "@/shared/types/market";

export const marketApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMarkets: build.query<Market[], void>({
      query: () => "/api/market",
      providesTags: ["Market"],
    }),
    getMarketById: build.query<Market, string>({
      query: (id) => `/api/market/${id}`,
      providesTags: (_, __, id) => [{ type: "Market", id }],
    }),
    createMarket: build.mutation<Market, CreateMarketInput>({
      query: (body) => ({ url: "/api/market", method: "POST", body }),
      invalidatesTags: ["Market"],
    }),
    updateMarket: build.mutation<Market, { id: string; data: UpdateMarketInput }>({
      query: ({ id, data }) => ({ url: `/api/market/${id}`, method: "PUT", body: data }),
      invalidatesTags: (_, __, { id }) => [{ type: "Market", id }, "Market"],
    }),
    deleteMarket: build.mutation<Market, string>({
      query: (id) => ({ url: `/api/market/${id}`, method: "DELETE" }),
      invalidatesTags: (_, __, id) => [{ type: "Market", id }, "Market"],
    }),
  }),
});

export const {
  useGetMarketsQuery,
  useGetMarketByIdQuery,
  useCreateMarketMutation,
  useUpdateMarketMutation,
  useDeleteMarketMutation,
} = marketApi;
