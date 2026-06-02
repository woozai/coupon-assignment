import { Types } from 'mongoose';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import app from '../../app.js';
import { productRepository } from '../../repositories/product.repository.js';
import { purchaseRepository } from '../../repositories/purchase.repository.js';
import { authService } from '../../services/auth.service.js';
import { CouponValueType } from '../../types/product.types.js';
import {
  buildCouponProduct,
  buildProductDocument,
  buildSoldProductDocument,
} from '../helpers/product-test-helpers.js';

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
      buildProductDocument(soldProduct),
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
      buildProductDocument(availableProduct),
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
      buildProductDocument(availableProduct),
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
