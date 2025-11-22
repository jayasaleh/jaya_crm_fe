import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dealService } from '../services/deal.service';
import { CreateDealRequest, DealFilters, ApprovalActionRequest } from '../types/deal.types';
import toast from 'react-hot-toast';
import { PAGINATION } from '../utils/constants';

const DEALS_QUERY_KEY = ['deals'] as const;
const LEADS_QUERY_KEY = ['leads'] as const;
const DASHBOARD_QUERY_KEY = ['dashboard'] as const;
const CUSTOMERS_QUERY_KEY = ['customers'] as const;

export function useDeals(filters?: DealFilters) {
  const { data, isLoading, error } = useQuery({
    queryKey: [...DEALS_QUERY_KEY, filters],
    queryFn: () => dealService.getAll(filters),
    placeholderData: (previousData) => previousData,
  });

  return {
    deals: data?.data || [],
    pagination: data?.pagination || {
      page: PAGINATION.DEFAULT_PAGE,
      limit: PAGINATION.DEFAULT_LIMIT,
      total: 0,
      totalPages: 0,
    },
    isLoading,
    error,
  };
}

export function useDeal(id: number) {
  const { data, isLoading, error } = useQuery({
    queryKey: [...DEALS_QUERY_KEY, id],
    queryFn: () => dealService.getById(id),
    enabled: !!id,
  });

  return {
    deal: data,
    isLoading,
    error,
  };
}

/**
 * Invalidate all related queries after deal mutation
 */
function invalidateRelatedQueries(queryClient: ReturnType<typeof useQueryClient>) {
  // Invalidate deals queries (all filters)
  queryClient.invalidateQueries({ queryKey: DEALS_QUERY_KEY });
  // Invalidate leads queries (because lead status might change)
  queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY });
  // Invalidate dashboard stats (because stats change)
  queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
  // Invalidate customers queries (because new customer might be created or services activated)
  queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
}

export function useCreateDeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDealRequest) => dealService.create(data),
    onSuccess: () => {
      invalidateRelatedQueries(queryClient);
      toast.success('Deal created successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create deal.');
    },
  });
}

export function useSubmitDeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => dealService.submit(id),
    onSuccess: () => {
      invalidateRelatedQueries(queryClient);
      toast.success('Deal submitted for approval!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to submit deal.');
    },
  });
}

export function useApproveDeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data?: ApprovalActionRequest }) =>
      dealService.approve(id, data),
    onSuccess: () => {
      invalidateRelatedQueries(queryClient);
      toast.success('Deal approved successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to approve deal.');
    },
  });
}

export function useRejectDeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data?: ApprovalActionRequest }) =>
      dealService.reject(id, data),
    onSuccess: () => {
      invalidateRelatedQueries(queryClient);
      toast.success('Deal rejected.');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to reject deal.');
    },
  });
}

export function useActivateDeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => dealService.activate(id),
    onSuccess: () => {
      invalidateRelatedQueries(queryClient);
      toast.success('Deal services activated successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to activate deal services.');
    },
  });
}

