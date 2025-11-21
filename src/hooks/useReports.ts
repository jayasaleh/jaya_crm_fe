import { useQuery, useMutation } from '@tanstack/react-query';
import { reportService } from '../services/report.service';
import { SalesReport, ReportFilters } from '../types/report.types';
import toast from 'react-hot-toast';

const REPORTS_QUERY_KEY = ['reports'] as const;

export function useSalesReport(filters?: ReportFilters | null) {
  const { data, isLoading, error } = useQuery({
    queryKey: [REPORTS_QUERY_KEY, 'sales', filters],
    queryFn: async () => {
      // If filters provided, use them; otherwise fetch all data
      const result = await reportService.getSalesReport(filters || undefined);
      // Ensure we always return a value
      if (!result) {
        throw new Error('Failed to fetch report data');
      }
      return result;
    },
    staleTime: 30000, // 30 seconds
  });

  return {
    report: data,
    isLoading,
    error,
  };
}

export function useDownloadSalesReportExcel() {
  return useMutation({
    mutationFn: async (filters: ReportFilters) => {
      // Validate that both dates are provided
      if (!filters.startDate || !filters.endDate) {
        throw new Error('Start date and end date are required for Excel export');
      }

      const blob = await reportService.downloadSalesReportExcel(filters);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename
      const filename = `Laporan_Penjualan_${filters.startDate}_sd_${filters.endDate}.xlsx`;
      link.setAttribute('download', filename);
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);
    },
    onSuccess: () => {
      toast.success('Excel report downloaded successfully!');
    },
    onError: (error: any) => {
      const errorMessage = error?.message || error?.response?.data?.message || 'Failed to download report.';
      toast.error(errorMessage);
    },
  });
}

