import { UserHome } from "@/features/user/pages/UserHome";
import { RequireRole } from "@/features/auth/lib/RequireRole";

export const userRoute = {
  path: "/user",
  element: (
    <RequireRole role="USER">
      <UserHome />
    </RequireRole>
  ),
};
