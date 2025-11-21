/**
 * Dashboard Hook
 * React hook for fetching dashboard statistics
 */

import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboard.service';
import { DashboardStats } from '../types/dashboard.types';

const DASHBOARD_QUERY_KEY = ['dashboard', 'stats'] as const;

/**
 * Hook for fetching dashboard statistics
 */
export function useDashboard() {
  const {
    data: stats,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<DashboardStats>({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: () => dashboardService.getStats(),
    staleTime: 30000, //  data fresh untuk 30 detik
    refetchOnWindowFocus: false,
  });

  return {
    stats,
    isLoading,
    isError,
    error,
    refetch,
  };
}

