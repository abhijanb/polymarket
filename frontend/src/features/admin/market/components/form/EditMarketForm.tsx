import type { UseFormReturn } from "react-hook-form";
import type { UpdateMarketInput } from "@/shared/types/market";

type Props = {
  form: UseFormReturn<UpdateMarketInput>;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  saving: boolean;
};

export function EditMarketForm({ form, onSubmit, onCancel, saving }: Props) {
  const { register, formState: { errors } } = form;

  return (
    <form onSubmit={onSubmit} className="bento-card p-6 flex flex-col gap-4 flex-1 min-h-0 overflow-hidden">
      <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-4 pr-1">
        <div>
          <label className="block text-[10px] tracking-[0.05em] font-bold text-on-surface-variant mb-1" style={{ fontFamily: "JetBrains Mono" }}>
            TITLE
          </label>
          <input
            {...register("title")}
            className="w-full bg-surface-container-high border border-outline-variant rounded-sm px-2 py-1.5 text-[14px] text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            style={{ fontFamily: "JetBrains Mono" }}
          />
          {errors.title && <span className="text-red-400 text-[12px]">{errors.title.message}</span>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] tracking-[0.05em] font-bold text-on-surface-variant mb-1" style={{ fontFamily: "JetBrains Mono" }}>
              CATEGORY
            </label>
            <select
              {...register("category")}
              className="w-full bg-surface-container-high border border-outline-variant rounded-sm px-2 py-1.5 text-[14px] text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              style={{ fontFamily: "JetBrains Mono" }}
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
              STATUS
            </label>
            <select
              {...register("status")}
              className="w-full bg-surface-container-high border border-outline-variant rounded-sm px-2 py-1.5 text-[14px] text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              style={{ fontFamily: "JetBrains Mono" }}
            >
              <option>DRAFT</option>
              <option>ACTIVE</option>
              <option>RESOLVED</option>
              <option>CLOSED</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[10px] tracking-[0.05em] font-bold text-on-surface-variant mb-1" style={{ fontFamily: "JetBrains Mono" }}>
          RESOLUTION DATE (UTC)
          </label>
          <input
            {...register("resolutionDate")}
            className="w-full bg-surface-container-high border border-outline-variant rounded-sm px-2 py-1.5 text-[14px] text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            style={{ fontFamily: "JetBrains Mono" }}
            type="datetime-local"
          />
          {errors.resolutionDate && <span className="text-red-400 text-[12px]">{errors.resolutionDate.message}</span>}
        </div>

        <div>
          <label className="block text-[10px] tracking-[0.05em] font-bold text-on-surface-variant mb-1" style={{ fontFamily: "JetBrains Mono" }}>
          ORACLE URL
          </label>
          <input
            {...register("oracleUrl")}
            className="w-full bg-surface-container-high border border-outline-variant rounded-sm px-2 py-1.5 text-[14px] text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            style={{ fontFamily: "JetBrains Mono" }}
            type="url"
          />
          {errors.oracleUrl && <span className="text-red-400 text-[12px]">{errors.oracleUrl.message}</span>}
        </div>

        <div>
          <label className="block text-[10px] tracking-[0.05em] font-bold text-on-surface-variant mb-1" style={{ fontFamily: "JetBrains Mono" }}>
          DESCRIPTION
          </label>
          <textarea
            {...register("description")}
            className="w-full bg-surface-container-high border border-outline-variant rounded-sm px-2 py-1.5 text-[12px] text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
            style={{ fontFamily: "JetBrains Mono" }}
            rows={4}
          />
          {errors.description && <span className="text-red-400 text-[12px]">{errors.description.message}</span>}
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-transparent border border-outline-variant text-on-surface text-[14px] font-medium rounded-sm hover:bg-surface-container-high transition-colors"
          style={{ fontFamily: "JetBrains Mono" }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-primary text-on-primary text-[14px] font-bold rounded-sm hover:opacity-90 disabled:opacity-50 transition-colors"
          style={{ fontFamily: "JetBrains Mono" }}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
