import {
  formatCurrency as _formatCurrency,
  formatNumber as _formatNumber,
  formatRelativeTime as _formatRelativeTime,
} from "@/shared/lib/utils";
import type { OrderDto, OrderStatusDto, PortfolioDto } from "./dashboardTypes";

/**
 * ViewModels — pure UI-facing shapes derived from DTOs.
 * No imports from react, @reduxjs, or network modules.
 */

export interface PortfolioVm {
  totalValue: number;
  totalValueDisplay: string;
  dayChange: number;
  dayChangeDisplay: string;
  dayChangePct: number;
  dayChangeTone: "up" | "down" | "flat";
  availableCash: number;
  availableCashDisplay: string;
  currency: "USD";
  isEmpty: boolean;
}

export type OrderStatusTone = "filled" | "open" | "partial" | "other";
export type OrderResultTone = "win" | "loss" | "pending" | "void";

export interface RecentOrderVm {
  id: string;
  productName: string;
  outcome: string;
  isYes: boolean;
  sharesDisplay: string;
  pricePerShareDisplay: string;
  totalCostDisplay: string;
  status: string;
  statusTone: OrderStatusTone;
  result: "WIN" | "LOSS" | "PENDING" | "VOID";
  resultTone: OrderResultTone;
  resultLabel: string;
  time: string;
  timeRelative: string;
  createdAtIso: string;
}

export interface EmptyState {
  icon: string;
  title: string;
  description?: string;
  ctaLabel?: string;
  ctaTo?: string;
}

/**
 * Mappers
 */

export function toPortfolioVm(dto: PortfolioDto | undefined | null): PortfolioVm | null {
  if (!dto) return null;
  const dayChange = Number(dto.dayChange ?? 0);
  const dayChangePct = Number(dto.dayChangePct ?? 0);
  const totalValue = Number(dto.totalValue ?? 0);
  const availableCash = Number(dto.availableCash ?? 0);
  return {
    totalValue,
    totalValueDisplay: _formatCurrency(totalValue),
    dayChange,
    dayChangeDisplay: _formatCurrency(Math.abs(dayChange)),
    dayChangePct,
    dayChangeTone: dayChange > 0 ? "up" : dayChange < 0 ? "down" : "flat",
    availableCash,
    availableCashDisplay: _formatCurrency(availableCash),
    currency: "USD",
    isEmpty: totalValue === 0 && availableCash === 0,
  };
}

export function getStatusTone(status: OrderStatusDto | string): OrderStatusTone {
  if (status === "FILLED") return "filled";
  if (status === "OPEN") return "open";
  if (status === "PARTIAL") return "partial";
  return "other";
}

export function toRecentOrderVm(dto: OrderDto): RecentOrderVm {
  const outcome = dto.outcome ?? "";
  const isYes = outcome === "YES";
  const created = dto.createdAt ? new Date(dto.createdAt) : new Date();
  return {
    id: dto.id,
    productName: dto.product?.name ?? "Unknown market",
    outcome,
    isYes,
    sharesDisplay: _formatNumber(Number(dto.shares ?? 0)),
    pricePerShareDisplay: _formatCurrency(Number(dto.pricePerShareCents ?? 0) / 100),
    totalCostDisplay: _formatCurrency(Number(dto.totalCostUsd ?? 0)),
    status: dto.status ?? "—",
    statusTone: getStatusTone(dto.status),
    time: created.toLocaleString(),
    timeRelative: _formatRelativeTime(created),
    createdAtIso: dto.createdAt,
  };
}

export function toRecentOrderList(dtos: OrderDto[] | undefined | null): RecentOrderVm[] {
  if (!dtos || dtos.length === 0) return [];
  return dtos.map(toRecentOrderVm);
}

export function takeRecent(items: RecentOrderVm[], limit: number): RecentOrderVm[] {
  if (items.length <= limit) return items;
  return items.slice(0, limit);
}

/**
 * Re-export shared formatters so pages can import everything from one place.
 */
export const formatters = {
  currency: _formatCurrency,
  number: _formatNumber,
  relativeTime: _formatRelativeTime,
};

/**
 * Empty state presets
 */
export const emptyStates = {
  recentActivity: {
    icon: "inbox",
    title: "No recent activity",
    description: "Your most recent trades will appear here.",
    ctaLabel: "View all orders",
    ctaTo: "/user/orders",
  } satisfies EmptyState,
  orderHistory: {
    icon: "receipt_long",
    title: "No orders yet",
    description: "Place a trade from the markets page and it will show up here.",
    ctaLabel: "Back to terminal",
    ctaTo: "/user",
  } satisfies EmptyState,
  portfolio: {
    icon: "account_balance_wallet",
    title: "Your portfolio is empty",
    description: "Fund your account to start trading on prediction markets.",
  } satisfies EmptyState,
};
