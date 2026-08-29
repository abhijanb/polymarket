import { AdminHome } from "@/features/admin/pages/AdminHome";
import { RequireRole } from "@/features/auth/lib/RequireRole";

export const adminRoute = {
  path: "/admin",
  element: (
    <RequireRole role="ADMIN">
      <AdminHome />
    </RequireRole>
  ),
};
