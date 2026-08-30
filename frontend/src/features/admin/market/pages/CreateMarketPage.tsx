import { MarketPreview } from "@/features/admin/market/components/MarketPreview";
import { CreateMarketForm } from "@/features/admin/market/components/form/CreateMarketForm";
import { useCreateMarket } from "@/features/admin/market/hooks/useCreateMarket";

export function CreateMarketPage() {
  const { title, setTitle, category, setCategory, resolutionDate, setResolutionDate, oracleUrl, setOracleUrl, description, setDescription, handleLaunch, handleSaveDraft } = useCreateMarket();

  return (
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-3 h-full">
      <CreateMarketForm
        title={title}
        setTitle={setTitle}
        category={category}
        setCategory={setCategory}
        resolutionDate={resolutionDate}
        setResolutionDate={setResolutionDate}
        oracleUrl={oracleUrl}
        setOracleUrl={setOracleUrl}
        description={description}
        setDescription={setDescription}
        onLaunch={handleLaunch}
        onSaveDraft={handleSaveDraft}
      />
      <MarketPreview title={title} category={category} resolutionDate={resolutionDate} />
    </div>
  );
}
