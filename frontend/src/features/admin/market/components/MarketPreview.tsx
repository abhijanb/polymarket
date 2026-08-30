type Props = {
  title?: string;
  category?: string;
  resolutionDate?: string;
};

export function MarketPreview({ title, category = "Crypto", resolutionDate }: Props) {
  const displayTitle = title?.trim() || "Will Bitcoin hit $100k by EOY?";
  const displayCategory = (category || "Crypto").toUpperCase();
  const displayDate = resolutionDate
    ? new Date(resolutionDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "Dec 31";

  return (
    <div className="w-full md:w-[320px] flex flex-col space-y-3">
      <h3 className="text-[10px] tracking-[0.05em] font-bold text-on-surface-variant px-1" style={{ fontFamily: "JetBrains Mono" }}>
        LIVE PREVIEW
      </h3>
      <div className="bg-surface border border-outline-variant rounded-lg p-4 flex flex-col space-y-3 h-auto">
        <div className="flex justify-between items-start">
          <span
            className="bg-surface-container-highest px-2 py-0.5 rounded-sm text-[10px] tracking-[0.05em] font-bold text-primary border border-surface-bright"
            style={{ fontFamily: "JetBrains Mono" }}
          >
            {displayCategory}
          </span>
          <span className="text-[12px] text-on-surface-variant flex items-center gap-1" style={{ fontFamily: "JetBrains Mono" }}>
            <span className="material-symbols-outlined text-[14px]">timer</span> {displayDate}
          </span>
        </div>
        <h4 className="text-[20px] font-semibold leading-tight text-on-surface" style={{ fontFamily: "Inter" }}>
          {displayTitle}
        </h4>
        <div className="flex gap-2 text-[12px] text-on-surface-variant" style={{ fontFamily: "JetBrains Mono" }}>
          <span className="text-secondary flex items-center">
            <span className="material-symbols-outlined text-[12px] mr-1">trending_up</span> 68% YES
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-auto pt-3 border-t border-surface-container-high">
          <div className="bg-secondary-container/40 border border-secondary/30 p-2 rounded-sm flex flex-col items-center">
            <span className="text-[18px] font-semibold leading-none text-on-secondary-container" style={{ fontFamily: "JetBrains Mono" }}>
              68¢
            </span>
            <span className="text-[10px] tracking-[0.05em] font-bold text-on-secondary-container" style={{ fontFamily: "JetBrains Mono" }}>
              BUY YES
            </span>
          </div>
          <div className="bg-tertiary-container/40 border border-tertiary/30 p-2 rounded-sm flex flex-col items-center">
            <span className="text-[18px] font-semibold leading-none text-on-tertiary-container" style={{ fontFamily: "JetBrains Mono" }}>
              32¢
            </span>
            <span className="text-[10px] tracking-[0.05em] font-bold text-on-tertiary-container" style={{ fontFamily: "JetBrains Mono" }}>
              BUY NO
            </span>
          </div>
        </div>
      </div>
      <div className="bg-surface-container-low border border-outline-variant rounded-lg p-4 text-center">
        <span className="material-symbols-outlined text-outline-variant text-[32px] mb-2 block mx-auto">visibility</span>
        <p className="text-[12px] leading-[1.5] text-on-surface-variant" style={{ fontFamily: "Inter" }}>
          This is how users will see the market card on the main dashboard.
        </p>
      </div>
    </div>
  );
}
