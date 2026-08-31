import { getActiveMarketsWithOutcomes } from "../../market/service/market.service";

export async function getDashboardMarkets() {
  return getActiveMarketsWithOutcomes();
}
