import { useState, useRef, useEffect } from "react";
import { Link, Outlet, useOutletContext } from "react-router-dom";
import { useAppSelector } from "@/shared/store/hooks";
import { useLogout } from "@/features/auth/hooks/useLogout";
import type { MarketDashboard } from "@/features/user/model/dashboardTypes";
import { OrderEntryModal } from "@/features/user/components/OrderEntryModal";
import type { OrderSide } from "@/features/user/api/ordersApi";

export function UserLayout() {
  const user = useAppSelector((s) => s.auth.user);
  const { handleLogout } = useLogout();

  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const [orderModal, setOrderModal] = useState<{ market: MarketDashboard; side: OrderSide } | null>(null);

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
      <header className="fixed top-0 left-0 right-0 h-16 bg-surface border-b border-outline-variant z-50 flex items-center px-[24px]">
        <div className="flex items-center gap-8 flex-1">
          <Link
            to="/user"
            className="text-primary font-bold text-[18px] tracking-tight uppercase"
            style={{ fontFamily: "JetBrains Mono" }}
          >
            PREDICTX
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="px-4 py-2 bg-primary text-on-primary text-[14px] font-bold rounded-sm hover:opacity-90 active:opacity-80 transition-all uppercase tracking-wider">
            Connect Wallet
          </button>
          <button className="md:hidden p-2 rounded-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant bg-primary/20 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <img
                alt="Profile"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEczM6lga6GBlEqUkE0X7FIyciINYh3TCEQjo9tvcWco2u0TveWX1P0TuGDE_irrsCmD5s2YRPX52omO-5CEyTdyhNKoiRaf8Q1StHOMBsxnC7_DQOts5rUPuCOxJFFin2W5OsSHlbsYaP4R3HMSELM1vy1BvfY4-_zhr9u-i3jIwVh8qZYQAaKiqeyPOn-yY6pSD_hfFsAb-rRDiz_IngcS25x5SZHsV9mzDie-q3p5uETrdNX8Ej"
              />
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-surface border border-outline-variant rounded-sm shadow-lg z-50 py-2">
                <div className="px-4 py-3 border-b border-outline-variant">
                  <span className="block text-[14px] font-medium text-on-surface">
                    {user?.name || "User"}
                  </span>
                  <span className="text-[12px] text-on-surface-variant">{user?.email}</span>
                </div>
                <Link
                  to="/user/orders"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-[14px] text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors"
                  style={{ fontFamily: "Inter" }}
                >
                  <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                  Order History
                </Link>
                <a
                  href="#settings"
                  className="flex items-center gap-3 px-4 py-2 text-[14px] text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors"
                  style={{ fontFamily: "Inter" }}
                >
                  <span className="material-symbols-outlined text-[18px]">settings</span>
                  Settings
                </a>
                <a
                  href="#support"
                  className="flex items-center gap-3 px-4 py-2 text-[14px] text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors"
                  style={{ fontFamily: "Inter" }}
                >
                  <span className="material-symbols-outlined text-[18px]">support</span>
                  Support
                </a>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-[14px] text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors text-left"
                  style={{ fontFamily: "Inter" }}
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  Logout
                </button>
              </div>
            )}
          </div>
          <span className="text-[12px] text-on-surface-variant" style={{ fontFamily: "JetBrains Mono" }}>
            {user?.name || user?.email || ""}
          </span>
        </div>
      </header>

      <main className="mt-16 h-[calc(100vh-64px)] overflow-y-auto p-[24px] bg-surface-canvas">
        <Outlet context={{ setOrderModal }} />
      </main>

      {orderModal && (
        <OrderEntryModal
          market={orderModal.market}
          side={orderModal.side}
          open={true}
          onClose={() => setOrderModal(null)}
        />
      )}
    </div>
  );
}

export function useUserLayout() {
  return useOutletContext<{ setOrderModal: (m: { market: MarketDashboard; side: OrderSide } | null) => void }>();
}
