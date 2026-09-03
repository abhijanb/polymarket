import { Link } from "react-router-dom";
import { cn } from "@/shared/lib/utils";
import { emptyStates, type RecentOrderVm } from "@/features/user/model/userModel";
import { OrderStatusPill } from "./OrderStatusPill";
import { RecentActivitySkeleton } from "./Skeletons";

export function RecentActivityList({
  items,
  isLoading,
  isUninitialized,
  totalCount,
  limit = 5,
  onRetry,
}: {
  items: RecentOrderVm[];
  isLoading: boolean;
  isUninitialized: boolean;
  totalCount?: number;
  limit?: number;
  onRetry?: () => void;
}) {
  if (isLoading || isUninitialized) {
    return <RecentActivitySkeleton rows={limit} />;
  }

  if (items.length === 0) {
    const empty = emptyStates.recentActivity;
    return (
      <div className="bento-card flex flex-col" role="status">
        <div className="flex items-center justify-between border-b border-outline-variant pb-3 mb-2">
          <span
            className="text-[10px] tracking-[0.05em] font-bold text-on-surface-variant uppercase"
            style={{ fontFamily: "JetBrains Mono" }}
          >
            Recent Activity
          </span>
          <span
            className="text-[10px] tracking-[0.05em] font-bold text-on-surface-variant uppercase tabular-nums"
            style={{ fontFamily: "JetBrains Mono" }}
          >
            0 TOTAL
          </span>
        </div>
        <div className="empty-state py-10">
          <span className="material-symbols-outlined text-[40px] text-on-surface-variant/60">
            {empty.icon}
          </span>
          <span className="text-[14px] font-semibold text-on-surface">{empty.title}</span>
          <span className="text-[12px] text-on-surface-variant max-w-xs">{empty.description}</span>
          {empty.ctaTo && (
            <Link
              to={empty.ctaTo}
              className="mt-1 text-[12px] font-medium text-primary hover:underline"
              style={{ fontFamily: "JetBrains Mono" }}
            >
              {empty.ctaLabel}
            </Link>
          )}
        </div>
      </div>
    );
  }

  const shown = totalCount ?? items.length;
  const more = totalCount !== undefined && totalCount > items.length;

  return (
    <div className="bento-card flex flex-col">
      <div className="flex items-center justify-between border-b border-outline-variant pb-3 mb-1">
        <span
          className="text-[10px] tracking-[0.05em] font-bold text-on-surface-variant uppercase"
          style={{ fontFamily: "JetBrains Mono" }}
        >
          Recent Activity
        </span>
        <span
          className="text-[10px] tracking-[0.05em] font-bold text-on-surface-variant uppercase tabular-nums"
          style={{ fontFamily: "JetBrains Mono" }}
        >
          {shown} TOTAL
        </span>
      </div>

      <ul className="flex flex-col">
        {items.map((o, i) => (
          <li
            key={o.id}
            className={cn(
              "flex items-center gap-3 py-3",
              i < items.length - 1 && "border-b border-outline-variant"
            )}
          >
            <span
              className={cn(
                "h-8 w-8 rounded-sm grid place-items-center text-[12px] font-bold",
                o.isYes
                  ? "bg-primary/15 text-primary"
                  : "bg-tertiary-container text-on-tertiary-container"
              )}
              style={{ fontFamily: "JetBrains Mono" }}
            >
              {o.outcome}
            </span>
            <div className="flex-1 min-w-0 flex flex-col">
              <span
                className="text-[13px] font-medium text-on-surface truncate"
                style={{ fontFamily: "Inter" }}
                title={o.productName}
              >
                {o.productName}
              </span>
              <span
                className="text-[11px] text-on-surface-variant"
                style={{ fontFamily: "JetBrains Mono" }}
              >
                {o.sharesDisplay} sh · {o.pricePerShareDisplay} · {o.timeRelative}
              </span>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span
                className="text-[13px] font-bold text-on-surface tabular-nums"
                style={{ fontFamily: "JetBrains Mono" }}
              >
                {o.totalCostDisplay}
              </span>
              <OrderStatusPill status={o.status} tone={o.statusTone} />
            </div>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between mt-2 pt-3 border-t border-outline-variant">
        {more ? (
          <Link
            to="/user/orders"
            className="text-[12px] font-medium text-primary hover:underline"
            style={{ fontFamily: "JetBrains Mono" }}
          >
            View all orders →
          </Link>
        ) : (
          <span />
        )}
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-[12px] text-on-surface-variant hover:text-on-surface"
            style={{ fontFamily: "JetBrains Mono" }}
          >
            Refresh
          </button>
        )}
      </div>
    </div>
  );
}
