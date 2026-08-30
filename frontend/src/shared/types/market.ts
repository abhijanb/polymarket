export interface Market {
  id: string;
  title: string;
  description: string;
  category: "Crypto" | "Politics" | "Economics" | "Sports" | "Science";
  resolutionDate: string;
  oracleUrl: string;
  status: "DRAFT" | "ACTIVE" | "RESOLVED" | "CLOSED";
  resolvedAt?: string;
  resolvedOutcomeId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMarketInput {
  title: string;
  description: string;
  category: string;
  resolutionDate: string;
  oracleUrl: string;
}

export type UpdateMarketInput = {
  title?: string;
  description?: string;
  category?: "Crypto" | "Politics" | "Economics" | "Sports" | "Science";
  resolutionDate?: string;
  oracleUrl?: string;
  status?: "DRAFT" | "ACTIVE" | "RESOLVED" | "CLOSED";
  resolvedOutcomeId?: string;
};
