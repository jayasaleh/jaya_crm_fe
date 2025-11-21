/**
 * Lead Types
 * TypeScript types for lead-related data
 */

import { LEAD_STATUS, LEAD_SOURCE } from '../utils/constants';

export type LeadStatus = typeof LEAD_STATUS[keyof typeof LEAD_STATUS];
export type LeadSource = typeof LEAD_SOURCE[keyof typeof LEAD_SOURCE];

export interface Lead {
  id: number;
  name: string;
  contact: string;
  email: string | null;
  address: string;
  needs: string;
  source: LeadSource;
  status: LeadStatus;
  ownerId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeadRequest {
  name: string;
  contact: string;
  email?: string;
  address: string;
  needs: string;
  source: LeadSource;
  status?: LeadStatus;
}

export interface UpdateLeadRequest {
  name?: string;
  contact?: string;
  email?: string;
  address?: string;
  needs?: string;
  source?: LeadSource;
  status?: LeadStatus;
}

export interface LeadFilters {
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  page?: number;
  limit?: number;
}

export interface LeadsResponse {
  data: Lead[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

