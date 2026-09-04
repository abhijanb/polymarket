import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePlaceOrderMutation } from "@/features/user/api/ordersApi";
import { placeOrderFormSchema, type PlaceOrderFormInput } from "@/features/user/lib/schemas";
import { formatCurrency } from "@/shared/lib/utils";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import type { Resolver } from "react-hook-form";

type Props = {
  open: boolean;
  onClose: () => void;
  market?: {
    id: string;
    title: string;
    description: string;
    category: string;
    status: string;
    outcome: string | null;
  } | null;
  onSuccess?: () => void;
};

type Step = "form" | "success" | "error";

export function PlaceOrderModal({ open, onClose, market, onSuccess }: Props) {
  const [placeOrder, { isLoading, error, isSuccess, isError }] = usePlaceOrderMutation();
  const [step, setStep] = useState<Step>("form");

  const form = useForm<PlaceOrderFormInput>({
    resolver: zodResolver(placeOrderFormSchema) as Resolver<PlaceOrderFormInput>,
    defaultValues: {
      outcome: "YES",
      shares: 1,
      pricePerShareCents: 50,
    },
  });

  const watchedOutcome = form.watch("outcome");
  const watchedShares = form.watch("shares");
  const watchedPrice = form.watch("pricePerShareCents");
  const totalCents = Number(watchedShares || 0) * Number(watchedPrice || 0);

  useEffect(() => {
    if (!open) {
      setStep("form");
      form.reset();
    }
  }, [open, form]);

  useEffect(() => {
    if (isSuccess && market) {
      setStep("success");
      const timer = setTimeout(() => {
        onClose();
        onSuccess?.();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, onClose, onSuccess, market]);

  useEffect(() => {
    if (isError && step === "form") {
      setStep("error");
    }
  }, [isError, step]);

  if (!open || !market) return null;

  const handleSubmit = form.handleSubmit(async (data) => {
    setStep("form");
    try {
      await placeOrder({
        productId: market.id,
        outcome: data.outcome,
        shares: Number(data.shares),
        pricePerShareCents: Number(data.pricePerShareCents),
      }).unwrap();
    } catch {
      setStep("error");
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-surface-container border border-outline-variant rounded-lg shadow-xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-outline-variant">
          <div className="flex flex-col">
            <h2 className="text-[16px] font-semibold text-on-surface" style={{ fontFamily: "Inter" }}>
              Place Order
            </h2>
            <span className="text-[12px] text-on-surface-variant line-clamp-1" style={{ fontFamily: "JetBrains Mono" }}>
              {market.title}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="p-4 overflow-y-auto">
          {step === "success" ? (
            <div className="flex flex-col items-center justify-center gap-3 py-8">
              <span className="material-symbols-outlined text-[48px] text-green-400">check_circle</span>
              <span className="text-[16px] font-semibold text-on-surface" style={{ fontFamily: "Inter" }}>
                Order placed successfully
              </span>
              <span className="text-[12px] text-on-surface-variant" style={{ fontFamily: "JetBrains Mono" }}>
                Redirecting...
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-[10px] tracking-[0.05em] font-bold text-on-surface-variant mb-2" style={{ fontFamily: "JetBrains Mono" }}>
                  OUTCOME
                </label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={watchedOutcome === "YES" ? "yes" : "outline"}
                    className={cn(
                      "flex-1 py-2 text-[14px] font-bold",
                      watchedOutcome === "YES" ? "" : "border-outline-variant text-on-surface-variant hover:text-on-surface"
                    )}
                    onClick={() => form.setValue("outcome", "YES")}
                  >
                    YES
                  </Button>
                  <Button
                    type="button"
                    variant={watchedOutcome === "NO" ? "no" : "outline"}
                    className={cn(
                      "flex-1 py-2 text-[14px] font-bold",
                      watchedOutcome === "NO" ? "" : "border-outline-variant text-on-surface-variant hover:text-on-surface"
                    )}
                    onClick={() => form.setValue("outcome", "NO")}
                  >
                    NO
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] tracking-[0.05em] font-bold text-on-surface-variant mb-2" style={{ fontFamily: "JetBrains Mono" }}>
                  SHARES
                </label>
                <input
                  type="number"
                  min={1}
                  {...form.register("shares")}
                  className={cn(
                    "w-full bg-surface-container-high border border-outline-variant rounded-sm px-3 py-2 text-[14px] font-medium text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none",
                    form.formState.errors.shares && "border-red-400 focus:border-red-400 focus:ring-red-400"
                  )}
                  style={{ fontFamily: "JetBrains Mono" }}
                />
                {form.formState.errors.shares && (
                  <span className="text-red-400 text-[12px] font-medium mt-1">{form.formState.errors.shares.message}</span>
                )}
              </div>

              <div>
                <label className="block text-[10px] tracking-[0.05em] font-bold text-on-surface-variant mb-2" style={{ fontFamily: "JetBrains Mono" }}>
                  PRICE PER SHARE (¢)
                </label>
                <input
                  type="number"
                  min={1}
                  max={9999}
                  {...form.register("pricePerShareCents")}
                  className={cn(
                    "w-full bg-surface-container-high border border-outline-variant rounded-sm px-3 py-2 text-[14px] font-medium text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none",
                    form.formState.errors.pricePerShareCents && "border-red-400 focus:border-red-400 focus:ring-red-400"
                  )}
                  style={{ fontFamily: "JetBrains Mono" }}
                />
                {form.formState.errors.pricePerShareCents && (
                  <span className="text-red-400 text-[12px] font-medium mt-1">{form.formState.errors.pricePerShareCents.message}</span>
                )}
              </div>

              <div className="flex items-center justify-between bg-surface-container-high border border-outline-variant rounded-sm px-3 py-2">
                <span className="text-[12px] text-on-surface-variant" style={{ fontFamily: "JetBrains Mono" }}>
                  Total Cost
                </span>
                <span className="text-[14px] font-bold text-on-surface" style={{ fontFamily: "JetBrains Mono" }}>
                  {formatCurrency(totalCents / 100)}
                </span>
              </div>

              {step === "error" && isError && (
                <div className="text-red-400 text-[13px] font-medium bg-red-400/10 rounded-sm px-3 py-2" style={{ fontFamily: "JetBrains Mono" }}>
                  {error instanceof Error ? error.message : "Something went wrong. Please try again."}
                </div>
              )}

              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-4 py-2 bg-transparent border border-outline-variant text-on-surface text-[14px] font-medium rounded-sm hover:bg-surface-container-high transition-colors disabled:opacity-50"
                  style={{ fontFamily: "JetBrains Mono" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-primary text-on-primary text-[14px] font-bold rounded-sm hover:opacity-90 disabled:opacity-50 transition-colors"
                  style={{ fontFamily: "JetBrains Mono" }}
                >
                  {isLoading ? "Placing..." : "Place Order"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
