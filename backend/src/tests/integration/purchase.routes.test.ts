import { Types } from 'mongoose';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import app from '../../app.js';
import { ProductDocument } from '../../models/product.model.js';
import { productRepository } from '../../repositories/product.repository.js';
import { purchaseRepository } from '../../repositories/purchase.repository.js';
import { authService } from '../../services/auth.service.js';
import { CouponProduct, CouponValueType, ProductType } from '../../types/product.types.js';

const buildCouponProduct = (overrides?: Partial<CouponProduct>): CouponProduct => {
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

const buildFindByIdDocument = (product: CouponProduct): ProductDocument => {
  // Keep the mocked document surface small and focused on what the purchase service reads.
  return {
    toObject: () => product,
  } as unknown as ProductDocument;
};

const buildSoldProductDocument = (product: CouponProduct): ProductDocument => {
  return {
    id: product.id,
    value: product.value,
    valueType: product.valueType,
  } as unknown as ProductDocument;
};

describe('POST /api/v1/products/:productId/purchase', () => {
  const resellerToken = authService.issueToken('reseller-local', 'reseller');
  const routeProductId = new Types.ObjectId().toString();

  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation((): void => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns 401 when the reseller JWT is missing', async () => {
    const response = await request(app)
      .post(`/api/v1/products/${routeProductId}/purchase`)
      .send({
        resellerPrice: 120,
      });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      errorCode: 'UNAUTHORIZED',
      message: 'Missing authorization header.',
    });
  });

  it('returns 409 when the product has already been sold', async () => {
    const soldProduct = buildCouponProduct({
      id: routeProductId,
      isSold: true,
    });

    vi.spyOn(productRepository, 'findById').mockResolvedValue(
      buildFindByIdDocument(soldProduct),
    );
    const markProductAsSoldSpy = vi
      .spyOn(purchaseRepository, 'markProductAsSold')
      .mockResolvedValue(null);

    const response = await request(app)
      .post(`/api/v1/products/${routeProductId}/purchase`)
      .set('Authorization', `Bearer ${resellerToken}`)
      .send({
        resellerPrice: 120,
      });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({
      errorCode: 'PRODUCT_ALREADY_SOLD',
      message: 'Product has already been sold.',
    });
    expect(markProductAsSoldSpy).not.toHaveBeenCalled();
  });

  it('returns 400 when the reseller price is below the minimum sell price', async () => {
    const availableProduct = buildCouponProduct({
      id: routeProductId,
      minimumSellPrice: 150,
    });

    vi.spyOn(productRepository, 'findById').mockResolvedValue(
      buildFindByIdDocument(availableProduct),
    );
    const markProductAsSoldSpy = vi
      .spyOn(purchaseRepository, 'markProductAsSold')
      .mockResolvedValue(null);

    const response = await request(app)
      .post(`/api/v1/products/${routeProductId}/purchase`)
      .set('Authorization', `Bearer ${resellerToken}`)
      .send({
        resellerPrice: 149.99,
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      errorCode: 'RESELLER_PRICE_TOO_LOW',
      message:
        'Reseller price must be greater than or equal to the minimum sell price.',
    });
    expect(markProductAsSoldSpy).not.toHaveBeenCalled();
  });

  it('returns 200 and coupon value when the purchase succeeds', async () => {
    const availableProduct = buildCouponProduct({
      id: routeProductId,
      minimumSellPrice: 110,
      value: 'SUCCESS-CODE-456',
    });

    vi.spyOn(productRepository, 'findById').mockResolvedValue(
      buildFindByIdDocument(availableProduct),
    );
    vi.spyOn(purchaseRepository, 'markProductAsSold').mockResolvedValue(
      buildSoldProductDocument(availableProduct),
    );

    const response = await request(app)
      .post(`/api/v1/products/${routeProductId}/purchase`)
      .set('Authorization', `Bearer ${resellerToken}`)
      .send({
        resellerPrice: 120,
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      finalPrice: 120,
      productId: routeProductId,
      value: 'SUCCESS-CODE-456',
      valueType: CouponValueType.STRING,
    });
  });
});
