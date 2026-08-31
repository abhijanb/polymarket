import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { useLogoutMutation } from "@/features/auth/api/authApi";
import { clearCredentials } from "@/features/auth/store/authSlice";

export function useLogout(options?: { redirectTo?: string }) {
  const user = useAppSelector((s) => s.auth.user);
  const [logout, { isLoading }] = useLogoutMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    dispatch(clearCredentials());
    await logout().unwrap().catch(() => {});
    navigate(options?.redirectTo ?? "/login");
  };

  return { user, handleLogout, isLoading, logout };
}
