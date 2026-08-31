import type { Market } from "@/shared/types/market";

export interface PortfolioSummary {
  totalValue: number;
  dayChange: number;
  dayChangePct: number;
  activePositions: number;
  availableCash: number;
}

export interface MarketDashboard extends Market {
  probability: number;
  volume24h: number;
  liquidity: number;
  yesPrice: number;
  noPrice: number;
  endsAt: string;
}

export interface CategoryItem {
  name: string;
  icon: string;
  colorClass: string;
  href: string;
}

export interface MarketTableRow extends MarketDashboard {}

export interface OutcomeApi {
  id: string;
  label: string;
  probability: string;
}

export interface MarketApiResponse extends Market {
  outcomes: OutcomeApi[];
  volume24h?: number;
  liquidity?: number;
}

export function transformMarketToDashboard(market: MarketApiResponse): MarketDashboard {
  const yesOutcome = market.outcomes.find((o) => o.label === "YES");
  const yesProbability = yesOutcome ? Number(yesOutcome.probability) : 0.5;
  const probability = Math.round(yesProbability * 100);

  return {
    id: market.id,
    title: market.title,
    description: market.description,
    category: market.category,
    resolutionDate: market.resolutionDate,
    oracleUrl: market.oracleUrl,
    status: market.status,
    resolvedAt: market.resolvedAt,
    resolvedOutcomeId: market.resolvedOutcomeId,
    createdAt: market.createdAt,
    updatedAt: market.updatedAt,
    probability,
    volume24h: market.volume24h ?? 0,
    liquidity: market.liquidity ?? 0,
    yesPrice: yesProbability,
    noPrice: 1 - yesProbability,
    endsAt: new Date(market.resolutionDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  };
}

