import { useState, useRef, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { useAppSelector } from "@/shared/store/hooks";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { cn } from "@/shared/lib/utils";

export function UserLayout() {
  const user = useAppSelector((s) => s.auth.user);
  const { handleLogout } = useLogout();

  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setProfileOpen(false);
    };
    if (profileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [profileOpen]);

  return (
    <div className="h-screen overflow-hidden bg-surface-canvas font-sans">
      <header
        className="fixed top-0 left-0 right-0 h-16 bg-surface/95 backdrop-blur-sm border-b border-outline-variant z-50 flex items-center px-6"
      >
        <div className="flex items-center gap-8 flex-1">
          <Link
            to="/user"
            className="text-primary font-bold text-[18px] tracking-tight uppercase"
            style={{ fontFamily: "JetBrains Mono" }}
          >
            PREDICTX
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="p-2 rounded-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
            aria-label="Notifications"
            title="Notifications"
          >
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant bg-primary/20 focus:outline-none focus:ring-1 focus:ring-primary"
              aria-haspopup="menu"
              aria-expanded={profileOpen}
              aria-label="Open profile menu"
            >
              <img
                alt="Profile"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEczM6lga6GBlEqUkE0X7FIyciINYh3TCEQjo9tvcWco2u0TveWX1P0TuGDE_irrsCmD5s2YRPX52omO-5CEyTdyhNKoiRaf8Q1StHOMBsxnC7_DQOts5rUPuCOxJFFin2W5OsSHlbsYaP4R3HMSELM1vy1BvfY4-_zhr9u-i3jIwVh8qZYQAaKiqeyPOn-yY6pSD_hfFsAb-rRDiz_IngcS25x5SZHsV9mzDie-q3p5uETrdNX8Ej"
              />
            </button>
            {profileOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full mt-2 w-60 bg-surface-container border border-outline-variant rounded-sm shadow-lg z-50 py-1 backdrop-blur-sm"
              >
                <div className="px-4 py-3 border-b border-outline-variant">
                  <span
                    className="block text-[14px] font-medium text-on-surface truncate"
                    style={{ fontFamily: "Inter" }}
                    title={user?.name || "User"}
                  >
                    {user?.name || "User"}
                  </span>
                  <span
                    className="block text-[12px] text-on-surface-variant truncate"
                    style={{ fontFamily: "JetBrains Mono" }}
                    title={user?.email || ""}
                  >
                    {user?.email}
                  </span>
                </div>
                <Link
                  to="/user/orders"
                  onClick={() => setProfileOpen(false)}
                  role="menuitem"
                  className={cn(
                    "flex items-center gap-3 px-4 py-2 text-[14px] text-on-surface-variant",
                    "hover:text-on-surface hover:bg-surface-container-low transition-colors"
                  )}
                  style={{ fontFamily: "Inter" }}
                >
                  <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                  Order History
                </Link>
                <div className="my-1 border-t border-outline-variant" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setProfileOpen(false);
                    handleLogout();
                  }}
                  role="menuitem"
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2 text-[14px] text-on-surface-variant",
                    "hover:text-on-surface hover:bg-surface-container-low transition-colors text-left"
                  )}
                  style={{ fontFamily: "Inter" }}
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="mt-16 h-[calc(100vh-64px)] overflow-y-auto p-6 bg-surface-canvas">
        <Outlet />
      </main>
    </div>
  );
}
