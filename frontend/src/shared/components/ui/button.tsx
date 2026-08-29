// Legacy element wrapper — do not create new element-level components (button/input/select etc.).
// For new code, use native <button> + cn() + Tailwind directly. This file is kept for existing consumers.
import * as React from "react";
import { cn } from "@/shared/lib/utils";

type Variant = "default" | "ghost" | "outline" | "yes" | "no";
type Size = "sm" | "md" | "lg" | "icon";

const variantCls: Record<Variant, string> = {
  default: "bg-white text-black hover:bg-zinc-200 shadow-sm",
  ghost: "bg-transparent hover:bg-zinc-800 text-zinc-300 hover:text-white",
  outline: "border border-zinc-700 bg-transparent hover:bg-zinc-800 text-white",
  yes: "bg-[#00D395] hover:bg-[#00B87F] text-black font-bold shadow-sm",
  no: "bg-[#FF3B30] hover:bg-[#E6352B] text-white font-bold shadow-sm",
};
const sizeCls: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-9 px-4 text-sm",
  lg: "h-11 px-6 text-[15px]",
  icon: "h-9 w-9 p-0",
};

export function Button({
  className,
  variant = "default",
  size = "md",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20",
        variantCls[variant],
        sizeCls[size],
        className
      )}
      {...props}
    />
  );
}
