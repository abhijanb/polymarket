import { Link } from "react-router-dom";
import { useMarkets } from "../hooks/useMarkets";
import type { Market } from "@/shared/types/market";

const CATEGORY_COLORS: Record<string, string> = {
  Crypto: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Politics: "bg-red-500/20 text-red-400 border-red-500/30",
  Economics: "bg-green-500/20 text-green-400 border-green-500/30",
  Sports: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Science: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

export function MarketList() {
  const { markets, isLoading, error, refetch, deleteMarket } = useMarkets();

  if (isLoading) return <div className="p-4">Loading markets...</div>;
  if (error) return <div className="p-4 text-red-400">Error loading markets</div>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-[20px] font-semibold text-on-surface" style={{ fontFamily: "Inter" }}>
          Markets
        </h1>
        <Link
          to="/admin/markets/new"
          className="bg-primary text-on-primary px-4 py-2 rounded-sm text-[14px] font-bold hover:opacity-90"
          style={{ fontFamily: "JetBrains Mono" }}
        >
          NEW MARKET
        </Link>
      </div>

      <div className="terminal-bento grid">
        <div className="bento-card flex flex-col">
          <div className="flex justify-between items-end border-b border-outline-variant pb-2 mb-4">
            <h2 className="text-[20px] font-semibold text-on-surface" style={{ fontFamily: "Inter" }}>
              All Markets
            </h2>
            <span className="text-[10px] tracking-[0.05em] font-bold text-on-surface-variant" style={{ fontFamily: "JetBrains Mono" }}>
              {markets.length} TOTAL
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="text-[10px] tracking-[0.05em] font-bold text-on-surface-variant py-2 font-normal w-1/2" style={{ fontFamily: "JetBrains Mono" }}>
                    MARKET TITLE
                  </th>
                  <th className="text-[10px] tracking-[0.05em] font-bold text-on-surface-variant py-2 font-normal" style={{ fontFamily: "JetBrains Mono" }}>
                    CATEGORY
                  </th>
                  <th className="text-[10px] tracking-[0.05em] font-bold text-on-surface-variant py-2 font-normal" style={{ fontFamily: "JetBrains Mono" }}>
                    STATUS
                  </th>
                  <th className="text-[10px] tracking-[0.05em] font-bold text-on-surface-variant py-2 font-normal text-right pr-2" style={{ fontFamily: "JetBrains Mono" }}>
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody className="text-[12px]" style={{ fontFamily: "JetBrains Mono" }}>
                {markets.map((m: Market) => (
                  <tr key={m.id} className="data-table-row">
                    <td className="py-3 text-on-surface pr-4">{m.title}</td>
                    <td className="py-3 text-on-surface-variant">
                      <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold border ${CATEGORY_COLORS[m.category] || "bg-gray-500/20 text-gray-400 border-gray-500/30"}`} style={{ fontFamily: "JetBrains Mono" }}>
                        {m.category.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 text-on-surface-variant">{m.status}</td>
                    <td className="py-3 text-right pr-2 flex gap-2 justify-end">
                      <Link
                        to={`/admin/markets/${m.id}`}
                        className="bg-primary text-on-primary px-3 py-1 rounded-sm text-[10px] font-bold hover:opacity-90"
                        style={{ fontFamily: "JetBrains Mono" }}
                      >
                        VIEW
                      </Link>
                      <Link
                        to={`/admin/markets/${m.id}/edit`}
                        className="bg-surface-container-high border border-outline-variant text-on-surface px-3 py-1 rounded-sm text-[10px] font-bold hover:bg-surface-container-highest transition-colors"
                        style={{ fontFamily: "JetBrains Mono" }}
                      >
                        EDIT
                      </Link>
                      <button
                        onClick={() => deleteMarket(m.id)}
                        className="bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-sm text-[10px] font-bold hover:opacity-90"
                        style={{ fontFamily: "JetBrains Mono" }}
                      >
                        DELETE
                      </button>
                    </td>
                  </tr>
                ))}
                {markets.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-on-surface-variant">
                      No markets yet. Create one to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
