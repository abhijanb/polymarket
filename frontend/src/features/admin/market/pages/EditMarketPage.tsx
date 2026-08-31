import { Link } from "react-router-dom";
import { useEditMarket } from "../hooks/useEditMarket";
import { EditMarketForm } from "../components/form/EditMarketForm";

export function EditMarketPage() {
  const { form, handleSubmit, handleCancel, saving, isLoading, market } = useEditMarket();

  if (isLoading) return <div className="p-4">Loading market...</div>;
  if (!market) return <div className="p-4 text-red-400">Market not found</div>;

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 h-full min-h-0">
      <div className="flex justify-between items-center">
        <div>
          <Link to={`/admin/markets/${market.id}`} className="text-primary text-[12px] hover:underline mb-2 block" style={{ fontFamily: "JetBrains Mono" }}>
            ← Back to Market
          </Link>
          <h1 className="text-[24px] font-bold text-on-surface" style={{ fontFamily: "Inter" }}>Edit Market</h1>
        </div>
      </div>

      <EditMarketForm
        form={form}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        saving={saving}
      />
    </div>
  );
}
