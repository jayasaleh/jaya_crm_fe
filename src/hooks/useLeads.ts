/**
 * Leads Hook
 * React hook for lead operations with React Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadService } from '../services/lead.service';
import { Lead, CreateLeadRequest, UpdateLeadRequest, LeadFilters } from '../types/lead.types';
import toast from 'react-hot-toast';

const LEADS_QUERY_KEY = ['leads'] as const;

/**
 * Hook for fetching leads with filters
 */
export function useLeads(filters?: LeadFilters) {
  return useQuery({
    queryKey: [...LEADS_QUERY_KEY, filters],
    queryFn: () => leadService.getAll(filters),
    staleTime: 30000, // 30 seconds
  });
}

/**
 * Hook for fetching single lead
 */
export function useLead(id: number) {
  return useQuery({
    queryKey: [...LEADS_QUERY_KEY, id],
    queryFn: () => leadService.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook for creating lead
 */
export function useCreateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLeadRequest) => leadService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY });
      toast.success('Lead created successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to create lead';
      toast.error(message);
    },
  });
}

/**
 * Hook for updating lead
 */
export function useUpdateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateLeadRequest }) =>
      leadService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY });
      toast.success('Lead updated successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to update lead';
      toast.error(message);
    },
  });
}

/**
 * Hook for deleting lead
 */
export function useDeleteLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => leadService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY });
      toast.success('Lead deleted successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to delete lead';
      toast.error(message);
    },
  });
}

