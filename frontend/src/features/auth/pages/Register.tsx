import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { useRegister } from "@/features/auth/hooks/useRegister";

export function Register() {
  const { form, onSubmit, serverError, isLoading } = useRegister();
  const { register: rhfReg, handleSubmit, formState: { errors } } = form;

  return (
    <div className="max-w-[420px] mx-auto pt-8">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-bold">Create account</h1>
          <p className="text-sm text-zinc-400">Start trading in seconds</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-sm font-medium text-zinc-200">Name (optional)</label>
              <input
                id="name"
                placeholder="Alice"
                className="flex h-10 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/15 focus:border-zinc-700 transition"
                {...rhfReg("name")}
              />
              {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-zinc-200">Email</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="flex h-10 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/15 focus:border-zinc-700 transition"
                {...rhfReg("email")}
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
                {...rhfReg("password")}
              />
              {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
              <p className="text-xs text-zinc-500">Min 6 characters, max 100.</p>
            </div>
            {serverError && <div className="rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 px-3 py-2 text-sm">{serverError}</div>}
            <Button type="submit" className="w-full rounded-xl" size="lg" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create account"}
            </Button>
            <p className="text-sm text-center text-zinc-500">
              Already have an account? <Link to="/login" className="text-white underline decoration-zinc-600 underline-offset-4 hover:decoration-white">Log in</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
