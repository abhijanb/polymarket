import { cn } from "@/shared/lib/utils";

export function PortfolioCardSkeleton() {
  return (
    <div className="bento-card flex flex-col gap-4" aria-hidden>
      <div className="flex items-center gap-2">
        <div className="h-5 w-5 bg-surface-container-high rounded-sm" />
        <div className="h-3 w-28 bg-surface-container-high rounded-sm" />
      </div>
      <div className="h-10 w-3/4 bg-surface-container-high rounded-sm" />
      <div className="h-4 w-1/2 bg-surface-container-high rounded-sm" />
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="h-14 bg-surface-container-high rounded-sm" />
        <div className="h-14 bg-surface-container-high rounded-sm" />
      </div>
    </div>
  );
}

export function RecentActivitySkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bento-card flex flex-col" aria-hidden>
      <div className="flex items-center justify-between border-b border-outline-variant pb-3 mb-2">
        <div className="h-4 w-32 bg-surface-container-high rounded-sm" />
        <div className="h-3 w-12 bg-surface-container-high rounded-sm" />
      </div>
      <div className="flex flex-col">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "flex items-center gap-3 py-3",
              i < rows - 1 && "border-b border-outline-variant"
            )}
          >
            <div className="h-8 w-8 rounded-sm bg-surface-container-high" />
            <div className="flex-1 flex flex-col gap-1.5">
              <div className="h-3 w-2/3 bg-surface-container-high rounded-sm" />
              <div className="h-3 w-1/3 bg-surface-container-high rounded-sm" />
            </div>
            <div className="h-4 w-16 bg-surface-container-high rounded-sm" />
          </div>
        ))}
      </div>
    </div>
  );
}
