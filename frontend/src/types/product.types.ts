export type CouponValueType = 'IMAGE' | 'STRING';

export type ProductType = 'COUPON';

export interface AdminProductResponse {
  costPrice: number;
  createdAt: string;
  description: string;
  id: string;
  imageUrl: string;
  isSold: boolean;
  marginPercentage: number;
  minimumSellPrice: number;
  name: string;
  price: number;
  type: ProductType;
  updatedAt: string;
  value: string;
  valueType: CouponValueType;
}

export interface CreateCouponRequest {
  costPrice: number;
  description: string;
  imageUrl: string;
  marginPercentage: number;
  name: string;
  value: string;
  valueType: CouponValueType;
}

export interface PublicProductResponse {
  description: string;
  id: string;
  imageUrl: string;
  name: string;
  price: number;
}

export interface PurchaseProductRequest {
  resellerPrice: number;
}

export interface PurchaseProductResponse {
  finalPrice: number;
  productId: string;
  value: string;
  valueType: CouponValueType;
}

export interface UpdateCouponRequest {
  costPrice?: number;
  description?: string;
  imageUrl?: string;
  marginPercentage?: number;
  name?: string;
  value?: string;
  valueType?: CouponValueType;
}
