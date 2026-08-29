import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/shared/store/hooks";
import { useLogoutMutation } from "@/features/auth/api/authApi";

export function useLogout(options?: { redirectTo?: string }) {
  const user = useAppSelector((s) => s.auth.user);
  const [logout, { isLoading }] = useLogoutMutation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout().unwrap().catch(() => {});
    navigate(options?.redirectTo ?? "/login");
  };

  return { user, handleLogout, isLoading, logout };
}
