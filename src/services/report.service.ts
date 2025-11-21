import api from '../api/axios';
import { API_ENDPOINTS } from '../api/endpoints';
import { ApiResponse } from '../types/api.types';
import { SalesReport, ReportFilters } from '../types/report.types';

export const reportService = {
  getSalesReport: async (filters?: ReportFilters): Promise<SalesReport> => {
    const params: any = {};
    if (filters?.startDate) params.startDate = filters.startDate;
    if (filters?.endDate) params.endDate = filters.endDate;

    const response = await api.get<ApiResponse<SalesReport>>(
      API_ENDPOINTS.REPORTS.SALES,
      { params }
    );
    
    // Axios interceptor returns response.data which is ApiResponse<T>
    // ApiResponse structure: { success, message, data }
    // So we need response.data to get the actual SalesReport
    if (!response) {
      throw new Error('Invalid response from server');
    }
    
    // response is ApiResponse<SalesReport> from interceptor
    // response.data is SalesReport (optional in ApiResponse)
    const reportData = (response as any).data;
    if (reportData && reportData.period && reportData.summary) {
      return reportData as SalesReport;
    }
    
    throw new Error('No data received from server');
  },

  downloadSalesReportExcel: async (filters: ReportFilters): Promise<Blob> => {
    // Excel export requires both dates
    if (!filters.startDate || !filters.endDate) {
      throw new Error('Start date and end date are required for Excel export');
    }

    try {
      const response = await api.get(
        API_ENDPOINTS.REPORTS.SALES_EXCEL,
        {
          params: {
            startDate: filters.startDate,
            endDate: filters.endDate,
          },
          responseType: 'blob', // Important for file download
        }
      );
      
      // For blob responses, axios interceptor returns the blob directly
      // response is already the Blob from interceptor
      if (!response) {
        throw new Error('No response from server');
      }
      
      // Check if response is a Blob
      if (response instanceof Blob) {
        return response;
      }
      
      // If not a Blob, might be an error response
      throw new Error('Invalid response format from server');
    } catch (error: any) {
      // Re-throw with more context
      if (error.message) {
        throw error;
      }
      throw new Error('Failed to download Excel report');
    }
  },
};

