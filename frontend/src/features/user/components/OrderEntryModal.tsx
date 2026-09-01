import { useState, useEffect } from "react";
import { usePlaceOrderMutation, type OrderSide } from "@/features/user/api/ordersApi";
import type { MarketDashboard } from "@/features/user/model/dashboardTypes";
import { cn, formatCurrency, formatNumber } from "@/shared/lib/utils";
import { useGetPortfolioSummaryQuery } from "@/features/user/api/dashboardApi";

interface OrderEntryModalProps {
  market: MarketDashboard;
  side: OrderSide;
  open: boolean;
  onClose: () => void;
}

export function OrderEntryModal({ market, side, open, onClose }: OrderEntryModalProps) {
  const [amountUsd, setAmountUsd] = useState<string>("5");
  const [placeOrder, { isLoading, error }] = usePlaceOrderMutation();
  const { data: portfolio } = useGetPortfolioSummaryQuery();

  useEffect(() => {
    if (open) {
      setAmountUsd("5");
    }
  }, [open, market.id, side]);

  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  const amount = Number(amountUsd) || 0;
  const probability = side === "YES" ? market.yesPrice : market.noPrice;
  const estimatedShares = probability > 0 ? amount / probability : 0;
  const availableCash = portfolio?.availableCash ?? 0;
  const insufficient = amount > availableCash;
  const errorMessage =
    error && "data" in error
      ? (error.data as { message?: string })?.message ?? "Failed to place order"
      : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || insufficient) return;
    try {
      await placeOrder({ marketId: market.id, side, amountUsd: amount }).unwrap();
      onClose();
    } catch {
      // error already in `error` from mutation
    }
  };

  const isYes = side === "YES";

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-[440px] max-w-[92vw] bg-surface border border-outline-variant rounded-sm shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between p-4 border-b border-outline-variant">
            <h3 className="text-[16px] font-semibold text-on-surface" style={{ fontFamily: "Inter" }}>
              Place Order
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div className="p-4 flex flex-col gap-4">
            <div>
              <span className="text-[10px] tracking-[0.05em] font-bold text-on-surface-variant uppercase" style={{ fontFamily: "JetBrains Mono" }}>
                Market
              </span>
              <p className="text-[14px] text-on-surface mt-1 line-clamp-2" style={{ fontFamily: "Inter" }}>
                {market.title}
              </p>
              <div className="flex items-center gap-2 mt-2 text-[12px] text-on-surface-variant" style={{ fontFamily: "JetBrains Mono" }}>
                <span className="px-2 py-0.5 bg-surface-container-high rounded-sm">{market.category}</span>
                <span>Ends {market.endsAt}</span>
              </div>
            </div>

            <div
              className={cn(
                "rounded-sm p-3 border",
                isYes ? "bg-primary/10 border-primary/30" : "bg-tertiary-container/20 border-tertiary-container"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] tracking-[0.05em] font-bold uppercase" style={{ fontFamily: "JetBrains Mono" }}>
                  Buying {side}
                </span>
                <span className="text-[20px] font-bold text-on-surface" style={{ fontFamily: "Hanken Grotesk" }}>
                  {(probability * 100).toFixed(1)}¢
                </span>
              </div>
            </div>

            <div>
              <label
                htmlFor="amountUsd"
                className="text-[10px] tracking-[0.05em] font-bold text-on-surface-variant uppercase block mb-1"
                style={{ fontFamily: "JetBrains Mono" }}
              >
                Amount (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[14px]">$</span>
                <input
                  id="amountUsd"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={amountUsd}
                  onChange={(e) => setAmountUsd(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 bg-surface-container-high rounded-sm text-[14px] text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                  style={{ fontFamily: "Inter" }}
                  autoFocus
                />
              </div>
              <div className="flex justify-between mt-1 text-[12px] text-on-surface-variant" style={{ fontFamily: "JetBrains Mono" }}>
                <span>Available: {formatCurrency(availableCash)}</span>
                {insufficient && <span className="text-error">Insufficient balance</span>}
              </div>
            </div>

            <div className="bg-surface-container rounded-sm p-3">
              <div className="flex items-center justify-between text-[13px]" style={{ fontFamily: "Inter" }}>
                <span className="text-on-surface-variant">Estimated shares</span>
                <span className="font-bold text-on-surface">{formatNumber(estimatedShares)}</span>
              </div>
            </div>

            {errorMessage && (
              <div className="text-[13px] text-error bg-error-container/30 rounded-sm p-2" style={{ fontFamily: "Inter" }}>
                {errorMessage}
              </div>
            )}
          </div>

          <div className="flex gap-2 p-4 border-t border-outline-variant">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-surface-container border border-outline-variant text-on-surface text-[14px] font-medium rounded-sm hover:bg-surface-container-low transition-colors"
              style={{ fontFamily: "Inter" }}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || amount <= 0 || insufficient}
              className={cn(
                "flex-1 px-4 py-2 text-[14px] font-bold rounded-sm transition-all uppercase tracking-wider",
                isYes
                  ? "bg-primary text-on-primary hover:opacity-90 active:opacity-80"
                  : "bg-tertiary-container text-on-tertiary-container hover:opacity-90 active:opacity-80",
                (isLoading || amount <= 0 || insufficient) && "opacity-50 cursor-not-allowed"
              )}
              style={{ fontFamily: "Inter" }}
            >
              {isLoading ? "Placing..." : `Buy ${side}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
