export type AuthUser = { id: string; email: string; name?: string | null; role: string };
export type AuthResponse = { success: boolean; token: string; user: AuthUser };
