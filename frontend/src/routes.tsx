import { createBrowserRouter, Navigate } from "react-router-dom";
import { Layout } from "@/shared/components/layout/Layout";
import { Login } from "@/features/auth/pages/Login";
import { Register } from "@/features/auth/pages/Register";
import { AuthLanding } from "@/features/auth/pages/AuthLanding";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <AuthLanding /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "*", element: <Navigate to="/login" replace /> },
    ],
  },
]);
