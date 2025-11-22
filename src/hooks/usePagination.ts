import { useState, useCallback } from "react";
import { PAGINATION } from "@/utils/constants";

interface UsePaginationOptions {
  initialPage?: number;
  initialLimit?: number;
}

export function usePagination({ 
  initialPage = PAGINATION.DEFAULT_PAGE, 
  initialLimit = PAGINATION.DEFAULT_LIMIT 
}: UsePaginationOptions = {}) {
  const [page, setPage] = useState(initialPage);
  const [limit] = useState(initialLimit);

  const goToPage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const goToFirstPage = useCallback(() => {
    setPage(1);
  }, []);

  const reset = useCallback(() => {
    setPage(initialPage);
  }, [initialPage]);

  return {
    page,
    limit,
    goToPage,
    goToFirstPage,
    reset,
  };
}

