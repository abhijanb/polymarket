import { Header } from "./Header";
import { Outlet } from "react-router-dom";

export function Layout() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      <main className="flex-1 mx-auto w-full max-w-[1280px] px-4 py-6">
        <Outlet />
      </main>
      <footer className="border-t border-zinc-900 py-6 text-center text-xs text-zinc-500">
        Polymarket — auth-only • Vite + Redux Toolkit Query
      </footer>
    </div>
  );
}
