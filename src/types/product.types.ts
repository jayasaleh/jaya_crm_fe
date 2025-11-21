export interface Product {
  id: number;
  code?: string;
  name: string;
  description?: string;
  hpp: number;
  marginPercent: number;
  sellingPrice: number;
  speedMbps?: number;
  bandwidth?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  hpp: number;
  marginPercent: number;
  speedMbps?: number;
  bandwidth?: string;
  isActive?: boolean;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  hpp?: number;
  marginPercent?: number;
  speedMbps?: number;
  bandwidth?: string;
  isActive?: boolean;
}

