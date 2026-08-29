export type Role = "USER" | "ADMIN";
export type AuthUser = { id: string; email: string; name?: string | null; role: Role };
export type AuthResponse = { success: boolean; token: string; user: AuthUser };
