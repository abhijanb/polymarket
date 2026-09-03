import { Link } from "react-router-dom";
import { cn } from "@/shared/lib/utils";
import { emptyStates, type PortfolioVm } from "@/features/user/model/userModel";
import { PortfolioCardSkeleton } from "./Skeletons";

const dayChangeColor = {
  up: "text-green-600",
  down: "text-red-500",
  flat: "text-on-surface-variant",
} as const;

const dayChangeIcon = {
  up: "trending_up",
  down: "trending_down",
  flat: "trending_flat",
} as const;

const dayChangePrefix = {
  up: "+",
  down: "−",
  flat: "",
} as const;

export function PortfolioCard({
  portfolio,
  isLoading,
  isUninitialized,
  onRetry,
}: {
  portfolio: PortfolioVm | null;
  isLoading: boolean;
  isUninitialized: boolean;
  onRetry?: () => void;
}) {
  if (isLoading || isUninitialized) return <PortfolioCardSkeleton />;

  if (!portfolio) {
    const empty = emptyStates.portfolio;
    return (
      <div className="bento-card empty-state" role="status">
        <span className="material-symbols-outlined text-[40px] text-on-surface-variant/60">
          {empty.icon}
        </span>
        <span className="text-[14px] font-semibold text-on-surface">{empty.title}</span>
        <span className="text-[12px] text-on-surface-variant max-w-xs">{empty.description}</span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-1 text-[12px] text-primary hover:underline"
            style={{ fontFamily: "JetBrains Mono" }}
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bento-card flex flex-col gap-3">
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
        className="text-[44px] font-bold text-on-surface leading-[1.1] tabular-nums"
        style={{ fontFamily: "Hanken Grotesk" }}
      >
        {portfolio.totalValueDisplay}
      </span>

      <div
        className={cn(
          "flex items-center gap-1 text-[14px] font-medium",
          dayChangeColor[portfolio.dayChangeTone]
        )}
        style={{ fontFamily: "JetBrains Mono" }}
      >
        <span className="material-symbols-outlined text-[16px]">
          {dayChangeIcon[portfolio.dayChangeTone]}
        </span>
        <span>
          {dayChangePrefix[portfolio.dayChangeTone]}
          {portfolio.dayChangeDisplay}
        </span>
        <span className="text-on-surface-variant font-normal">
          ({portfolio.dayChangePct.toFixed(2)}%)
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-outline-variant">
        <div className="flex flex-col gap-0.5">
          <span
            className="text-[10px] tracking-[0.05em] font-bold text-on-surface-variant uppercase"
            style={{ fontFamily: "JetBrains Mono" }}
          >
            Available Cash
          </span>
          <span
            className="text-[22px] font-bold text-on-surface tabular-nums"
            style={{ fontFamily: "Hanken Grotesk" }}
          >
            {portfolio.availableCashDisplay}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span
            className="text-[10px] tracking-[0.05em] font-bold text-on-surface-variant uppercase"
            style={{ fontFamily: "JetBrains Mono" }}
          >
            Positions
          </span>
          <span
            className="text-[22px] font-bold text-on-surface"
            style={{ fontFamily: "Hanken Grotesk" }}
          >
            —
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <Link
          to="/user/orders"
          className="text-[12px] font-medium text-primary hover:underline"
          style={{ fontFamily: "JetBrains Mono" }}
        >
          View order history →
        </Link>
      </div>
    </div>
  );
}
