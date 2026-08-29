import { useAppSelector } from "@/shared/store/hooks";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";

export function UserHome() {
  const user = useAppSelector((s) => s.auth.user);
  const { handleLogout, isLoading } = useLogout();

  if (!user) return null;

  return (
    <div className="max-w-[560px] mx-auto pt-10 space-y-6">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-bold">User Dashboard</h1>
          <p className="text-sm text-zinc-400">Welcome back, {user.name || user.email} — trade prediction markets</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4 space-y-2">
            <div className="flex justify-between text-sm"><span className="text-zinc-500">Email</span><span className="font-medium">{user.email}</span></div>
            <div className="flex justify-between text-sm"><span className="text-zinc-500">Name</span><span className="font-medium">{user.name || "—"}</span></div>
            <div className="flex justify-between text-sm"><span className="text-zinc-500">Role</span><span className="font-medium">{user.role}</span></div>
            <div className="flex justify-between text-sm"><span className="text-zinc-500">ID</span><span className="font-mono text-xs truncate max-w-[180px]">{user.id}</span></div>
          </div>
          <Button variant="outline" className="w-full" onClick={handleLogout} disabled={isLoading}>
            {isLoading ? "Logging out..." : "Log out"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
