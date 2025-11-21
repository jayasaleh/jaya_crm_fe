import api from '../api/axios';
import { API_ENDPOINTS } from '../api/endpoints';
import { ApiResponse } from '../types/api.types';
import { Product, CreateProductRequest, UpdateProductRequest } from '../types/product.types';

export const productService = {
  getAll: async (): Promise<Product[]> => {
    const response = await api.get<ApiResponse<Product[]>>(API_ENDPOINTS.PRODUCTS.LIST);
    return response.data;
  },

  getById: async (id: number): Promise<Product> => {
    const response = await api.get<ApiResponse<Product>>(API_ENDPOINTS.PRODUCTS.DETAIL(id));
    return response.data;
  },

  create: async (data: CreateProductRequest): Promise<Product> => {
    const response = await api.post<ApiResponse<Product>>(API_ENDPOINTS.PRODUCTS.CREATE, data);
    return response.data;
  },

  update: async (id: number, data: UpdateProductRequest): Promise<Product> => {
    const response = await api.patch<ApiResponse<Product>>(API_ENDPOINTS.PRODUCTS.UPDATE(id), data);
    return response.data;
  },

  deactivate: async (id: number): Promise<void> => {
    await api.delete<ApiResponse<void>>(API_ENDPOINTS.PRODUCTS.DELETE(id));
  },
};

