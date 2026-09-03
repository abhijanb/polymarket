import { cn } from "@/shared/lib/utils";
import type { OrderStatusTone } from "@/features/user/model/userModel";

const TONE_CLASSES: Record<OrderStatusTone, string> = {
  filled: "bg-green-500/15 text-green-600 border border-green-500/30",
  open: "bg-amber-500/15 text-amber-600 border border-amber-500/30",
  partial: "bg-amber-500/15 text-amber-600 border border-amber-500/30",
  other: "bg-zinc-500/10 text-zinc-500 border border-zinc-500/20",
};

export function OrderStatusPill({
  status,
  tone,
  className,
}: {
  status: string;
  tone: OrderStatusTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "px-2 py-0.5 rounded-sm text-[10px] font-bold tracking-wide",
        TONE_CLASSES[tone],
        className
      )}
      style={{ fontFamily: "JetBrains Mono" }}
    >
      {status}
    </span>
  );
}
