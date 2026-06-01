export enum ProductType {
  COUPON = 'COUPON',
}

export enum CouponValueType {
  IMAGE = 'IMAGE',
  STRING = 'STRING',
}

// Keep the shared domain types in one place so models, services, and APIs stay aligned.
export interface BaseProduct {
  createdAt: Date;
  description: string;
  id: string;
  imageUrl: string;
  name: string;
  type: ProductType;
  updatedAt: Date;
}

// This is the full internal coupon shape, including fields that should stay hidden from public APIs.
export interface CouponProduct extends BaseProduct {
  costPrice: number;
  isSold: boolean;
  marginPercentage: number;
  minimumSellPrice: number;
  value: string;
  valueType: CouponValueType;
}

// Admin create input includes internal pricing and coupon value because admins manage source data.
export interface CreateCouponInput {
  costPrice: number;
  description: string;
  imageUrl: string;
  marginPercentage: number;
  name: string;
  value: string;
  valueType: CouponValueType;
}

// Update input stays partial so admin edit flows can patch only the changed fields.
export interface UpdateCouponInput {
  costPrice?: number;
  description?: string;
  imageUrl?: string;
  marginPercentage?: number;
  name?: string;
  value?: string;
  valueType?: CouponValueType;
}

// Public product responses expose only the fields reseller and customer clients should see.
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

// Purchase success responses include the redeemable value only after the sale is complete.
export interface PurchaseProductResponse {
  finalPrice: number;
  productId: string;
  value: string;
  valueType: CouponValueType;
}
