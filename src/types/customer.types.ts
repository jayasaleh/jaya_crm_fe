import { SERVICE_STATUS } from '../utils/constants';

export interface Service {
  id: number;
  productId: number;
  customerId: number;
  monthlyFee: number;
  installationFee?: number;
  startDate: string;
  endDate?: string;
  status: typeof SERVICE_STATUS[keyof typeof SERVICE_STATUS];
  installationAddress?: string;
  installationNotes?: string;
  product: {
    id: number;
    name: string;
    description?: string;
    sellingPrice: number;
    speedMbps?: number;
    bandwidth?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: number;
  customerCode: string;
  name: string;
  contact?: string;
  email?: string;
  address?: string;
  city?: string;
  services?: Service[];
  createdAt: string;
  updatedAt: string;
}

export interface CustomerFilters {
  search?: string;
  page?: number;
  limit?: number;
}

