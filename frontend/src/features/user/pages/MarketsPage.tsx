import { useGetActiveMarketsQuery } from "@/features/user/api/marketsApi";
import { usePlaceOrderMutation } from "@/features/user/api/ordersApi";
import { useState } from "react";
import { cn } from "@/shared/lib/utils";
import { PlaceOrderModal } from "@/features/user/components/PlaceOrderModal";

const CATEGORY_COLORS: Record<string, string> = {
  Crypto: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Politics: "bg-red-500/20 text-red-400 border-red-500/30",
  Economics: "bg-green-500/20 text-green-400 border-green-500/30",
  Sports: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Science: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-green-500/20 text-green-400 border-green-500/30",
  DRAFT: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  RESOLVED: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  CLOSED: "bg-red-500/20 text-red-400 border-red-500/30",
};

function stripCategory(description: string): string {
  return description.replace(/^\[[^\]]+\]\s*/, "");
}

function truncate(text: string, max = 180): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + "...";
}

export function MarketsPage() {
  const { data: markets = [], isLoading, isUninitialized, error, refetch } = useGetActiveMarketsQuery();
  const [selectedMarket, setSelectedMarket] = useState<(typeof markets)[number] | null>(null);

  const handleOrderSuccess = () => {
    refetch();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h1
            className="text-[22px] font-semibold text-on-surface"
            style={{ fontFamily: "Inter" }}
          >
            Markets
          </h1>
          <span
            className="text-[12px] text-on-surface-variant tabular-nums"
            style={{ fontFamily: "JetBrains Mono" }}
          >
            {markets.length > 0 ? `${markets.length} active market${markets.length === 1 ? "" : "s"}` : "No active markets"}
          </span>
        </div>
        <button
          onClick={() => refetch()}
          className="p-2 rounded-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors"
          title="Refresh"
        >
          <span className="material-symbols-outlined text-[18px]">refresh</span>
        </button>
      </div>

      {isLoading || isUninitialized ? (
        <div className="terminal-bento grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bento-card flex flex-col gap-3 animate-pulse">
              <div className="h-5 bg-surface-container-high rounded-sm w-3/4" />
              <div className="h-4 bg-surface-container-high rounded-sm w-1/2" />
              <div className="h-16 bg-surface-container-high rounded-sm w-full" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="terminal-bento grid">
          <div className="bento-card flex flex-col items-center justify-center gap-3 py-12">
            <span className="material-symbols-outlined text-[36px] text-error/70">error_outline</span>
            <span className="text-[14px] font-medium text-error" style={{ fontFamily: "Inter" }}>Error loading markets</span>
            <button
              onClick={() => refetch()}
              className="text-[12px] text-primary hover:underline"
              style={{ fontFamily: "JetBrains Mono" }}
            >
              Retry
            </button>
          </div>
        </div>
      ) : markets.length === 0 ? (
        <div className="terminal-bento grid">
          <div className="bento-card flex flex-col items-center justify-center gap-3 py-12">
            <span className="material-symbols-outlined text-[36px] text-on-surface-variant/60">search_off</span>
            <span className="text-[14px] font-semibold text-on-surface" style={{ fontFamily: "Inter" }}>No active markets</span>
            <span className="text-[12px] text-on-surface-variant max-w-xs text-center">
              There are no prediction markets available right now. Check back later.
            </span>
          </div>
        </div>
      ) : (
        <div className="terminal-bento grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {markets.map((m) => {
            const cleanDesc = stripCategory(m.description);
            const categoryColor = CATEGORY_COLORS[m.category] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
            const statusColor = STATUS_COLORS[m.status] || "bg-gray-500/20 text-gray-400 border-gray-500/30";

            return (
              <div key={m.id} className="bento-card flex flex-col gap-3 hover:bg-surface-container-high transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <h3
                    className="text-[14px] font-semibold text-on-surface leading-tight line-clamp-2"
                    style={{ fontFamily: "Inter" }}
                  >
                    {m.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={cn("px-2 py-0.5 rounded-sm text-[10px] font-bold border", categoryColor)}
                    style={{ fontFamily: "JetBrains Mono" }}
                  >
                    {m.category.toUpperCase()}
                  </span>
                  <span
                    className={cn("px-2 py-0.5 rounded-sm text-[10px] font-bold border", statusColor)}
                    style={{ fontFamily: "JetBrains Mono" }}
                  >
                    {m.status}
                  </span>
                </div>

                <p
                  className="text-[12px] text-on-surface-variant leading-relaxed line-clamp-3"
                  style={{ fontFamily: "Inter" }}
                >
                  {truncate(cleanDesc)}
                </p>

                <div className="mt-auto pt-2 flex items-center justify-between">
                  {m.outcome ? (
                    <span
                      className="text-[10px] tracking-wider font-bold uppercase"
                      style={{ fontFamily: "JetBrains Mono", color: m.outcome === "YES" ? "#4ade80" : "#f87171" }}
                    >
                      Resolved: {m.outcome}
                    </span>
                  ) : (
                    <span />
                  )}
                  {m.status === "ACTIVE" && !m.outcome && (
                    <button
                      onClick={() => setSelectedMarket(m)}
                      className="px-3 py-1.5 bg-primary text-on-primary text-[12px] font-bold rounded-sm hover:opacity-90 transition-opacity"
                      style={{ fontFamily: "JetBrains Mono" }}
                    >
                      PLACE ORDER
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <PlaceOrderModal
        key={selectedMarket?.id}
        open={!!selectedMarket}
        onClose={() => setSelectedMarket(null)}
        market={selectedMarket}
        onSuccess={handleOrderSuccess}
      />
    </div>
  );
}
