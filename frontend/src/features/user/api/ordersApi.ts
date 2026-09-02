import { baseApi } from "@/shared/api/baseApi";

export type OrderOutcome = "YES" | "NO";

export interface PlaceOrderRequest {
  productId: string;
  outcome: OrderOutcome;
  shares: number;
  pricePerShareCents: number;
}

export interface PlaceOrderResponse {
  success: boolean;
  order: {
    id: string;
    userId: string;
    productId: string;
    outcome: string;
    shares: number;
    filled: number;
    pricePerShareCents: number;
    totalCostUsd: number;
    status: string;
    createdAt: string;
  };
  balance: number;
  probability: number;
  shares: number;
}

export interface OrderHistoryItem {
  id: string;
  userId: string;
  productId: string;
  outcome: string;
  shares: number;
  filled: number;
  pricePerShareCents: number;
  totalCostUsd: number;
  status: string;
  createdAt: string;
  product: {
    name: string;
    status: string;
  };
}

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    placeOrder: build.mutation<PlaceOrderResponse, PlaceOrderRequest>({
      query: (body) => ({ url: "/api/user/orders", method: "POST", body }),
      invalidatesTags: ["Auth", "Order"],
    }),
    getOrders: build.query<OrderHistoryItem[], void>({
      query: () => "/api/user/orders",
      providesTags: ["Order"],
    }),
  }),
});

export const { usePlaceOrderMutation, useGetOrdersQuery } = ordersApi;
