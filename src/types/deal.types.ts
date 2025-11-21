import { DEAL_STATUS } from '../utils/constants';

export interface DealItem {
  id: number;
  productId: number;
  quantity: number;
  agreedPrice: number;
  standardPrice: number;
  subtotal: number;
  needsApproval: boolean;
  product: {
    name: string;
    sellingPrice: number;
  };
}

export interface Deal {
  id: number;
  dealNumber: string;
  title?: string;
  status: typeof DEAL_STATUS[keyof typeof DEAL_STATUS];
  totalAmount: number;
  needsApproval: boolean;
  ownerId: number;
  customerId: number;
  leadId?: number;
  activatedAt?: string;
  customer: {
    name: string;
    customerCode: string;
  };
  owner: {
    name: string;
    email: string;
  };
  items: DealItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateDealRequest {
  leadId?: number;
  customerId?: number;
  title?: string;
  items: {
    productId: number;
    agreedPrice: number;
    quantity: number;
  }[];
}

export interface DealFilters {
  status?: typeof DEAL_STATUS[keyof typeof DEAL_STATUS];
  page?: number;
  limit?: number;
}

export interface ApprovalActionRequest {
  note?: string;
}

