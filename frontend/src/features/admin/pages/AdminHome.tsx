import { useAppSelector } from "@/shared/store/hooks";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";

export function AdminHome() {
  const user = useAppSelector((s) => s.auth.user);
  const { handleLogout, isLoading } = useLogout();

  if (!user) return null;

  return (
    <div className="max-w-[640px] mx-auto pt-10 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            <span className="text-[10px] font-bold tracking-widest bg-violet-600 text-white px-2 py-0.5 rounded">ADMIN</span>
          </div>
          <p className="text-sm text-zinc-400">Privileged view — {user.email}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4 space-y-2">
            <div className="flex justify-between text-sm"><span className="text-zinc-500">Email</span><span className="font-medium">{user.email}</span></div>
            <div className="flex justify-between text-sm"><span className="text-zinc-500">Name</span><span className="font-medium">{user.name || "—"}</span></div>
            <div className="flex justify-between text-sm"><span className="text-zinc-500">Role</span><span className="font-medium text-violet-400">{user.role}</span></div>
            <div className="flex justify-between text-sm"><span className="text-zinc-500">ID</span><span className="font-mono text-xs truncate max-w-[180px]">{user.id}</span></div>
          </div>
          <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4">
            <p className="text-sm text-zinc-300">Admin actions placeholder</p>
            <p className="text-xs text-zinc-500 mt-1">Manage users, markets, or seed data. Protect this route via RequireRole.</p>
          </div>
          <Button variant="outline" className="w-full" onClick={handleLogout} disabled={isLoading}>
            {isLoading ? "Logging out..." : "Log out"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
