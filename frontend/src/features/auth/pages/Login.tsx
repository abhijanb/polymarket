import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { useLogin } from "@/features/auth/hooks/useLogin";

export function Login() {
  const { form, onSubmit, serverError, isLoading } = useLogin();
  const { register, handleSubmit, formState: { errors } } = form;

  return (
    <div className="max-w-[420px] mx-auto pt-8">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-bold">Welcome back</h1>
          <p className="text-sm text-zinc-400">Log in to trade prediction markets</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-zinc-200">Email</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="flex h-10 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/15 focus:border-zinc-700 transition"
                {...register("email")}
              />
              {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium text-zinc-200">Password</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="flex h-10 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/15 focus:border-zinc-700 transition"
                {...register("password")}
              />
              {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
            </div>
            {serverError && <div className="rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 px-3 py-2 text-sm">{serverError}</div>}
            <Button type="submit" className="w-full rounded-xl" size="lg" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Log in"}
            </Button>
            <p className="text-sm text-center text-zinc-500">
              No account? <Link to="/register" className="text-white underline decoration-zinc-600 underline-offset-4 hover:decoration-white">Create one</Link>
            </p>
            <p className="text-xs text-center text-zinc-600">
              Demo: use any registered account. Backend at <code className="bg-zinc-800 px-1 py-0.5 rounded">/api/auth/login</code>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
