import { Types } from 'mongoose';
import { ProductDocument } from '../../models/product.model.js';
import {
  CouponProduct,
  CouponValueType,
  ProductType,
} from '../../types/product.types.js';

export const buildCouponProduct = (
  overrides?: Partial<CouponProduct>,
): CouponProduct => {
  const now = new Date('2026-06-02T00:00:00.000Z');

  return {
    costPrice: 80,
    createdAt: now,
    description: 'Steam gift card',
    id: new Types.ObjectId().toString(),
    imageUrl: 'https://example.com/coupon.png',
    isSold: false,
    marginPercentage: 25,
    minimumSellPrice: 100,
    name: 'Steam Coupon',
    type: ProductType.COUPON,
    updatedAt: now,
    value: 'STEAM-CODE-123',
    valueType: CouponValueType.STRING,
    ...overrides,
  };
};

export const buildProductDocument = (
  product: CouponProduct,
): ProductDocument => {
  return {
    toObject: () => product,
  } as unknown as ProductDocument;
};

export const buildSoldProductDocument = (
  product: CouponProduct,
): ProductDocument => {
  return {
    id: product.id,
    value: product.value,
    valueType: product.valueType,
  } as unknown as ProductDocument;
};
