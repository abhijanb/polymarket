import { useAppSelector } from "@/shared/store/hooks";
import { useLogoutMutation } from "@/features/auth/api/authApi";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { WelcomeCTA } from "@/shared/components/ui/empty-state";

export function AuthLanding() {
  const user = useAppSelector((s) => s.auth.user);
  const [logout, { isLoading }] = useLogoutMutation();

  if (!user) {
    return <WelcomeCTA />;
  }

  return (
    <div className="max-w-[480px] mx-auto pt-10 space-y-6">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-bold">Authenticated</h1>
          <p className="text-sm text-zinc-400">You are logged in via RTK Query <code className="bg-zinc-800 px-1 py-0.5 rounded">useMeQuery</code></p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4 space-y-2">
            <div className="flex justify-between text-sm"><span className="text-zinc-500">Email</span><span className="font-medium">{user.email}</span></div>
            <div className="flex justify-between text-sm"><span className="text-zinc-500">Name</span><span className="font-medium">{user.name || "—"}</span></div>
            <div className="flex justify-between text-sm"><span className="text-zinc-500">Role</span><span className="font-medium">{user.role}</span></div>
            <div className="flex justify-between text-sm"><span className="text-zinc-500">ID</span><span className="font-mono text-xs truncate max-w-[180px]">{user.id}</span></div>
          </div>
          <Button variant="outline" className="w-full" onClick={() => logout().unwrap().catch(()=>{})} disabled={isLoading}>
            {isLoading ? "Logging out..." : "Log out"}
          </Button>
          <p className="text-xs text-center text-zinc-600">Token stored in <code className="bg-zinc-900 px-1 py-0.5 rounded">localStorage</code> + httpOnly cookie. Clear via <code className="bg-zinc-900 px-1 py-0.5 rounded">POST /api/auth/logout</code>.</p>
        </CardContent>
      </Card>
    </div>
  );
}
