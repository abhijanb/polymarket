import { useGetMarketsQuery } from "@/features/admin/market/api/marketApi";
import type { Market } from "@/shared/types/market";

export function AdminHome() {
  const { data: markets = [], isLoading } = useGetMarketsQuery();
  const latestMarkets = [...markets]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  return (
    <>
      {/* 1. Header: Exchange Overview KPIs */}
      <section className="grid grid-cols-3 gap-4">
        <div className="bento-card flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">group</span>
            <span className="text-[10px] tracking-[0.05em] font-bold text-on-surface-variant uppercase" style={{ fontFamily: "JetBrains Mono" }}>
              Active Markets
            </span>
          </div>
          <span className="text-[32px] leading-[1.2] tracking-[-0.02em] font-bold text-on-surface" style={{ fontFamily: "Inter" }}>
            {markets.filter((m: Market) => m.status === "ACTIVE").length}
          </span>
          <div className="flex items-center gap-1 text-on-surface-variant text-[12px] font-medium" style={{ fontFamily: "JetBrains Mono" }}>
            <span>{markets.length} total</span>
          </div>
        </div>
        <div className="bento-card flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">new_releases</span>
            <span className="text-[10px] tracking-[0.05em] font-bold text-on-surface-variant uppercase" style={{ fontFamily: "JetBrains Mono" }}>
              New Markets
            </span>
          </div>
          <span className="text-[32px] leading-[1.2] tracking-[-0.02em] font-bold text-on-surface" style={{ fontFamily: "Inter" }}>
            {markets.filter((m: Market) => m.status === "DRAFT").length}
          </span>
          <div className="flex items-center gap-1 text-on-surface-variant text-[12px] font-medium" style={{ fontFamily: "JetBrains Mono" }}>
            <span>Pending launch</span>
          </div>
        </div>
        <div className="bento-card flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">task_alt</span>
            <span className="text-[10px] tracking-[0.05em] font-bold text-on-surface-variant uppercase" style={{ fontFamily: "JetBrains Mono" }}>
              Resolved
            </span>
          </div>
          <span className="text-[32px] leading-[1.2] tracking-[-0.02em] font-bold text-on-surface" style={{ fontFamily: "Inter" }}>
            {markets.filter((m: Market) => m.status === "RESOLVED").length}
          </span>
          <div className="flex items-center gap-1 text-on-surface-variant text-[12px] font-medium" style={{ fontFamily: "JetBrains Mono" }}>
            <span>Completed</span>
          </div>
        </div>
      </section>

      {/* Main Content Area: Bento Grid */}
      <section className="terminal-bento grid grid-cols-12 flex-1">
        {/* Left/Center Column (8 col span): Market Resolution & Orders */}
        <div className="col-span-8 flex flex-col gap-px bg-[#E2E8F0]">
          {/* 2. Latest Markets */}
          <div className="bento-card flex-1 flex flex-col">
            <div className="flex justify-between items-end border-b border-outline-variant pb-2 mb-4">
              <h2 className="text-[20px] leading-[1.4] font-semibold text-on-surface" style={{ fontFamily: "Inter" }}>
                Latest Markets
              </h2>
              <span className="text-[10px] tracking-[0.05em] font-bold text-on-surface-variant" style={{ fontFamily: "JetBrains Mono" }}>
                MOST RECENTLY CREATED
              </span>
            </div>
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center text-on-surface-variant">Loading markets...</div>
              ) : latestMarkets.length === 0 ? (
                <div className="p-4 text-center text-on-surface-variant">No markets yet. Create one to get started.</div>
              ) : (
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
                      <th className="text-[10px] tracking-[0.05em] font-bold text-on-surface-variant py-2 font-normal" style={{ fontFamily: "JetBrains Mono" }}>
                        CREATED
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-[12px]" style={{ fontFamily: "JetBrains Mono" }}>
                    {latestMarkets.map((market: Market) => (
                      <tr key={market.id} className="data-table-row hover:bg-surface-container-high transition-colors">
                        <td className="py-3 text-on-surface">{market.title}</td>
                        <td className="py-3 text-on-surface-variant">{market.category}</td>
                        <td className="py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-bold border ${
                            market.status === "ACTIVE" ? "bg-secondary/20 text-secondary border-secondary/30" :
                            market.status === "DRAFT" ? "bg-surface-container-high text-on-surface-variant border-outline-variant" :
                            market.status === "RESOLVED" ? "bg-primary/20 text-primary border-primary/30" :
                            "bg-tertiary/20 text-tertiary border-tertiary/30"
                          }`} style={{ fontFamily: "JetBrains Mono" }}>
                            {market.status}
                          </span>
                        </td>
                        <td className="py-3 text-on-surface-variant">
                          {new Date(market.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* 5. Recent Markets */}
          <div className="bento-card h-[300px] flex flex-col">
            <div className="flex justify-between items-end border-b border-outline-variant pb-2 mb-4">
              <h2 className="text-[20px] leading-[1.4] font-semibold text-on-surface" style={{ fontFamily: "Inter" }}>
                Recent Markets
              </h2>
              <span className="text-[10px] tracking-[0.05em] font-bold text-on-surface-variant" style={{ fontFamily: "JetBrains Mono" }}>
                LATEST 5
              </span>
            </div>
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center text-on-surface-variant">Loading...</div>
              ) : latestMarkets.length === 0 ? (
                <div className="p-4 text-center text-on-surface-variant">No markets yet</div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="text-[10px] tracking-[0.05em] font-bold text-on-surface-variant py-2 font-normal w-1/2" style={{ fontFamily: "JetBrains Mono" }}>
                        TITLE
                      </th>
                      <th className="text-[10px] tracking-[0.05em] font-bold text-on-surface-variant py-2 font-normal" style={{ fontFamily: "JetBrains Mono" }}>
                        STATUS
                      </th>
                      <th className="text-[10px] tracking-[0.05em] font-bold text-on-surface-variant py-2 font-normal text-right" style={{ fontFamily: "JetBrains Mono" }}>
                        CREATED
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-[12px]" style={{ fontFamily: "JetBrains Mono" }}>
                    {latestMarkets.slice(0, 5).map((market: Market) => (
                      <tr key={market.id} className="data-table-row hover:bg-surface-container-high transition-colors">
                        <td className="py-2.5 text-on-surface">{market.title}</td>
                        <td className="py-2.5">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-bold border ${
                            market.status === "ACTIVE" ? "bg-secondary/20 text-secondary border-secondary/30" :
                            market.status === "DRAFT" ? "bg-surface-container-high text-on-surface-variant border-outline-variant" :
                            market.status === "RESOLVED" ? "bg-primary/20 text-primary border-primary/30" :
                            "bg-tertiary/20 text-tertiary border-tertiary/30"
                          }`} style={{ fontFamily: "JetBrains Mono" }}>
                            {market.status}
                          </span>
                        </td>
                        <td className="py-2.5 text-on-surface-variant text-right">
                          {new Date(market.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Market Breakdown */}
        <div className="col-span-4">
          <div className="bento-card flex flex-col">
            <div className="flex justify-between items-end border-b border-outline-variant pb-2 mb-4">
              <h2 className="text-[20px] leading-[1.4] font-semibold text-on-surface" style={{ fontFamily: "Inter" }}>
                Market Breakdown
              </h2>
              <span className="text-[10px] tracking-[0.05em] font-bold text-on-surface-variant" style={{ fontFamily: "JetBrains Mono" }}>
                BY CATEGORY
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {["Crypto", "Politics", "Economics", "Sports", "Science"].map((cat) => {
                const count = markets.filter((m: Market) => m.category === cat).length;
                const pct = markets.length > 0 ? Math.round((count / markets.length) * 100) : 0;
                return (
                  <div key={cat} className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-[12px]" style={{ fontFamily: "JetBrains Mono" }}>
                      <span className="text-on-surface-variant font-medium">{cat}</span>
                      <span className="text-on-surface font-bold">{count} <span className="text-on-surface-variant font-normal">({pct}%)</span></span>
                    </div>
                    <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-auto pt-4 border-t border-outline-variant">
              <span className="text-[10px] tracking-[0.05em] font-bold text-on-surface-variant" style={{ fontFamily: "JetBrains Mono" }}>
                TOTAL MARKETS: <span className="text-on-surface font-bold">{markets.length}</span>
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
