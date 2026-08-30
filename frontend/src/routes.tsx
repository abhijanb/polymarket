import { createBrowserRouter, Navigate } from "react-router-dom";
import { Layout } from "@/shared/components/layout/Layout";
import { Login } from "@/features/auth/pages/Login";
import { Register } from "@/features/auth/pages/Register";
import { GuestOnly } from "@/features/auth/lib/RequireRole";
import { userRoute } from "@/features/user/userRoute";
import { adminRoute } from "@/features/admin/adminRoute";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Navigate to="/admin" replace /> },
      userRoute,
      { path: "/login", element: <GuestOnly><Login /></GuestOnly> },
      { path: "/register", element: <GuestOnly><Register /></GuestOnly> },
      { path: "*", element: <Navigate to="/login" replace /> },
    ],
  },
  adminRoute,
]);
