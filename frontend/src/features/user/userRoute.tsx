import { UserHome } from "@/features/user/pages/UserHome";
import { OrderHistoryPage } from "@/features/user/pages/OrderHistoryPage";
import { UserLayout } from "@/features/user/layout/UserLayout";
import { RequireRole } from "@/features/auth/lib/RequireRole";

export const userRoute = {
  element: (
    <RequireRole role="USER">
      <UserLayout />
    </RequireRole>
  ),
  children: [
    { path: "/user", element: <UserHome /> },
    { path: "/user/orders", element: <OrderHistoryPage /> },
  ],
};
