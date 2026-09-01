import { baseApi } from "@/shared/api/baseApi";

export type OrderSide = "YES" | "NO";

export interface PlaceOrderRequest {
  marketId: string;
  side: OrderSide;
  amountUsd: number;
}

export interface PlaceOrderResponse {
  success: boolean;
  order: {
    id: string;
    userId: string;
    marketId: string;
    outcomeId: string;
    side: "BUY" | "SELL";
    price: string;
    amount: string;
    filled: string;
    status: "OPEN" | "PARTIAL" | "FILLED" | "CANCELLED";
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
    marketId: string;
    outcomeId: string;
    buyerId: string;
    sellerId: string;
    price: string;
    amount: string;
    createdAt: string;
  };
  balance: number;
  probability: number;
  shares: number;
}

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    placeOrder: build.mutation<PlaceOrderResponse, PlaceOrderRequest>({
      query: (body) => ({ url: "/api/user/orders", method: "POST", body }),
      invalidatesTags: ["Market", "Auth"],
    }),
  }),
});

export const { usePlaceOrderMutation } = ordersApi;
