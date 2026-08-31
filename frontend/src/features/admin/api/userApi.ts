import { baseApi } from "@/shared/api/baseApi";
import type { User } from "@/shared/types/user";

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<User[], void>({
      query: () => "/api/admin/users",
      providesTags: ["User"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetUsersQuery } = userApi;
