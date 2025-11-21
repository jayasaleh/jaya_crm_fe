import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../services/product.service';
import { CreateProductRequest, UpdateProductRequest } from '../types/product.types';
import toast from 'react-hot-toast';

const PRODUCTS_QUERY_KEY = ['products'] as const;

export function useProducts() {
  const { data, isLoading, error } = useQuery({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: () => productService.getAll(),
  });

  return {
    products: data || [],
    isLoading,
    error,
  };
}

export function useProduct(id: number) {
  const { data, isLoading, error } = useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, id],
    queryFn: () => productService.getById(id),
    enabled: !!id,
  });

  return {
    product: data,
    isLoading,
    error,
  };
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProductRequest) => productService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      toast.success('Product created successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create product.');
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProductRequest }) =>
      productService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      toast.success('Product updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update product.');
    },
  });
}

export function useDeactivateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => productService.deactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      toast.success('Product deactivated successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to deactivate product.');
    },
  });
}

