import { Link } from "react-router-dom";
import { useGetOrdersQuery } from "@/features/user/api/ordersApi";
import { cn, formatCurrency, formatNumber } from "@/shared/lib/utils";

const CATEGORY_COLORS: Record<string, string> = {
  Crypto: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Politics: "bg-red-500/20 text-red-400 border-red-500/30",
  Economics: "bg-green-500/20 text-green-400 border-green-500/30",
  Sports: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Science: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

export function OrderHistoryPage() {
  const { data: orders, isLoading, error, refetch } = useGetOrdersQuery();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-[20px] font-semibold text-on-surface" style={{ fontFamily: "Inter" }}>
          Order History
        </h1>
        <Link
          to="/user"
          className="px-4 py-2 bg-surface-container border border-outline-variant text-on-surface text-[14px] font-medium rounded-sm hover:bg-surface-container-low transition-colors"
          style={{ fontFamily: "JetBrains Mono" }}
        >
          ← Back to Markets
        </Link>
      </div>

      <div className="terminal-bento grid">
        <div className="bento-card flex flex-col">
          <div className="flex justify-between items-end border-b border-outline-variant pb-2 mb-4">
            <h2 className="text-[20px] font-semibold text-on-surface" style={{ fontFamily: "Inter" }}>
              Your Orders
            </h2>
            <div className="flex items-center gap-3">
              <span
                className="text-[10px] tracking-[0.05em] font-bold text-on-surface-variant uppercase"
                style={{ fontFamily: "JetBrains Mono" }}
              >
                {orders?.length ?? 0} TOTAL
              </span>
              <button
                onClick={() => refetch()}
                className="p-1 rounded-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors"
                title="Refresh"
              >
                <span className="material-symbols-outlined text-[18px]">refresh</span>
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="animate-pulse space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-12 bg-surface-container-high rounded-sm" />
              ))}
            </div>
          ) : error ? (
            <div className="py-8 text-center text-error" style={{ fontFamily: "Inter" }}>
              Error loading orders
            </div>
          ) : !orders || orders.length === 0 ? (
            <div className="py-8 text-center text-on-surface-variant" style={{ fontFamily: "Inter" }}>
              No orders yet. Place a buy from the markets page to see it here.
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
                      className="text-[10px] tracking-[0.05em] font-bold text-on-surface-variant py-2"
                      style={{ fontFamily: "JetBrains Mono" }}
                    >
                      SIDE
                    </th>
                    <th
                      className="text-[10px] tracking-[0.05em] font-bold text-on-surface-variant py-2 text-right"
                      style={{ fontFamily: "JetBrains Mono" }}
                    >
                      SHARES
                    </th>
                    <th
                      className="text-[10px] tracking-[0.05em] font-bold text-on-surface-variant py-2 text-right"
                      style={{ fontFamily: "JetBrains Mono" }}
                    >
                      PRICE/SHARE
                    </th>
                    <th
                      className="text-[10px] tracking-[0.05em] font-bold text-on-surface-variant py-2 text-right"
                      style={{ fontFamily: "JetBrains Mono" }}
                    >
                      TOTAL
                    </th>
                    <th
                      className="text-[10px] tracking-[0.05em] font-bold text-on-surface-variant py-2"
                      style={{ fontFamily: "JetBrains Mono" }}
                    >
                      STATUS
                    </th>
                    <th
                      className="text-[10px] tracking-[0.05em] font-bold text-on-surface-variant py-2"
                      style={{ fontFamily: "JetBrains Mono" }}
                    >
                      TIME
                    </th>
                  </tr>
                </thead>
                <tbody className="text-[13px]" style={{ fontFamily: "JetBrains Mono" }}>
                  {orders.map((o) => {
                    const shares = Number(o.shares);
                    const totalUsd = Number(o.totalCostUsd);
                    const priceUsd = o.pricePerShareCents / 100;
                    const isYes = o.outcomeLabel === "YES";
                    return (
                      <tr key={o.id} className="data-table-row transition-colors duration-200">
                        <td className="py-3 pr-4">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-on-surface font-medium" style={{ fontFamily: "Inter" }}>
                              {o.market.title}
                            </span>
                            <span
                              className={cn(
                                "px-1.5 py-0.5 rounded-sm text-[9px] font-bold border w-fit",
                                CATEGORY_COLORS[o.market.category] || "bg-gray-500/20 text-gray-400 border-gray-500/30"
                              )}
                            >
                              {o.market.category.toUpperCase()}
                            </span>
                          </div>
                        </td>
                        <td className="py-3">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-sm text-[10px] font-bold",
                              isYes
                                ? "bg-primary/20 text-primary border border-primary/30"
                                : "bg-tertiary-container text-on-tertiary-container border border-tertiary-container"
                            )}
                          >
                            {o.outcomeLabel}
                          </span>
                        </td>
                        <td className="py-3 text-right text-on-surface">{formatNumber(shares)}</td>
                        <td className="py-3 text-right text-on-surface">{formatCurrency(priceUsd)}</td>
                        <td className="py-3 text-right text-on-surface font-bold">
                          {formatCurrency(totalUsd)}
                        </td>
                        <td className="py-3">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-sm text-[10px] font-bold",
                              o.status === "FILLED"
                                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                : o.status === "OPEN" || o.status === "PARTIAL"
                                ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                                : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                            )}
                          >
                            {o.status}
                          </span>
                        </td>
                        <td className="py-3 text-on-surface-variant text-[12px]">
                          {new Date(o.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
