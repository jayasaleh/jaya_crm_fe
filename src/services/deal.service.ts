import api from '../api/axios';
import { API_ENDPOINTS } from '../api/endpoints';
import { ApiResponse, PaginatedResponse } from '../types/api.types';
import { Deal, CreateDealRequest, DealFilters, ApprovalActionRequest } from '../types/deal.types';

export const dealService = {
  getAll: async (filters?: DealFilters): Promise<PaginatedResponse<Deal>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Deal>>>(
      API_ENDPOINTS.DEALS.LIST,
      { params: filters }
    );
    return response.data;
  },

  getById: async (id: number): Promise<Deal> => {
    const response = await api.get<ApiResponse<Deal>>(API_ENDPOINTS.DEALS.DETAIL(id));
    return response.data;
  },

  create: async (data: CreateDealRequest): Promise<Deal> => {
    const response = await api.post<ApiResponse<Deal>>(API_ENDPOINTS.DEALS.CREATE, data);
    return response.data;
  },

  submit: async (id: number): Promise<Deal> => {
    const response = await api.patch<ApiResponse<Deal>>(API_ENDPOINTS.DEALS.SUBMIT(id));
    return response.data;
  },

  approve: async (id: number, data?: ApprovalActionRequest): Promise<Deal> => {
    const response = await api.patch<ApiResponse<Deal>>(API_ENDPOINTS.DEALS.APPROVE(id), data);
    return response.data;
  },

  reject: async (id: number, data?: ApprovalActionRequest): Promise<Deal> => {
    const response = await api.patch<ApiResponse<Deal>>(API_ENDPOINTS.DEALS.REJECT(id), data);
    return response.data;
  },

  activate: async (id: number): Promise<Deal> => {
    const response = await api.post<ApiResponse<Deal>>(API_ENDPOINTS.DEALS.ACTIVATE(id));
    return response.data;
  },
};

