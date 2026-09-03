/**
 * Raw DTOs (Data Transfer Objects) — these mirror the backend response shapes
 * and are used only by the api/ layer. Pages, components, and hooks should
 * consume mapped ViewModels from userModel.ts instead.
 */

export interface PortfolioDto {
  totalValue: number;
  dayChange: number;
  dayChangePct: number;
  availableCash: number;
}

export type OrderStatusDto = "FILLED" | "OPEN" | "PARTIAL" | "CANCELED" | string;

export interface OrderDto {
  id: string;
  userId: string;
  productId: string;
  outcome: string;
  shares: number;
  filled: number;
  pricePerShareCents: number;
  totalCostUsd: number;
  status: OrderStatusDto;
  result: "WIN" | "LOSS" | "PENDING" | "VOID";
  createdAt: string;
  product: {
    name: string;
    status: string;
  };
}

export type OrderOutcome = "YES" | "NO";

export interface PlaceOrderRequest {
  productId: string;
  outcome: OrderOutcome;
  shares: number;
  pricePerShareCents: number;
}

export interface PlaceOrderResponse {
  success: boolean;
  order: OrderDto;
  balance: number;
  probability: number;
  shares: number;
  result: "WIN" | "LOSS" | "PENDING" | "VOID";
}

/**
 * @deprecated Use PortfolioDto from this module. Kept as a re-export so older
 * imports continue to work during the transition.
 */
export type PortfolioSummary = PortfolioDto;

/**
 * @deprecated Use OrderDto from this module.
 */
export type OrderHistoryItem = OrderDto;
