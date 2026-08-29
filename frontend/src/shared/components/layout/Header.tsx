import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { useLogout } from "@/features/auth/hooks/useLogout";

export function Header() {
  const { user, handleLogout } = useLogout();
  const navigate = useNavigate();

  const homePath = user?.role === "ADMIN" ? "/admin" : user?.role === "USER" ? "/user" : "/";

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-black/70 border-b border-zinc-800">
      <div className="mx-auto max-w-[1280px] px-4 h-[64px] flex items-center gap-4">
        <Link to={homePath} className="flex items-center gap-2 shrink-0">
          <div className="h-8 w-8 rounded-lg bg-white text-black grid place-items-center font-black text-sm">P</div>
          <span className="font-bold tracking-tight text-[19px]">polymarket</span>
          <span className="hidden sm:inline text-[10px] font-bold tracking-widest text-zinc-500 border border-zinc-800 rounded px-1.5 py-0.5 ml-1">BETA</span>
          <span className="hidden sm:inline text-[10px] font-medium text-zinc-600 ml-2">auth-only</span>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          {user ? (
            <>
              <div className="hidden sm:flex flex-col items-end mr-2">
                <span className="text-sm font-medium leading-none">{user.name || user.email}</span>
                <span className="text-xs text-zinc-500">{user.email}</span>
              </div>
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 grid place-items-center text-sm font-bold">
                {(user.name || user.email)[0]?.toUpperCase()}
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="hidden sm:inline-flex">Log out</Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>Log in</Button>
              <Button size="sm" onClick={() => navigate("/register")}>Sign up</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
