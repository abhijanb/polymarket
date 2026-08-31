import { MarketPreview } from "@/features/admin/market/components/MarketPreview";
import { CreateMarketForm } from "@/features/admin/market/components/form/CreateMarketForm";
import { useCreateMarket } from "@/features/admin/market/hooks/useCreateMarket";

export function CreateMarketPage() {
  const { form, handleLaunch, handleSaveDraft, error, isLoading, title, category, resolutionDate } = useCreateMarket();

  return (
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-3 h-full">
      <CreateMarketForm
        form={form}
        onLaunch={handleLaunch}
        onSaveDraft={handleSaveDraft}
        isLoading={isLoading}
        error={error}
      />
      <MarketPreview title={title} category={category} resolutionDate={resolutionDate} />
    </div>
  );
}
