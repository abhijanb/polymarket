import { useGetMarketsQuery, useDeleteMarketMutation } from "../api/marketApi";

export function useMarkets() {
  const { data: markets = [], isLoading, error, refetch } = useGetMarketsQuery();
  const [deleteMarket] = useDeleteMarketMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteMarket(id).unwrap();
    } catch (err) {
      console.error("[handleDelete]", err);
    }
  };

  return { markets, isLoading, error, refetch, deleteMarket: handleDelete };
}
