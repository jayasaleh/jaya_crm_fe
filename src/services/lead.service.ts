/**
 * Lead Service
 * Service functions for lead operations
 */

import api from '../api/axios';
import { API_ENDPOINTS } from '../api/endpoints';
import { CreateLeadRequest, UpdateLeadRequest, Lead, LeadsResponse, LeadFilters } from '../types/lead.types';

export const leadService = {
  /**
   * Get all leads with filters and pagination
   */
  async getAll(filters?: LeadFilters): Promise<LeadsResponse> {
    const response = await api.get<{ code: number; status: string; message: string; data: LeadsResponse }>(
      API_ENDPOINTS.LEADS.LIST,
      { params: filters }
    );
    
    return response.data;
  },

  /**
   * Get lead by ID
   */
  async getById(id: number): Promise<Lead> {
    const response = await api.get<{ code: number; status: string; message: string; data: Lead }>(
      API_ENDPOINTS.LEADS.DETAIL(id)
    );
    
    return response.data;
  },

  /**
   * Create new lead
   */
  async create(data: CreateLeadRequest): Promise<Lead> {
    const response = await api.post<{ code: number; status: string; message: string; data: Lead }>(
      API_ENDPOINTS.LEADS.CREATE,
      data
    );
    
    return response.data;
  },

  /**
   * Update lead
   */
  async update(id: number, data: UpdateLeadRequest): Promise<Lead> {
    const response = await api.patch<{ code: number; status: string; message: string; data: Lead }>(
      API_ENDPOINTS.LEADS.UPDATE(id),
      data
    );
    
    return response.data;
  },

  /**
   * Delete lead
   */
  async delete(id: number): Promise<void> {
    await api.delete(API_ENDPOINTS.LEADS.DELETE(id));
  },
};

