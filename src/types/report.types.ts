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

export interface LeadReport {
  period: {
    startDate: string;
    endDate: string;
  };
  summary: {
    total: number;
    byStatus: {
      NEW: number;
      CONTACTED: number;
      QUALIFIED: number;
      CONVERTED: number;
      LOST: number;
    };
  };
  leads: {
    id: number;
    name: string;
    contact: string;
    email: string | null;
    address: string;
    needs: string;
    source: string;
    status: string;
    createdAt: string;
    owner: {
      id: number;
      name: string;
      email: string;
    };
  }[];
}

export interface CustomerReport {
  period: {
    startDate: string;
    endDate: string;
  };
  summary: {
    totalCustomers: number;
    totalServices: number;
    totalRevenue: number;
  };
  customers: {
    id: number;
    name: string;
    customerCode: string | null;
    contact: string;
    email: string | null;
    address: string;
    createdAt: string;
    services: {
      id: number;
      product: {
        name: string;
        speedMbps: number | null;
      };
      monthlyFee: number;
      status: string;
      startDate: string;
    }[];
  }[];
}

export interface ReportFilters {
  startDate?: string;
  endDate?: string;
}

