/**
 * API Endpoints Constants
 * Centralized location for all API endpoints
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: `${API_BASE}/auth/login`,
    REFRESH: `${API_BASE}/auth/refresh`,
  },
  
  // Leads
  LEADS: {
    LIST: `${API_BASE}/leads`,
    DETAIL: (id: number) => `${API_BASE}/leads/${id}`,
    CREATE: `${API_BASE}/leads`,
    UPDATE: (id: number) => `${API_BASE}/leads/${id}`,
    DELETE: (id: number) => `${API_BASE}/leads/${id}`,
    CONVERT: (id: number) => `${API_BASE}/leads/${id}/convert`,
  },
  
  // Products
  PRODUCTS: {
    LIST: `${API_BASE}/products`,
    DETAIL: (id: number) => `${API_BASE}/products/${id}`,
    CREATE: `${API_BASE}/products`,
    UPDATE: (id: number) => `${API_BASE}/products/${id}`,
    DELETE: (id: number) => `${API_BASE}/products/${id}`,
  },
  
  // Deals
  DEALS: {
    LIST: `${API_BASE}/deals`,
    DETAIL: (id: number) => `${API_BASE}/deals/${id}`,
    CREATE: `${API_BASE}/deals`,
    SUBMIT: (id: number) => `${API_BASE}/deals/${id}/submit`,
    ACTIVATE: (id: number) => `${API_BASE}/deals/${id}/activate`,
    APPROVE: (id: number) => `${API_BASE}/deals/${id}/approve`,
    REJECT: (id: number) => `${API_BASE}/deals/${id}/reject`,
  },
  
  // Customers
  CUSTOMERS: {
    LIST: `${API_BASE}/customers`,
    DETAIL: (id: number) => `${API_BASE}/customers/${id}`,
  },
  
  // Dashboard
  DASHBOARD: {
    STATS: `${API_BASE}/dashboard/stats`,
  },
  
  // Reports
  REPORTS: {
    SALES: `${API_BASE}/reports/sales`,
    SALES_EXCEL: `${API_BASE}/reports/sales.xlsx`,
  },
} as const;

