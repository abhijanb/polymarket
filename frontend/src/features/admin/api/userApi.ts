import { baseApi } from "@/shared/api/baseApi";
import type { User } from "@/shared/types/user";
import type { OrderDto } from "@/features/user/model/dashboardTypes";

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<User[], void>({
      query: () => "/api/admin/users",
      providesTags: ["User"],
    }),
    getUserOrders: build.query<OrderDto[], string>({
      query: (id) => `/api/admin/users/${id}/orders`,
      providesTags: (_result, _error, id) => [{ type: "Order", id }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetUsersQuery, useGetUserOrdersQuery } = userApi;
