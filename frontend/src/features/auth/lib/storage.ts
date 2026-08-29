import type { AuthUser } from "../model/types";

export function saveAuth(token: string, user: AuthUser) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}
export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}
export function loadUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) as AuthUser : null;
  } catch { return null; }
}
export function getInitialToken(): string | null {
  try { return localStorage.getItem("token"); } catch { return null; }
}
