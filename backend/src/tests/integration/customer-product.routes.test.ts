import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import app from '../../app.js';
import { productRepository } from '../../repositories/product.repository.js';
import { purchaseRepository } from '../../repositories/purchase.repository.js';
import {
  buildCouponProduct,
  buildProductDocument,
  buildSoldProductDocument,
} from '../helpers/product-test-helpers.js';

describe('customer product routes', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation((): void => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('lists public unsold products without requiring authentication', async () => {
    const availableProduct = buildCouponProduct();

    vi.spyOn(productRepository, 'findAvailable').mockResolvedValue([
      buildProductDocument(availableProduct),
    ]);

    const response = await request(app).get('/api/products');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        description: availableProduct.description,
        id: availableProduct.id,
        imageUrl: availableProduct.imageUrl,
        name: availableProduct.name,
        price: availableProduct.minimumSellPrice,
      },
    ]);
  });

  it('returns validation error for an invalid customer product id', async () => {
    const response = await request(app).get('/api/products/not-a-mongo-id');

    expect(response.status).toBe(400);
    expect(response.body.errorCode).toBe('VALIDATION_ERROR');
  });

  it('returns the coupon value only after successful customer purchase', async () => {
    const availableProduct = buildCouponProduct({
      value: 'CUSTOMER-CODE-789',
    });

    vi.spyOn(productRepository, 'findById').mockResolvedValue(
      buildProductDocument(availableProduct),
    );
    vi.spyOn(purchaseRepository, 'markProductAsSold').mockResolvedValue(
      buildSoldProductDocument(availableProduct),
    );

    const response = await request(app).post(
      `/api/products/${availableProduct.id}/purchase`,
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      finalPrice: availableProduct.minimumSellPrice,
      productId: availableProduct.id,
      value: 'CUSTOMER-CODE-789',
      valueType: availableProduct.valueType,
    });
  });
});
