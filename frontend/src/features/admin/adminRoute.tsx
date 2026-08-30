import { AdminLayout } from "@/features/admin/layout/AdminLayout";
import { AdminHome } from "@/features/admin/pages/AdminHome";
import { MarketList } from "@/features/market/pages/MarketList";
import { CreateMarketPage } from "@/features/market/pages/CreateMarketPage";
import { MarketDetail } from "@/features/market/pages/MarketDetail";
import { EditMarketPage } from "@/features/market/pages/EditMarketPage";
import { RequireRole } from "@/features/auth/lib/RequireRole";

export const adminRoute = {
  element: (
    <RequireRole role="ADMIN">
      <AdminLayout />
    </RequireRole>
  ),
  children: [
    { path: "/admin", element: <AdminHome /> },
    { path: "/admin/markets", element: <MarketList /> },
    { path: "/admin/markets/new", element: <CreateMarketPage /> },
    { path: "/admin/markets/:id", element: <MarketDetail /> },
    { path: "/admin/markets/:id/edit", element: <EditMarketPage /> },
  ],
};
