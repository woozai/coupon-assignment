export enum ProductType {
  COUPON = 'COUPON',
}

export enum CouponValueType {
  IMAGE = 'IMAGE',
  STRING = 'STRING',
}

export interface BaseProduct {
  createdAt: Date;
  description: string;
  id: string;
  imageUrl: string;
  name: string;
  type: ProductType;
  updatedAt: Date;
}

export interface CouponProduct extends BaseProduct {
  costPrice: number;
  isSold: boolean;
  marginPercentage: number;
  minimumSellPrice: number;
  value: string;
  valueType: CouponValueType;
}

export interface CreateCouponInput {
  costPrice: number;
  description: string;
  imageUrl: string;
  marginPercentage: number;
  name: string;
  value: string;
  valueType: CouponValueType;
}

export interface UpdateCouponInput {
  costPrice?: number;
  description?: string;
  imageUrl?: string;
  marginPercentage?: number;
  name?: string;
  value?: string;
  valueType?: CouponValueType;
}

export interface PublicProductResponse {
  description: string;
  id: string;
  imageUrl: string;
  name: string;
  price: number;
}

export interface PurchaseProductInput {
  resellerPrice: number;
}

export interface PurchaseProductResponse {
  finalPrice: number;
  productId: string;
  value: string;
  valueType: CouponValueType;
}
