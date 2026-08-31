import { useState, useMemo, useCallback } from "react";
import { useDebounce } from "@/features/user/hooks/useDebounce";
import type { MarketDashboard } from "@/features/user/model/dashboardTypes";

export type SortKey = "probability" | "volume24h" | null;

interface UseDashboardFiltersProps {
  markets: MarketDashboard[];
}

interface UseDashboardFiltersResult {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  sortBy: SortKey;
  sortDir: "asc" | "desc";
  handleSort: (key: "probability" | "volume24h") => void;
  processedMarkets: MarketDashboard[];
}

export function useDashboardFilters({ markets }: UseDashboardFiltersProps): UseDashboardFiltersResult {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("probability");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const debouncedSearch = useDebounce(searchTerm, 300);

  const processedMarkets = useMemo(() => {
    if (!markets.length) return [];
    let filtered = markets;
    if (debouncedSearch) {
      const term = debouncedSearch.toLowerCase();
      filtered = filtered.filter((m) => m.title.toLowerCase().includes(term));
    }
    if (activeCategory !== "All") {
      filtered = filtered.filter((m) => m.category === activeCategory);
    }
    if (sortBy) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = sortBy === "probability" ? a.probability : a.volume24h;
        const bVal = sortBy === "probability" ? b.probability : b.volume24h;
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      });
    }
    return filtered;
  }, [markets, debouncedSearch, activeCategory, sortBy, sortDir]);

  const handleSort = useCallback((key: "probability" | "volume24h") => {
    if (sortBy === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortDir("desc");
    }
  }, [sortBy]);

  return {
    searchTerm,
    setSearchTerm,
    activeCategory,
    setActiveCategory,
    sortBy,
    sortDir,
    handleSort,
    processedMarkets,
  };
}
