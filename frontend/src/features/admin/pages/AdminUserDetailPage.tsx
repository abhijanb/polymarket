import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useGetUserOrdersQuery, useGetUsersQuery } from "@/features/admin/api/userApi";
import { OrderResultPill, OrderStatusPill } from "@/features/user/components/OrderStatusPill";
import {
  toRecentOrderList,
  emptyStates,
  type RecentOrderVm,
} from "@/features/user/model/userModel";
import { cn, formatCurrency } from "@/shared/lib/utils";

interface Summary {
  total: number;
  wins: number;
  losses: number;
  pending: number;
  void: number;
  totalStakeCents: number;
}

function summarize(orders: RecentOrderVm[]): Summary {
  const acc: Summary = {
    total: orders.length,
    wins: 0,
    losses: 0,
    pending: 0,
    void: 0,
    totalStakeCents: 0,
  };
  for (const o of orders) {
    if (o.result === "WIN") acc.wins++;
    else if (o.result === "LOSS") acc.losses++;
    else if (o.result === "PENDING") acc.pending++;
    else acc.void++;
  }
  return acc;
}

export function AdminUserDetailPage() {
  const { id = "" } = useParams<{ id: string }>();
  const { data: users = [] } = useGetUsersQuery();
  const { data: orders, isLoading, error, refetch } = useGetUserOrdersQuery(id);

  const user = useMemo(() => users.find((u) => u.id === id) ?? null, [users, id]);
  const items = useMemo(() => toRecentOrderList(orders ?? []), [orders]);
  const summary = useMemo(() => summarize(items), [items]);
  const embeddedUser = (orders as any[] | undefined)?.[0]?.user as
    | { id: string; email: string; name: string | null; role: string }
    | undefined;
  const display = user ?? (embeddedUser && embeddedUser.id === id ? embeddedUser : null);

  return (
    <div className="flex flex-col gap-4 max-w-[1100px]">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-0.5">
          <Link
            to="/admin/users"
            className="text-primary text-[12px] hover:underline w-fit"
            style={{ fontFamily: "JetBrains Mono" }}
          >
            ← Back to Users
          </Link>
          {display ? (
            <div className="flex items-baseline gap-2">
              <h1
                className="text-[22px] font-semibold text-on-surface"
                style={{ fontFamily: "Inter" }}
              >
                {display.name || display.email}
              </h1>
              <span
                className="text-[12px] text-on-surface-variant"
                style={{ fontFamily: "JetBrains Mono" }}
              >
                {display.email}
              </span>
              <span
                className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-bold border",
                  display.role === "ADMIN"
                    ? "bg-primary/20 text-primary border-primary/30"
                    : "bg-secondary/20 text-secondary border-secondary/30"
                )}
                style={{ fontFamily: "JetBrains Mono" }}
              >
                {display.role}
              </span>
            </div>
          ) : (
            <h1
              className="text-[22px] font-semibold text-on-surface"
              style={{ fontFamily: "Inter" }}
            >
              User detail
            </h1>
          )}
          {user?.createdAt && (
            <span
              className="text-[12px] text-on-surface-variant"
              style={{ fontFamily: "JetBrains Mono" }}
            >
              Joined {new Date(user.createdAt).toLocaleDateString()}
            </span>
          )}
        </div>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-surface-container border border-outline-variant text-on-surface text-[13px] font-medium rounded-sm hover:bg-surface-container-low transition-colors"
          style={{ fontFamily: "JetBrains Mono" }}
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <KpiCard label="Total Orders" value={summary.total} />
        <KpiCard label="Wins" value={summary.wins} tone="win" />
        <KpiCard label="Losses" value={summary.losses} tone="loss" />
        <KpiCard label="Pending" value={summary.pending} tone="pending" />
        <KpiCard
          label="Total Stake"
          value={formatCurrency(summary.totalStakeCents / 100)}
          isText
        />
      </div>

      <div className="terminal-bento grid">
        <div className="bento-card flex flex-col">
          <div className="flex justify-between items-end border-b border-outline-variant pb-3 mb-2">
            <h2
              className="text-[18px] font-semibold text-on-surface"
              style={{ fontFamily: "Inter" }}
            >
              Orders
            </h2>
            <span
              className="text-[10px] tracking-[0.05em] font-bold text-on-surface-variant uppercase tabular-nums"
              style={{ fontFamily: "JetBrains Mono" }}
            >
              {summary.total} TOTAL
            </span>
          </div>

          {isLoading ? (
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
          ) : items.length === 0 ? (
            <div className="empty-state py-10" role="status">
              <span className="material-symbols-outlined text-[44px] text-on-surface-variant/60">
                {emptyStates.orderHistory.icon}
              </span>
              <span className="text-[14px] font-semibold text-on-surface">
                No orders yet
              </span>
              <span className="text-[12px] text-on-surface-variant max-w-xs">
                This user has not placed any orders.
              </span>
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
                      { key: "result", label: "RESULT", align: "left" as const },
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
                  {items.map((o) => (
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
                        <OrderResultPill
                          result={o.result}
                          tone={o.resultTone}
                          label={o.resultLabel}
                        />
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

function KpiCard({
  label,
  value,
  tone,
  isText,
}: {
  label: string;
  value: number | string;
  tone?: "win" | "loss" | "pending";
  isText?: boolean;
}) {
  const toneColor =
    tone === "win"
      ? "text-green-600"
      : tone === "loss"
      ? "text-red-500"
      : tone === "pending"
      ? "text-amber-600"
      : "text-on-surface";
  return (
    <div className="bento-card flex flex-col gap-1">
      <span
        className="text-[10px] tracking-[0.05em] font-bold text-on-surface-variant uppercase"
        style={{ fontFamily: "JetBrains Mono" }}
      >
        {label}
      </span>
      <span
        className={cn(
          isText ? "text-[20px]" : "text-[28px]",
          "font-bold leading-[1.1] tabular-nums",
          toneColor
        )}
        style={{ fontFamily: "Hanken Grotesk" }}
      >
        {value}
      </span>
    </div>
  );
}
