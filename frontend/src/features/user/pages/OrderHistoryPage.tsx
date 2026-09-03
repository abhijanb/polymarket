import { Link } from "react-router-dom";
import { OrderStatusPill } from "@/features/user/components/OrderStatusPill";
import { useOrderHistory } from "@/features/user/hooks/useOrderHistory";
import { emptyStates } from "@/features/user/model/userModel";
import { cn } from "@/shared/lib/utils";

export function OrderHistoryPage() {
  const { orders, isLoading, isUninitialized, error, refetch, count } = useOrderHistory();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h1
            className="text-[22px] font-semibold text-on-surface"
            style={{ fontFamily: "Inter" }}
          >
            Order History
          </h1>
          <span
            className="text-[12px] text-on-surface-variant tabular-nums"
            style={{ fontFamily: "JetBrains Mono" }}
          >
            {count > 0 ? `Showing ${count} order${count === 1 ? "" : "s"}` : "No orders to show"}
          </span>
        </div>
        <Link
          to="/user"
          className="px-4 py-2 bg-surface-container border border-outline-variant text-on-surface text-[13px] font-medium rounded-sm hover:bg-surface-container-low transition-colors"
          style={{ fontFamily: "JetBrains Mono" }}
        >
          ← Back to Terminal
        </Link>
      </div>

      <div className="terminal-bento grid">
        <div className="bento-card flex flex-col">
          <div className="flex justify-between items-end border-b border-outline-variant pb-3 mb-2">
            <h2
              className="text-[18px] font-semibold text-on-surface"
              style={{ fontFamily: "Inter" }}
            >
              Your Orders
            </h2>
            <div className="flex items-center gap-3">
              <span
                className="text-[10px] tracking-[0.05em] font-bold text-on-surface-variant uppercase tabular-nums"
                style={{ fontFamily: "JetBrains Mono" }}
              >
                {count} TOTAL
              </span>
              <button
                onClick={() => refetch()}
                className="p-1.5 rounded-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors"
                title="Refresh"
              >
                <span className="material-symbols-outlined text-[18px]">refresh</span>
              </button>
            </div>
          </div>

          {isLoading || isUninitialized ? (
            <div className="animate-pulse space-y-3 py-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-12 bg-surface-container-high rounded-sm" />
              ))}
            </div>
          ) : error ? (
            <div
              className="py-8 text-center text-error flex flex-col items-center gap-2"
              style={{ fontFamily: "Inter" }}
            >
              <span className="material-symbols-outlined text-[36px] text-error/70">
                error_outline
              </span>
              <span className="text-[14px] font-medium">Error loading orders</span>
              <button
                onClick={() => refetch()}
                className="text-[12px] text-primary hover:underline"
                style={{ fontFamily: "JetBrains Mono" }}
              >
                Retry
              </button>
            </div>
          ) : orders.length === 0 ? (
            <div className="empty-state py-10" role="status">
              <span className="material-symbols-outlined text-[44px] text-on-surface-variant/60">
                {emptyStates.orderHistory.icon}
              </span>
              <span className="text-[14px] font-semibold text-on-surface">
                {emptyStates.orderHistory.title}
              </span>
              <span className="text-[12px] text-on-surface-variant max-w-xs">
                {emptyStates.orderHistory.description}
              </span>
              {emptyStates.orderHistory.ctaTo && (
                <Link
                  to={emptyStates.orderHistory.ctaTo}
                  className="mt-1 text-[12px] font-medium text-primary hover:underline"
                  style={{ fontFamily: "JetBrains Mono" }}
                >
                  {emptyStates.orderHistory.ctaLabel}
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    {[
                      { key: "product", label: "PRODUCT", align: "left" as const },
                      { key: "side", label: "SIDE", align: "left" as const },
                      { key: "shares", label: "SHARES", align: "right" as const },
                      { key: "price", label: "PRICE/SHARE", align: "right" as const },
                      { key: "total", label: "TOTAL", align: "right" as const },
                      { key: "status", label: "STATUS", align: "left" as const },
                      { key: "time", label: "TIME", align: "left" as const },
                    ].map((h) => (
                      <th
                        key={h.key}
                        className={cn(
                          "text-[10px] tracking-[0.05em] font-bold text-on-surface-variant py-2 px-3",
                          h.align === "right" && "text-right"
                        )}
                        style={{ fontFamily: "JetBrains Mono" }}
                      >
                        {h.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-[13px]" style={{ fontFamily: "JetBrains Mono" }}>
                  {orders.map((o) => (
                    <tr key={o.id} className="data-table-row transition-colors duration-200">
                      <td className="py-3 px-3">
                        <span
                          className="text-on-surface font-medium"
                          style={{ fontFamily: "Inter" }}
                        >
                          {o.productName}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-sm text-[10px] font-bold",
                            o.isYes
                              ? "bg-primary/15 text-primary border border-primary/30"
                              : "bg-tertiary-container text-on-tertiary-container border border-tertiary-container"
                          )}
                        >
                          {o.outcome}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right text-on-surface tabular-nums">
                        {o.sharesDisplay}
                      </td>
                      <td className="py-3 px-3 text-right text-on-surface tabular-nums">
                        {o.pricePerShareDisplay}
                      </td>
                      <td className="py-3 px-3 text-right text-on-surface font-bold tabular-nums">
                        {o.totalCostDisplay}
                      </td>
                      <td className="py-3 px-3">
                        <OrderStatusPill status={o.status} tone={o.statusTone} />
                      </td>
                      <td className="py-3 px-3 text-on-surface-variant text-[12px]">
                        <span title={o.time}>{o.timeRelative}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
