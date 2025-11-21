/**
 * Dashboard Service
 * Service functions for dashboard operations
 */

import api from '../api/axios';
import { API_ENDPOINTS } from '../api/endpoints';
import { DashboardStats } from '../types/dashboard.types';

export const dashboardService = {
  /**
   * Get dashboard statistics
   * @returns Dashboard statistics (role-based)
   */
  async getStats(): Promise<DashboardStats> {
    // Backend returns: { code, status, message, data }
    const response = await api.get<{ code: number; status: string; message: string; data: DashboardStats }>(
      API_ENDPOINTS.DASHBOARD.STATS
    );
    
    return response.data;
  },
};

