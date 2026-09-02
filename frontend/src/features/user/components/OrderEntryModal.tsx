import { useState, useEffect } from "react";
import { usePlaceOrderMutation, type OrderOutcome } from "@/features/user/api/ordersApi";
import { cn, formatCurrency, formatNumber } from "@/shared/lib/utils";
import { useGetPortfolioSummaryQuery } from "@/features/user/api/dashboardApi";

interface Product {
  id: string;
  name: string;
  description: string;
  status: string;
  outcomeTime?: string;
}

interface OrderEntryModalProps {
  product: Product;
  outcome: OrderOutcome;
  open: boolean;
  onClose: () => void;
}

export function OrderEntryModal({ product, outcome, open, onClose }: OrderEntryModalProps) {
  const [shares, setShares] = useState<string>("10");
  const [pricePerShareCents, setPricePerShareCents] = useState<string>("50.0");
  const [placeOrder, { isLoading, error }] = usePlaceOrderMutation();
  const { data: portfolio } = useGetPortfolioSummaryQuery();

  useEffect(() => {
    if (open) {
      setShares("10");
      setPricePerShareCents("50.0");
    }
  }, [open, product.id, outcome]);

  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  const sharesNum = Number(shares) || 0;
  const priceNum = Number(pricePerShareCents) || 0;
  const totalCost = (sharesNum * priceNum) / 100;
  const availableCash = portfolio?.availableCash ?? 0;
  const insufficient = totalCost > availableCash;
  const invalidPrice = priceNum < 0.1 || priceNum >= 100;
  const canSubmit = sharesNum > 0 && priceNum > 0 && !invalidPrice && !insufficient;

  const errorMessage =
    error && "data" in error
      ? (error.data as { message?: string })?.message ?? "Failed to place order"
      : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    try {
      await placeOrder({
        productId: product.id,
        outcome,
        shares: sharesNum,
        pricePerShareCents: priceNum,
      }).unwrap();
      onClose();
    } catch {
      // error already in `error` from mutation
    }
  };

  const isYes = outcome === "YES";

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
              <span className="text-[10px] tracking-[0.05em] font-bold text-on-surface-variant uppercase block mb-1" style={{ fontFamily: "JetBrains Mono" }}>
                Product
              </span>
              <p className="text-[14px] text-on-surface mt-1 line-clamp-2" style={{ fontFamily: "Inter" }}>
                {product.name}
              </p>
              <p className="text-[12px] text-on-surface-variant mt-1 line-clamp-2" style={{ fontFamily: "Inter" }}>
                {product.description}
              </p>
            </div>

            <div
              className={cn(
                "rounded-sm p-3 border",
                isYes ? "bg-primary/10 border-primary/30" : "bg-tertiary-container/20 border-tertiary-container"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] tracking-[0.05em] font-bold uppercase" style={{ fontFamily: "JetBrains Mono" }}>
                  Buying {outcome}
                </span>
                <span className="text-[12px] text-on-surface-variant" style={{ fontFamily: "JetBrains Mono" }}>
                  Price: {pricePerShareCents}¢
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="shares"
                  className="text-[10px] tracking-[0.05em] font-bold text-on-surface-variant uppercase block mb-1"
                  style={{ fontFamily: "JetBrains Mono" }}
                >
                  Shares
                </label>
                <input
                  id="shares"
                  type="number"
                  step="1"
                  min="1"
                  value={shares}
                  onChange={(e) => setShares(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-high rounded-sm text-[14px] text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                  style={{ fontFamily: "Inter" }}
                  autoFocus
                />
              </div>
              <div>
                <label
                  htmlFor="pricePerShareCents"
                  className="text-[10px] tracking-[0.05em] font-bold text-on-surface-variant uppercase block mb-1"
                  style={{ fontFamily: "JetBrains Mono" }}
                >
                  Price / share
                </label>
                <div className="relative">
                  <input
                    id="pricePerShareCents"
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="99.9"
                    value={pricePerShareCents}
                    onChange={(e) => setPricePerShareCents(e.target.value)}
                    className="w-full pl-3 pr-8 py-2 bg-surface-container-high rounded-sm text-[14px] text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                    style={{ fontFamily: "Inter" }}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[14px]">¢</span>
                </div>
              </div>
            </div>

            <div className="bg-surface-container rounded-sm p-3 flex flex-col gap-1">
              <div className="flex items-center justify-between text-[13px]" style={{ fontFamily: "Inter" }}>
                <span className="text-on-surface-variant">Total cost</span>
                <span className="font-bold text-on-surface text-[15px]">{formatCurrency(totalCost)}</span>
              </div>
              <div className="flex items-center justify-between text-[12px]" style={{ fontFamily: "JetBrains Mono" }}>
                <span className="text-on-surface-variant">Available</span>
                <span className="text-on-surface">{formatCurrency(availableCash)}</span>
              </div>
            </div>

            {(insufficient || invalidPrice) && (
              <div className="text-[12px] text-error" style={{ fontFamily: "Inter" }}>
                {invalidPrice
                  ? "Price must be between 0.1¢ and 99.9¢"
                  : "Insufficient balance"}
              </div>
            )}

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
              disabled={isLoading || !canSubmit}
              className={cn(
                "flex-1 px-4 py-2 text-[14px] font-bold rounded-sm transition-all uppercase tracking-wider",
                isYes
                  ? "bg-primary text-on-primary hover:opacity-90 active:opacity-80"
                  : "bg-tertiary-container text-on-tertiary-container hover:opacity-90 active:opacity-80",
                (isLoading || !canSubmit) && "opacity-50 cursor-not-allowed"
              )}
              style={{ fontFamily: "Inter" }}
            >
              {isLoading ? "Placing..." : `Buy ${sharesNum} ${outcome}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
