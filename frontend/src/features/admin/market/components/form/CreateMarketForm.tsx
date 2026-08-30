type Props = {
  title: string;
  setTitle: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  resolutionDate: string;
  setResolutionDate: (v: string) => void;
  oracleUrl: string;
  setOracleUrl: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  onLaunch: () => void;
  onSaveDraft: () => void;
};

export function CreateMarketForm({
  title,
  setTitle,
  category,
  setCategory,
  resolutionDate,
  setResolutionDate,
  oracleUrl,
  setOracleUrl,
  description,
  setDescription,
  onLaunch,
  onSaveDraft,
}: Props) {
  return (
    <div className="flex-1 bg-surface-container-low border border-outline-variant rounded-lg p-4 flex flex-col space-y-3">
      <div className="border-b border-surface-variant pb-1 mb-3">
        <h1 className="text-[20px] font-semibold leading-[1.4] text-on-surface" style={{ fontFamily: "Inter" }}>
          CREATE NEW MARKET
        </h1>
      </div>

      <form className="space-y-3 overflow-y-auto pr-2" style={{ scrollbarWidth: "thin" }} onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="block text-[10px] tracking-[0.05em] font-bold text-on-surface-variant mb-1" style={{ fontFamily: "JetBrains Mono" }}>
            MARKET QUESTION / TITLE
          </label>
          <input
            className="w-full bg-surface-container-high border border-outline-variant rounded-sm px-2 py-1.5 text-[14px] font-medium text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
            style={{ fontFamily: "JetBrains Mono" }}
            placeholder="e.g., Will Bitcoin hit $100k by EOY?"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] tracking-[0.05em] font-bold text-on-surface-variant mb-1" style={{ fontFamily: "JetBrains Mono" }}>
              CATEGORY
            </label>
            <select
              className="w-full bg-surface-container-high border border-outline-variant rounded-sm px-2 py-1.5 text-[14px] font-medium text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none"
              style={{ fontFamily: "JetBrains Mono" }}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>Crypto</option>
              <option>Politics</option>
              <option>Economics</option>
              <option>Sports</option>
              <option>Science</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.05em] font-bold text-on-surface-variant mb-1" style={{ fontFamily: "JetBrains Mono" }}>
              RESOLUTION DATE (UTC)
            </label>
            <input
              className="w-full bg-surface-container-high border border-outline-variant rounded-sm px-2 py-1.5 text-[14px] font-medium text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              style={{ fontFamily: "JetBrains Mono" }}
              type="datetime-local"
              value={resolutionDate}
              onChange={(e) => setResolutionDate(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] tracking-[0.05em] font-bold text-on-surface-variant mb-1" style={{ fontFamily: "JetBrains Mono" }}>
            RESOLUTION SOURCE (ORACLE)
          </label>
          <div className="flex gap-1">
            <span className="bg-surface-variant border border-outline-variant rounded-l-sm px-2 py-1.5 text-[12px] text-on-surface-variant flex items-center border-r-0" style={{ fontFamily: "JetBrains Mono" }}>
              URL
            </span>
            <input
              className="flex-1 bg-surface-container-high border border-outline-variant rounded-r-sm px-2 py-1.5 text-[14px] font-medium text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              style={{ fontFamily: "JetBrains Mono" }}
              placeholder="https://api.coingecko.com/..."
              type="url"
              value={oracleUrl}
              onChange={(e) => setOracleUrl(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] tracking-[0.05em] font-bold text-on-surface-variant mb-1" style={{ fontFamily: "JetBrains Mono" }}>
            MARKET RULES & DESCRIPTION
          </label>
          <textarea
            className="w-full bg-surface-container-high border border-outline-variant rounded-sm px-2 py-1.5 text-[12px] text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
            style={{ fontFamily: "JetBrains Mono" }}
            placeholder="Define the exact parameters for YES and NO resolution..."
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </form>

      <div className="mt-auto pt-3 border-t border-surface-variant flex justify-end gap-2">
        <button
          type="button"
          onClick={onSaveDraft}
          className="px-4 py-2 bg-transparent border border-outline-variant text-on-surface text-[14px] font-medium rounded-sm hover:bg-surface-container-high transition-colors"
          style={{ fontFamily: "JetBrains Mono" }}
        >
          Save Draft
        </button>
        <button
          type="button"
          onClick={onLaunch}
          className="px-4 py-2 bg-primary text-on-primary text-[14px] font-medium rounded-sm hover:bg-primary-fixed-dim transition-colors font-bold"
          style={{ fontFamily: "JetBrains Mono" }}
        >
          Launch Market
        </button>
      </div>
    </div>
  );
}
