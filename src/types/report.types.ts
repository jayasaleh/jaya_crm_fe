export interface SalesReport {
  period: {
    startDate: string;
    endDate: string;
  };
  summary: {
    totalLeads: number;
    convertedLeads: number;
    conversionRate: string;
    totalDeals: number;
    approvedDeals: number;
    totalRevenue: number;
  };
  topProducts: {
    productId: number;
    name: string;
    sold: number;
    revenue: number;
  }[];
}

export interface ReportFilters {
  startDate?: string;
  endDate?: string;
}

