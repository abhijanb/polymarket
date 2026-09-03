import { baseApi } from "@/shared/api/baseApi";
import type {
  OrderDto,
  PlaceOrderRequest,
  PlaceOrderResponse,
  OrderOutcome,
  OrderHistoryItem,
} from "@/features/user/model/dashboardTypes";

/**
 * @deprecated Import from "@/features/user/model/dashboardTypes" instead.
 */
export type { OrderDto as OrderHistoryItem, OrderOutcome, PlaceOrderRequest, PlaceOrderResponse };

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    placeOrder: build.mutation<PlaceOrderResponse, PlaceOrderRequest>({
      query: (body) => ({ url: "/api/user/orders", method: "POST", body }),
      invalidatesTags: ["Auth", "Order"],
    }),
    getOrders: build.query<OrderDto[], void>({
      query: () => "/api/user/orders",
      providesTags: ["Order"],
    }),
  }),
});

export const { usePlaceOrderMutation, useGetOrdersQuery } = ordersApi;
