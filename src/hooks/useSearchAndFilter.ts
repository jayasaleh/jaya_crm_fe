import { useState, useCallback } from "react";

interface UseSearchAndFilterOptions {
  onFilterChange?: () => void;
}

export function useSearchAndFilter({ onFilterChange }: UseSearchAndFilterOptions = {}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});

  const updateSearch = useCallback((value: string) => {
    setSearchTerm(value);
    onFilterChange?.();
  }, [onFilterChange]);

  const updateFilter = useCallback((key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "ALL" ? "" : value,
    }));
    onFilterChange?.();
  }, [onFilterChange]);

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setFilters({});
    onFilterChange?.();
  }, [onFilterChange]);

  return {
    searchTerm,
    filters,
    updateSearch,
    updateFilter,
    clearFilters,
  };
}

