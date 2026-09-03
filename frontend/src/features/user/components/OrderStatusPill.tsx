import { cn } from "@/shared/lib/utils";
import type {
  OrderStatusTone,
  OrderResultTone,
} from "@/features/user/model/userModel";

const STATUS_CLASSES: Record<OrderStatusTone, string> = {
  filled: "bg-green-500/15 text-green-600 border border-green-500/30",
  open: "bg-amber-500/15 text-amber-600 border border-amber-500/30",
  partial: "bg-amber-500/15 text-amber-600 border border-amber-500/30",
  other: "bg-zinc-500/10 text-zinc-500 border border-zinc-500/20",
};

const RESULT_CLASSES: Record<OrderResultTone, string> = {
  win: "bg-green-500/15 text-green-700 border border-green-500/40",
  loss: "bg-red-500/15 text-red-600 border border-red-500/40",
  pending: "bg-amber-500/15 text-amber-700 border border-amber-500/40",
  void: "bg-zinc-500/10 text-zinc-500 border border-zinc-500/30",
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
        STATUS_CLASSES[tone],
        className
      )}
      style={{ fontFamily: "JetBrains Mono" }}
    >
      {status}
    </span>
  );
}

export function OrderResultPill({
  result,
  tone,
  label,
  className,
}: {
  result: string;
  tone: OrderResultTone;
  label: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "px-2 py-0.5 rounded-sm text-[10px] font-bold tracking-wide",
        RESULT_CLASSES[tone],
        className
      )}
      style={{ fontFamily: "JetBrains Mono" }}
      title={result}
    >
      {label}
    </span>
  );
}
