import type { UseFormReturn } from "react-hook-form";
import type { CreateMarketInput } from "../../lib/schemas";

type Props = {
  form: UseFormReturn<CreateMarketInput>;
  onLaunch: () => void;
  onSaveDraft: () => void;
  isLoading: boolean;
  error: unknown;
};

const fieldErrorClass = "text-red-400 text-[12px] font-medium";

export function CreateMarketForm({ form, onLaunch, onSaveDraft, isLoading, error }: Props) {
  const { register, formState: { errors } } = form;

  return (
    <div className="flex-1 bg-surface-container-low border border-outline-variant rounded-lg p-4 flex flex-col space-y-3">
      <div className="border-b border-surface-variant pb-1 mb-3">
        <h1 className="text-[20px] font-semibold leading-[1.4] text-on-surface" style={{ fontFamily: "Inter" }}>
          CREATE NEW MARKET
        </h1>
      </div>

      <form onSubmit={onLaunch} className="flex-1 min-h-0 space-y-3 overflow-y-auto pr-1" style={{ scrollbarWidth: "thin" }}>
        <div>
          <label className="block text-[10px] tracking-[0.05em] font-bold text-on-surface-variant mb-1" style={{ fontFamily: "JetBrains Mono" }}>
            MARKET QUESTION / TITLE
          </label>
          <input
            {...register("title")}
            className={`w-full bg-surface-container-high border border-outline-variant rounded-sm px-2 py-1.5 text-[14px] font-medium text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors ${errors.title ? "border-red-400 focus:border-red-400 focus:ring-red-400" : ""}`}
            style={{ fontFamily: "JetBrains Mono" }}
            placeholder="e.g., Will Bitcoin hit $100k by EOY?"
            type="text"
          />
          {errors.title && <span className={fieldErrorClass}>{errors.title.message}</span>}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] tracking-[0.05em] font-bold text-on-surface-variant mb-1" style={{ fontFamily: "JetBrains Mono" }}>
              CATEGORY
            </label>
            <select
              {...register("category")}
              className="w-full bg-surface-container-high border border-outline-variant rounded-sm px-2 py-1.5 text-[14px] font-medium text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none"
              style={{ fontFamily: "JetBrains Mono" }}
            >
              <option>Crypto</option>
              <option>Politics</option>
              <option>Economics</option>
              <option>Sports</option>
              <option>Science</option>
            </select>
            {errors.category && <span className={fieldErrorClass}>{errors.category.message}</span>}
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.05em] font-bold text-on-surface-variant mb-1" style={{ fontFamily: "JetBrains Mono" }}>
              RESOLUTION DATE (UTC)
            </label>
            <input
              {...register("resolutionDate")}
              className={`w-full bg-surface-container-high border border-outline-variant rounded-sm px-2 py-1.5 text-[14px] font-medium text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none ${errors.resolutionDate ? "border-red-400 focus:border-red-400 focus:ring-red-400" : ""}`}
              style={{ fontFamily: "JetBrains Mono" }}
              type="datetime-local"
            />
            {errors.resolutionDate && <span className={fieldErrorClass}>{errors.resolutionDate.message}</span>}
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
              {...register("oracleUrl")}
              className={`flex-1 bg-surface-container-high border border-outline-variant rounded-r-sm px-2 py-1.5 text-[14px] font-medium text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none ${errors.oracleUrl ? "border-red-400 focus:border-red-400 focus:ring-red-400" : ""}`}
              style={{ fontFamily: "JetBrains Mono" }}
              placeholder="https://api.coingecko.com/..."
              type="url"
            />
          </div>
          {errors.oracleUrl && <span className={fieldErrorClass}>{errors.oracleUrl.message}</span>}
        </div>

        <div>
          <label className="block text-[10px] tracking-[0.05em] font-bold text-on-surface-variant mb-1" style={{ fontFamily: "JetBrains Mono" }}>
            MARKET RULES & DESCRIPTION
          </label>
          <textarea
            {...register("description")}
            className={`w-full bg-surface-container-high border border-outline-variant rounded-sm px-2 py-1.5 text-[12px] text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none ${errors.description ? "border-red-400 focus:border-red-400 focus:ring-red-400" : ""}`}
            style={{ fontFamily: "JetBrains Mono" }}
            placeholder="Define the exact parameters for YES and NO resolution..."
            rows={4}
          />
          {errors.description && <span className={fieldErrorClass}>{errors.description.message}</span>}
        </div>
      </form>

      <div className="min-h-[2.25rem]">
        {Boolean(error) && Object.keys(errors).length === 0 && (
          <div className="text-red-400 text-[13px] font-medium bg-red-400/10 rounded-sm px-3 py-2" style={{ fontFamily: "JetBrains Mono" }}>
            {error instanceof Error ? error.message : "Something went wrong. Please check the console for details."}
          </div>
        )}
      </div>

      <div className="mt-auto pt-3 border-t border-surface-variant flex justify-end gap-2">
        <button
          type="button"
          onClick={onSaveDraft}
          disabled={isLoading}
          className="px-4 py-2 bg-transparent border border-outline-variant text-on-surface text-[14px] font-medium rounded-sm hover:bg-surface-container-high transition-colors disabled:opacity-50"
          style={{ fontFamily: "JetBrains Mono" }}
        >
          {isLoading ? "Saving..." : "Save Draft"}
        </button>
        <button
          type="submit"
          onClick={onLaunch}
          disabled={isLoading}
          className="px-4 py-2 bg-primary text-on-primary text-[14px] font-medium rounded-sm hover:bg-primary-fixed-dim transition-colors font-bold disabled:opacity-50"
          style={{ fontFamily: "JetBrains Mono" }}
        >
          {isLoading ? "Launching..." : "Launch Market"}
        </button>
      </div>
    </div>
  );
}
