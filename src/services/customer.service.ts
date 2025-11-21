import api from '../api/axios';
import { API_ENDPOINTS } from '../api/endpoints';
import { ApiResponse, PaginatedResponse } from '../types/api.types';
import { Customer, CustomerFilters } from '../types/customer.types';

export const customerService = {
  getAll: async (filters?: CustomerFilters): Promise<PaginatedResponse<Customer>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Customer>>>(
      API_ENDPOINTS.CUSTOMERS.LIST,
      {
        params: filters,
      }
    );
    return response.data;
  },

  getById: async (id: number): Promise<Customer> => {
    const response = await api.get<ApiResponse<Customer>>(
      API_ENDPOINTS.CUSTOMERS.DETAIL(id)
    );
    return response.data;
  },
};

