import { CouponProduct, PublicProductResponse } from '../types/product.types.js';

export interface AdminProductResponse extends PublicProductResponse {
  costPrice: number;
  createdAt: Date;
  isSold: boolean;
  marginPercentage: number;
  minimumSellPrice: number;
  type: string;
  updatedAt: Date;
  value: string;
  valueType: string;
}

export const mapProductToAdminResponse = (
  product: CouponProduct,
): AdminProductResponse => {
  return {
    costPrice: product.costPrice,
    createdAt: product.createdAt,
    description: product.description,
    id: product.id,
    imageUrl: product.imageUrl,
    isSold: product.isSold,
    marginPercentage: product.marginPercentage,
    minimumSellPrice: product.minimumSellPrice,
    name: product.name,
    price: product.minimumSellPrice,
    type: product.type,
    updatedAt: product.updatedAt,
    value: product.value,
    valueType: product.valueType,
  };
};

// Keep reseller-facing responses intentionally narrow so internal pricing fields never leak.
export const mapProductToPublicResponse = (
  product: CouponProduct,
): PublicProductResponse => {
  return {
    description: product.description,
    id: product.id,
    imageUrl: product.imageUrl,
    name: product.name,
    price: product.minimumSellPrice,
  };
};
