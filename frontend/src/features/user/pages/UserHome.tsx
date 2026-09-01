import { useState, useRef, useEffect } from "react";
import { useAppSelector } from "@/shared/store/hooks";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { cn, formatCurrency, formatNumber } from "@/shared/lib/utils";
import { useGetDashboardMarketsQuery, useGetPortfolioSummaryQuery } from "@/features/user/api/dashboardApi";
import { transformMarketToDashboard, type MarketDashboard } from "@/features/user/model/dashboardTypes";
import { featuredMarket as fallbackFeatured, portfolioSummary as fallbackPortfolio } from "@/features/user/model/dashboardData";
import { useDashboardFilters, type SortKey } from "@/features/user/hooks/useDashboardFilters";
import { OrderEntryModal } from "@/features/user/components/OrderEntryModal";
import type { OrderSide } from "@/features/user/api/ordersApi";

export function UserHome() {
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

  const { data: marketsData, isLoading: marketsLoading } = useGetDashboardMarketsQuery(undefined, {
    pollingInterval: 30000,
    skip: false,
  });
  const { data: portfolioData, isLoading: portfolioLoading } = useGetPortfolioSummaryQuery();

  const markets: MarketDashboard[] = marketsData?.map(transformMarketToDashboard) ?? [];
  const portfolio = portfolioData ?? fallbackPortfolio;

  const {
    searchTerm,
    setSearchTerm,
    sortBy,
    sortDir,
    handleSort,
    processedMarkets,
  } = useDashboardFilters({ markets });

  const featuredMarket =
    markets.length > 0
      ? markets.reduce((max, m) => (m.volume24h > max.volume24h ? m : max))
      : fallbackFeatured;

  return (
    <div className="h-screen overflow-hidden bg-surface-canvas font-sans">
      <header className="fixed top-0 left-0 right-0 h-16 bg-surface border-b border-outline-variant z-50 flex items-center px-[24px]">
        <div className="flex items-center gap-8 flex-1">
          <span
            className="text-primary font-bold text-[18px] tracking-tight uppercase"
            style={{ fontFamily: "JetBrains Mono" }}
          >
            PREDICTX
          </span>
          <div className="relative">
            <input
              type="text"
              placeholder="Search markets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[240px] pl-10 pr-4 py-2 bg-surface-container-high rounded-sm text-[14px] text-on-surface placeholder-text-slate focus:outline-none focus:ring-1 focus:ring-primary"
              style={{ fontFamily: "Inter" }}
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[18px]">
              search
            </span>
          </div>
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
        {/* Featured Market + Portfolio */}
        <section className="terminal-bento grid grid-cols-12 mb-6">
          {/* Featured Market Hero */}
          <div className="col-span-8 pane flex flex-col gap-4">
            {marketsLoading ? (
              <div className="animate-pulse flex flex-col gap-3 flex-1">
                <div className="h-5 w-40 bg-surface-container-high rounded-sm" />
                <div className="h-8 w-3/4 bg-surface-container-high rounded-sm" />
                <div className="h-4 w-1/2 bg-surface-container-high rounded-sm mt-2" />
                <div className="h-4 w-1/4 bg-surface-container-high rounded-sm" />
                <div className="h-6 w-1/4 bg-surface-container-high rounded-sm mt-4" />
                <div className="h-[60px] w-full bg-surface-container-high rounded-sm" />
                <div className="flex gap-3 mt-4">
                  <div className="h-10 flex-1 bg-surface-container-high rounded-sm" />
                  <div className="h-10 flex-1 bg-surface-container-high rounded-sm" />
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4">
                  <span
                    className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-sm"
                    style={{ fontFamily: "JetBrains Mono" }}
                  >
                    {featuredMarket.category}
                  </span>
                  <span className="text-[12px] text-on-surface-variant" style={{ fontFamily: "JetBrains Mono" }}>
                    Ends {featuredMarket.endsAt}
                  </span>
                </div>
                <h1
                  className="text-[32px] font-semibold text-on-surface leading-[1.25]"
                  style={{ fontFamily: "Hanken Grotesk" }}
                >
                  {featuredMarket.title}
                </h1>
                <div
                  className="flex items-center gap-6 text-[14px] text-on-surface-variant"
                  style={{ fontFamily: "JetBrains Mono" }}
                >
                  <span>Vol 24h: {formatNumber(featuredMarket.volume24h)}</span>
                  <span>Liquidity: {formatNumber(featuredMarket.liquidity)}</span>
                </div>
                <div className="flex items-end gap-4 mt-2">
                  <div className="flex items-baseline gap-1">
                    <span
                      className="text-[40px] font-bold text-on-surface"
                      style={{ fontFamily: "Hanken Grotesk" }}
                    >
                      {featuredMarket.probability}%
                    </span>
                    <span className="text-[12px] text-on-surface-variant mb-2" style={{ fontFamily: "JetBrains Mono" }}>
                      YES
                    </span>
                  </div>
                  <div className="h-[60px] flex-1 flex items-end gap-0.5">
                    {[30, 35, 50, 45, 60, 55, 70, 65, 40, 55, 75, 60, 80, 70, 65, 85, 75, 55, 50, 60].map((h, i) => (
                      <div
                        key={i}
                        className="w-1 bg-primary/60 rounded-t-sm"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => setOrderModal({ market: featuredMarket, side: "YES" })}
                    className="flex-1 bg-primary text-on-primary font-bold py-2.5 rounded-sm hover:opacity-90 active:opacity-80 transition-all"
                    style={{ fontFamily: "Inter" }}
                  >
                    Buy YES
                  </button>
                  <button
                    onClick={() => setOrderModal({ market: featuredMarket, side: "NO" })}
                    className="flex-1 bg-surface-container border border-outline-variant text-on-surface font-bold py-2.5 rounded-sm hover:bg-surface-container-low transition-all"
                    style={{ fontFamily: "Inter" }}
                  >
                    Buy NO
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Portfolio Overview */}
          <div className="col-span-4 pane flex flex-col gap-4">
            {portfolioLoading ? (
              <div className="animate-pulse flex flex-col gap-3 flex-1">
                <div className="h-5 w-32 bg-surface-container-high rounded-sm" />
                <div className="h-10 w-3/4 bg-surface-container-high rounded-sm" />
                <div className="h-4 w-1/2 bg-surface-container-high rounded-sm" />
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="h-16 bg-surface-container-high rounded-sm" />
                  <div className="h-16 bg-surface-container-high rounded-sm" />
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
                    account_balance_wallet
                  </span>
                  <span
                    className="text-[10px] tracking-[0.05em] font-bold text-on-surface-variant uppercase"
                    style={{ fontFamily: "JetBrains Mono" }}
                  >
                    Portfolio Value
                  </span>
                </div>
                <span
                  className="text-[40px] font-bold text-on-surface leading-[1.2]"
                  style={{ fontFamily: "Hanken Grotesk" }}
                >
                  {formatCurrency(portfolio.totalValue)}
                </span>
                <div
                  className="flex items-center gap-1 text-[14px] font-medium text-secondary"
                  style={{ fontFamily: "JetBrains Mono" }}
                >
                  <span className="material-symbols-outlined text-[16px]">trending_up</span>
                  <span>+{formatCurrency(portfolio.dayChange)}</span>
                  <span className="text-on-surface-variant font-normal">
                    ({portfolio.dayChangePct}%)
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <span className="text-[12px] text-on-surface-variant block" style={{ fontFamily: "JetBrains Mono" }}>
                      Active Positions
                    </span>
                    <span className="text-[20px] font-bold text-on-surface" style={{ fontFamily: "Hanken Grotesk" }}>
                      {portfolio.activePositions}
                    </span>
                  </div>
                  <div>
                    <span className="text-[12px] text-on-surface-variant block" style={{ fontFamily: "JetBrains Mono" }}>
                      Available Cash
                    </span>
                    <span className="text-[20px] font-bold text-on-surface" style={{ fontFamily: "Hanken Grotesk" }}>
                      {formatCurrency(portfolio.availableCash)}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Active Markets Table */}
        <section className="pane">
          <div className="flex justify-between items-end border-b border-outline-variant pb-2 mb-4">
            <h2 className="text-[20px] font-semibold text-on-surface" style={{ fontFamily: "Inter" }}>
              Active Markets
            </h2>
            <span
              className="text-[10px] tracking-[0.05em] font-bold text-on-surface-variant uppercase"
              style={{ fontFamily: "JetBrains Mono" }}
            >
              LIVE TRADING
            </span>
          </div>
          {marketsLoading ? (
            <div className="animate-pulse space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-14 bg-surface-container-high rounded-sm" />
              ))}
            </div>
          ) : processedMarkets.length === 0 ? (
            <div className="py-8 text-center text-on-surface-variant" style={{ fontFamily: "Inter" }}>
              No markets match your search or category filter. Try adjusting filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th
                      className="text-[10px] tracking-[0.05em] font-bold text-on-surface-variant py-2"
                      style={{ fontFamily: "JetBrains Mono" }}
                    >
                      MARKET
                    </th>
                    <th
                      onClick={() => handleSort("probability")}
                      className={cn(
                        "text-[10px] tracking-[0.05em] font-bold text-on-surface-variant py-2 cursor-pointer select-none",
                        "transition-colors hover:text-on-surface"
                      )}
                      style={{ fontFamily: "JetBrains Mono" }}
                    >
                      <div className="flex items-center gap-1">
                        PROBABILITY
                        {sortBy === "probability" && (
                          <span className="material-symbols-outlined text-[14px]">
                            {sortDir === "desc" ? "arrow_downward" : "arrow_upward"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("volume24h")}
                      className={cn(
                        "text-[10px] tracking-[0.05em] font-bold text-on-surface-variant py-2 cursor-pointer select-none",
                        "transition-colors hover:text-on-surface"
                      )}
                      style={{ fontFamily: "JetBrains Mono" }}
                    >
                      <div className="flex items-center gap-1">
                        24H VOL
                        {sortBy === "volume24h" && (
                          <span className="material-symbols-outlined text-[14px]">
                            {sortDir === "desc" ? "arrow_downward" : "arrow_upward"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      className="text-[10px] tracking-[0.05em] font-bold text-on-surface-variant py-2"
                      style={{ fontFamily: "JetBrains Mono" }}
                    >
                      QUICK TRADE
                    </th>
                  </tr>
                </thead>
                <tbody className="text-[14px]" style={{ fontFamily: "Inter" }}>
                  {processedMarkets.map((market) => (
                    <tr key={market.id} className="data-table-row transition-colors duration-200">
                      <td className="py-3">
                        <div className="flex flex-col">
                          <span className="font-medium text-on-surface">{market.title}</span>
                          <span className="text-[12px] text-on-surface-variant" style={{ fontFamily: "JetBrains Mono" }}>
                            {market.category} · {market.endsAt}
                          </span>
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="flex flex-col">
                          <span className="font-bold text-on-surface">{market.probability}%</span>
                          <div className="w-20 h-1.5 bg-surface-container-highest rounded-full overflow-hidden mt-1.5">
                            <div className="bg-primary h-full rounded-full transition-all duration-300" style={{ width: `${market.probability}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-on-surface-variant">
                        {formatNumber(market.volume24h)}
                      </td>
                      <td className="py-3">
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => setOrderModal({ market, side: "YES" })}
                            className="px-3 py-1 bg-secondary-container text-on-secondary-container text-[12px] font-bold rounded-sm hover:opacity-90 active:opacity-80 transition-all"
                            style={{ fontFamily: "JetBrains Mono" }}
                          >
                            Buy YES
                          </button>
                          <button
                            onClick={() => setOrderModal({ market, side: "NO" })}
                            className="px-3 py-1 bg-tertiary-container text-on-tertiary-container text-[12px] font-bold rounded-sm hover:opacity-90 active:opacity-80 transition-all"
                            style={{ fontFamily: "JetBrains Mono" }}
                          >
                            Buy NO
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
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
