import { Link, NavLink, Outlet } from "react-router-dom";
import { useAppSelector } from "@/shared/store/hooks";
import { useLogout } from "@/features/auth/hooks/useLogout";

export function AdminLayout() {
  const user = useAppSelector((s) => s.auth.user);
  const { handleLogout } = useLogout();

  return (
    <div className="bg-background text-on-surface min-h-screen overflow-hidden" style={{ fontFamily: "Inter" }}>
      {/* JSON Component: SideNavBar - fixed left 250px */}
      <nav className="fixed left-0 top-0 h-full w-[250px] border-r border-outline-variant bg-surface flex flex-col overflow-y-auto z-20">
        <div className="p-4 border-b border-outline-variant flex items-center gap-3">
          <img
            alt="Admin User Profile"
            className="w-8 h-8 rounded-sm object-cover border border-outline-variant"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEczM6lga6GBlEqUkE0X7FIyciINYh3TCEQjo9tvcWco2u0TveWX1P0TuGDE_irrsCmD5s2YRPX52omO-5CEyTdyhNKoiRaf8Q1StHOMBsxnC7_DQOts5rUPuCOxJFFin2W5OsSHlbsYaP4R3HMSELM1vy1BvfY4-_zhr9u-i3jIwVh8qZYQAaKiqeyPOn-yY6pSD_hfFsAb-rRDiz_IngcS25x5SZHsV9mzDie-q3p5uETrdNX8Ej"
          />
          <div className="flex flex-col">
            <span className="text-[10px] tracking-widest uppercase text-primary font-bold" style={{ fontFamily: "JetBrains Mono" }}>
              EXCHANGE ADMIN
            </span>
            <span className="text-[12px] text-on-surface-variant truncate max-w-[150px]" style={{ fontFamily: "JetBrains Mono" }}>
              {user?.email || "admin@polymarket.local"}
            </span>
            <span className="text-[12px] text-on-surface-variant" style={{ fontFamily: "JetBrains Mono" }}>
              Terminal v2.4.1
            </span>
          </div>
        </div>

        <div className="p-4">
          <Link
            to="/admin/markets/new"
            className="w-full bg-primary text-on-primary text-[14px] font-bold py-2 rounded-sm hover:opacity-90 active:opacity-80 transition-all uppercase tracking-wider flex items-center justify-center"
            style={{ fontFamily: "JetBrains Mono" }}
          >
            NEW MARKET
          </Link>
        </div>

        <div className="flex-1 flex flex-col mt-4">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 border-l-2 ${
                isActive
                  ? "bg-surface-container-highest text-primary border-primary"
                  : "text-on-surface-variant hover:bg-surface-container-low border-transparent"
              } active:opacity-80`
            }
            style={{ fontFamily: "JetBrains Mono" }}
          >
            <span className="material-symbols-outlined text-[20px]">stacked_line_chart</span>
            <span className="text-[14px] font-medium">Markets</span>
          </NavLink>
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 border-l-2 ${
                isActive
                  ? "bg-surface-container-highest text-primary border-primary"
                  : "text-on-surface-variant hover:bg-surface-container-low border-transparent"
              } active:opacity-80`
            }
            style={{ fontFamily: "JetBrains Mono" }}
          >
            <span className="material-symbols-outlined text-[20px]">group</span>
            <span className="text-[14px] font-medium">Users</span>
          </NavLink>
        </div>

        <div className="border-t border-outline-variant mt-auto">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-6 py-3 text-on-surface-variant hover:bg-surface-container-low transition-colors active:opacity-80 text-left" style={{ fontFamily: "JetBrains Mono" }}>
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span className="text-[14px] font-medium">Logout</span>
          </button>
        </div>
      </nav>

      {/* JSON Component: TopNavBar - fixed ml-[250px] w-[calc(100%-250px)] h-14 */}
      <header className="fixed top-0 h-14 border-b border-outline-variant bg-surface-container flex items-center justify-between px-4 w-[calc(100%-250px)] ml-[250px] z-10">
        <div className="flex items-center gap-8 h-full">
          <span className="text-[20px] font-bold text-on-surface tracking-tight uppercase" style={{ fontFamily: "Inter" }}>
            PREDICTION TERMINAL
          </span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 border-r border-outline-variant pr-6">
            <button className="text-on-surface-variant hover:text-on-surface">
              <span className="material-symbols-outlined">notifications</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Canvas - light bento */}
      <main className="ml-[250px] mt-[56px] h-[calc(100vh-56px)] overflow-y-auto p-4 flex flex-col gap-4 bg-background">
        <Outlet />
      </main>
    </div>
  );
}
