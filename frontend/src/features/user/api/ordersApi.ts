import { baseApi } from "@/shared/api/baseApi";

export type OrderSide = "YES" | "NO";

export interface PlaceOrderRequest {
  marketId: string;
  side: OrderSide;
  shares: number;
  pricePerShareCents: number;
}

export interface PlaceOrderResponse {
  success: boolean;
  order: {
    id: string;
    userId: string;
    marketId: string;
    outcomeId: string;
    outcomeLabel: string;
    price: string;
    pricePerShareCents: number;
    shares: string;
    totalCostUsd: string;
    status: string;
    createdAt: string;
  };
  position: {
    id: string;
    userId: string;
    marketId: string;
    outcomeId: string;
    shares: string;
    avgPrice: string;
  };
  trade: {
    id: string;
    orderId: string;
    userId: string;
    outcomeId: string;
    price: string;
    pricePerShareCents: number;
    shares: string;
    totalCostUsd: string;
  };
  balance: number;
  probability: number;
  shares: number;
}

export interface OrderHistoryItem {
  id: string;
  outcomeLabel: string;
  price: string;
  pricePerShareCents: number;
  shares: string;
  totalCostUsd: string;
  status: string;
  createdAt: string;
  marketId: string;
  userId: string;
  market: {
    title: string;
    category: string;
    resolutionDate: string;
  };
}

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    placeOrder: build.mutation<PlaceOrderResponse, PlaceOrderRequest>({
      query: (body) => ({ url: "/api/user/orders", method: "POST", body }),
      invalidatesTags: ["Market", "Auth", "Order"],
    }),
    getOrders: build.query<OrderHistoryItem[], void>({
      query: () => "/api/user/orders",
      providesTags: ["Order"],
    }),
  }),
});

export const { usePlaceOrderMutation, useGetOrdersQuery } = ordersApi;
