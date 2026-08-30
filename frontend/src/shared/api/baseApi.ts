import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: (import.meta as any).env?.VITE_API_URL || "http://localhost:3000",
    credentials: "include",
    prepareHeaders: (headers) => {
      try {
        const token = localStorage.getItem("token");
        if (token) headers.set("Authorization", `Bearer ${token}`);
      } catch {}
      return headers;
    },
  }),
  tagTypes: ["Auth", "Market", "User"],
  endpoints: () => ({}),
});
