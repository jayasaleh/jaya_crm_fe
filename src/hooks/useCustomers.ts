import { useQuery } from '@tanstack/react-query';
import { customerService } from '../services/customer.service';
import { CustomerFilters } from '../types/customer.types';
import { PAGINATION } from '../utils/constants';

const CUSTOMERS_QUERY_KEY = ['customers'] as const;

export function useCustomers(filters?: CustomerFilters) {
  const { data, isLoading, error } = useQuery({
    queryKey: [CUSTOMERS_QUERY_KEY, filters],
    queryFn: () => customerService.getAll(filters),
    placeholderData: (previousData) => previousData,
  });

  return {
    customers: data?.data || [],
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

export function useCustomer(id: number) {
  const { data, isLoading, error } = useQuery({
    queryKey: [CUSTOMERS_QUERY_KEY, id],
    queryFn: () => customerService.getById(id),
    enabled: !!id,
  });

  return {
    customer: data,
    isLoading,
    error,
  };
}

