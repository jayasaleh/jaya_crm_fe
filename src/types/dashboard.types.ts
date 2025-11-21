/**
 * Dashboard Types
 * TypeScript types for dashboard-related data
 */

export interface DashboardStats {
  leads: {
    total: number;
    byStatus: {
      NEW: number;
      CONTACTED: number;
      QUALIFIED: number;
      CONVERTED: number;
      LOST: number;
    };
  };
  deals: {
    total: number;
    byStatus: {
      DRAFT: number;
      WAITING_APPROVAL: number;
      APPROVED: number;
      REJECTED: number;
    };
  };
  customers: {
    total: number;
  };
  revenue: {
    total: number;
  };
  pendingApprovals: number;
  recentActivity: {
    leads: RecentLead[];
    deals: RecentDeal[];
  };
}

export interface RecentLead {
  id: number;
  name: string;
  status: string;
  createdAt: string;
}

export interface RecentDeal {
  id: number;
  dealNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  customer: {
    name: string;
  };
}

