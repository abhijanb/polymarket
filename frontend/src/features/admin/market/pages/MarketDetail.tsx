import { useParams, Link } from "react-router-dom";
import { useGetMarketByIdQuery, useDeleteMarketMutation } from "../api/marketApi";

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  ACTIVE: "bg-green-500/20 text-green-400 border-green-500/30",
  RESOLVED: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  CLOSED: "bg-red-500/20 text-red-400 border-red-500/30",
};

export function MarketDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: market, isLoading, error } = useGetMarketByIdQuery(id!);
  const [deleteMarket] = useDeleteMarketMutation();

  if (isLoading) return <div className="p-4">Loading market...</div>;
  if (error || !market) return <div className="p-4 text-red-400">Market not found</div>;

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this market?")) return;
    try {
      await deleteMarket(id!).unwrap();
    } catch (err) {
      console.error("[delete]", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      <div className="flex justify-between items-start">
        <div>
          <Link to="/admin/markets" className="text-primary text-[12px] hover:underline mb-2 block" style={{ fontFamily: "JetBrains Mono" }}>
            ← Back to Markets
          </Link>
          <h1 className="text-[24px] font-bold text-on-surface" style={{ fontFamily: "Inter" }}>{market.title}</h1>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/admin/markets/${id}/edit`}
            className="bg-primary text-on-primary px-4 py-2 rounded-sm text-[14px] font-bold hover:opacity-90"
            style={{ fontFamily: "JetBrains Mono" }}
          >
            EDIT
          </Link>
          <button
            onClick={handleDelete}
            className="bg-tertiary-container text-on-tertiary-container px-4 py-2 rounded-sm text-[14px] font-bold hover:opacity-90"
            style={{ fontFamily: "JetBrains Mono" }}
          >
            DELETE
          </button>
        </div>
      </div>

      <div className="terminal-bento grid grid-cols-2 gap-4">
        <div className="bento-card p-4 flex flex-col gap-2">
          <span className="text-[10px] tracking-[0.05em] font-bold text-on-surface-variant" style={{ fontFamily: "JetBrains Mono" }}>
            CATEGORY
          </span>
          <span className={`px-2 py-0.5 rounded-sm text-[12px] font-bold border w-fit ${STATUS_COLORS[market.category] || "bg-gray-500/20 text-gray-400 border-gray-500/30"}`} style={{ fontFamily: "JetBrains Mono" }}>
            {market.category.toUpperCase()}
          </span>
        </div>
        <div className="bento-card p-4 flex flex-col gap-2">
          <span className="text-[10px] tracking-[0.05em] font-bold text-on-surface-variant" style={{ fontFamily: "JetBrains Mono" }}>
            STATUS
          </span>
          <span className={`px-2 py-0.5 rounded-sm text-[12px] font-bold border w-fit ${STATUS_COLORS[market.status] || "bg-gray-500/20 text-gray-400 border-gray-500/30"}`} style={{ fontFamily: "JetBrains Mono" }}>
            {market.status}
          </span>
        </div>
        <div className="bento-card p-4 flex flex-col gap-2 col-span-2">
          <span className="text-[10px] tracking-[0.05em] font-bold text-on-surface-variant" style={{ fontFamily: "JetBrains Mono" }}>
            RESOLUTION DATE
          </span>
          <span className="text-[14px] text-on-surface" style={{ fontFamily: "JetBrains Mono" }}>
            {new Date(market.resolutionDate).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="bento-card p-4 flex flex-col gap-3">
        <span className="text-[10px] tracking-[0.05em] font-bold text-on-surface-variant" style={{ fontFamily: "JetBrains Mono" }}>
          DESCRIPTION
        </span>
        <p className="text-[14px] text-on-surface whitespace-pre-wrap" style={{ fontFamily: "Inter" }}>
          {market.description}
        </p>
      </div>

      <div className="bento-card p-4 flex flex-col gap-3">
        <span className="text-[10px] tracking-[0.05em] font-bold text-on-surface-variant" style={{ fontFamily: "JetBrains Mono" }}>
          ORACLE URL
        </span>
        <a href={market.oracleUrl} target="_blank" rel="noreferrer" className="text-primary text-[14px] hover:underline break-all" style={{ fontFamily: "JetBrains Mono" }}>
          {market.oracleUrl}
        </a>
      </div>

      <div className="text-[10px] text-on-surface-variant" style={{ fontFamily: "JetBrains Mono" }}>
        Created: {new Date(market.createdAt).toLocaleString()} • Updated: {new Date(market.updatedAt).toLocaleString()}
      </div>
    </div>
  );
}
