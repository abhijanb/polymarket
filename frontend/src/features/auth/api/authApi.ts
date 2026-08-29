import { baseApi } from "@/shared/api/baseApi";
import { clearAuth, saveAuth } from "@/features/auth/lib/storage";
import type { AuthUser, AuthResponse } from "@/features/auth/model/types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    me: build.query<{ success: boolean; user: AuthUser }, void>({
      query: () => "/api/me",
      providesTags: ["Auth"],
    }),
    login: build.mutation<AuthResponse, { email: string; password: string }>({
      query: (body) => ({ url: "/api/auth/login", method: "POST", body }),
      invalidatesTags: ["Auth"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          saveAuth(data.token, data.user);
        } catch {}
      },
    }),
    register: build.mutation<AuthResponse, { email: string; password: string; name?: string }>({
      query: (body) => ({ url: "/api/auth/register", method: "POST", body }),
      invalidatesTags: ["Auth"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          saveAuth(data.token, data.user);
        } catch {}
      },
    }),
    logout: build.mutation<{ success: boolean; message: string }, void>({
      query: () => ({ url: "/api/auth/logout", method: "POST" }),
      invalidatesTags: ["Auth"],
      async onQueryStarted(_, { queryFulfilled }) {
        try { await queryFulfilled; } catch {}
        finally { clearAuth(); }
      },
    }),
  }),
  overrideExisting: false,
});

export const { useMeQuery, useLoginMutation, useRegisterMutation, useLogoutMutation } = authApi;
