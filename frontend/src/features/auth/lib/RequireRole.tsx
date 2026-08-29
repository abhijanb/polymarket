import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/shared/store/hooks";
import type { Role } from "@/features/auth/model/types";

export function RequireRole({ role, children }: { role: Role | Role[]; children?: React.ReactNode }) {
  const user = useAppSelector((s) => s.auth.user);
  const initialized = useAppSelector((s) => s.auth.initialized);

  if (!initialized) {
    return (
      <div className="min-h-[50vh] grid place-items-center text-zinc-500">
        <span className="text-sm">Loading...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const allowed = Array.isArray(role) ? role : [role];
  if (!allowed.includes(user.role)) {
    const redirect = user.role === "ADMIN" ? "/admin" : "/user";
    return <Navigate to={redirect} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}

export function GuestOnly({ children }: { children?: React.ReactNode }) {
  const user = useAppSelector((s) => s.auth.user);
  const initialized = useAppSelector((s) => s.auth.initialized);

  if (!initialized) {
    return (
      <div className="min-h-[50vh] grid place-items-center text-zinc-500">
        <span className="text-sm">Loading...</span>
      </div>
    );
  }

  if (user) {
    const redirect = user.role === "ADMIN" ? "/admin" : "/user";
    return <Navigate to={redirect} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
