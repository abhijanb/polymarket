import type { PortfolioSummary, MarketDashboard, CategoryItem, MarketTableRow } from "./dashboardTypes";

export const portfolioSummary: PortfolioSummary = {
  totalValue: 24592.4,
  dayChange: 1240.5,
  dayChangePct: 5.2,
  activePositions: 12,
  availableCash: 4200.0,
};

export const featuredMarket: MarketDashboard = {
  id: "market_btc_100k",
  title: "Will Bitcoin reach $100,000 by end of 2025?",
  description:
    "This market resolves to YES if the Coinbase Bitcoin price index closes at or above $100,000 USD on any business day in December 2025.",
  category: "Crypto",
  resolutionDate: "2025-12-31T23:59:59Z",
  oracleUrl: "https://api.coinbase.com/v2/prices/BTC-USD/spot",
  status: "ACTIVE" as const,
  createdAt: "2024-03-15T10:30:00Z",
  updatedAt: "2024-03-15T10:30:00Z",
  probability: 68,
  volume24h: 14200000,
  liquidity: 2100000,
  yesPrice: 0.68,
  noPrice: 0.32,
  endsAt: "Dec 31, 2025",
};

export const categories: CategoryItem[] = [
  { name: "Politics", icon: "ballot", colorClass: "bg-[#f59e0b] text-white", href: "/user/politics" },
  { name: "Crypto", icon: "currency_bitcoin", colorClass: "bg-[#3b82f6] text-white", href: "/user/crypto" },
  { name: "Sports", icon: "sports_soccer", colorClass: "bg-[#10b981] text-white", href: "/user/sports" },
  { name: "Economics", icon: "trending_up", colorClass: "bg-[#8b5cf6] text-white", href: "/user/economics" },
  { name: "Science", icon: "science", colorClass: "bg-[#06b6d4] text-white", href: "/user/science" },
];

export const activeMarkets: MarketTableRow[] = [
  {
    id: "market_eth_etf",
    title: "Will Ethereum Spot ETF be approved by May 2025?",
    description:
      "This market resolves to YES if the U.S. SEC approves at least one spot Ethereum ETF by May 31, 2025.",
    category: "Crypto",
    resolutionDate: "2025-05-31T23:59:59Z",
    oracleUrl: "https://sec.gov",
    status: "ACTIVE" as const,
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-03-15T10:30:00Z",
    probability: 72,
    volume24h: 8900000,
    liquidity: 1350000,
    yesPrice: 0.72,
    noPrice: 0.28,
    endsAt: "May 31, 2025",
  },
  {
    id: "market_trump_2024",
    title: "Will Donald Trump win the 2024 U.S. Presidential Election?",
    description:
      "This market resolves to YES if Donald Trump wins the majority of electoral votes in the 2024 election.",
    category: "Politics",
    resolutionDate: "2024-11-05T23:59:59Z",
    oracleUrl: "https://www.fec.gov",
    status: "ACTIVE" as const,
    createdAt: "2023-07-15T14:00:00Z",
    updatedAt: "2024-03-15T10:30:00Z",
    probability: 54,
    volume24h: 5600000,
    liquidity: 980000,
    yesPrice: 0.54,
    noPrice: 0.46,
    endsAt: "Nov 5, 2024",
  },
  {
    id: "market_fed_rate_june",
    title: "Will the Fed cut interest rates in June 2025?",
    description:
      "This market resolves to YES if the Federal Reserve lowers the target range for the federal funds rate at any FOMC meeting between June 1 and June 30, 2025.",
    category: "Economics",
    resolutionDate: "2025-06-30T23:59:59Z",
    oracleUrl: "https://www.federalreserve.gov",
    status: "ACTIVE" as const,
    createdAt: "2024-02-20T11:15:00Z",
    updatedAt: "2024-03-15T10:30:00Z",
    probability: 38,
    volume24h: 3200000,
    liquidity: 650000,
    yesPrice: 0.38,
    noPrice: 0.62,
    endsAt: "Jun 30, 2025",
  },
  {
    id: "market_super_league",
    title: "Will Manchester City win the 2024/25 Premier League?",
    description:
      "This market resolves to YES if Manchester City F.C. finishes the 2024/25 season as champions of the English Premier League.",
    category: "Sports",
    resolutionDate: "2025-05-25T23:59:59Z",
    oracleUrl: "https://www.premierleague.com",
    status: "ACTIVE" as const,
    createdAt: "2024-08-10T08:45:00Z",
    updatedAt: "2024-03-15T10:30:00Z",
    probability: 65,
    volume24h: 2100000,
    liquidity: 420000,
    yesPrice: 0.65,
    noPrice: 0.35,
    endsAt: "May 25, 2025",
  },
];
