import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import app from '../../app.js';
import { env } from '../../config/env.js';
import { productRepository } from '../../repositories/product.repository.js';
import {
  buildCouponProduct,
  buildProductDocument,
} from '../helpers/product-test-helpers.js';

const expectHiddenFieldsToBeAbsent = (
  responseBody: Record<string, unknown>,
): void => {
  expect(responseBody).not.toHaveProperty('costPrice');
  expect(responseBody).not.toHaveProperty('isSold');
  expect(responseBody).not.toHaveProperty('marginPercentage');
  expect(responseBody).not.toHaveProperty('minimumSellPrice');
  expect(responseBody).not.toHaveProperty('value');
  expect(responseBody).not.toHaveProperty('valueType');
};

describe('reseller product read routes', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation((): void => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns only public product fields in the reseller list response', async () => {
    const availableProduct = buildCouponProduct();

    vi.spyOn(productRepository, 'findAvailable').mockResolvedValue([
      buildProductDocument(availableProduct),
    ]);

    const response = await request(app)
      .get('/api/v1/products')
      .set('Authorization', `Bearer ${env.RESELLER_API_KEY}`);

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
    expectHiddenFieldsToBeAbsent(response.body[0] as Record<string, unknown>);
  });

  it('returns only public product fields in the reseller single-product response', async () => {
    const availableProduct = buildCouponProduct();

    vi.spyOn(productRepository, 'findById').mockResolvedValue(
      buildProductDocument(availableProduct),
    );

    const response = await request(app)
      .get(`/api/v1/products/${availableProduct.id}`)
      .set('Authorization', `Bearer ${env.RESELLER_API_KEY}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      description: availableProduct.description,
      id: availableProduct.id,
      imageUrl: availableProduct.imageUrl,
      name: availableProduct.name,
      price: availableProduct.minimumSellPrice,
    });
    expectHiddenFieldsToBeAbsent(response.body as Record<string, unknown>);
  });

  it('returns 404 for sold products so coupon value cannot be fetched before purchase', async () => {
    const soldProduct = buildCouponProduct({
      isSold: true,
    });

    vi.spyOn(productRepository, 'findById').mockResolvedValue(
      buildProductDocument(soldProduct),
    );

    const response = await request(app)
      .get(`/api/v1/products/${soldProduct.id}`)
      .set('Authorization', `Bearer ${env.RESELLER_API_KEY}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      errorCode: 'PRODUCT_NOT_FOUND',
      message: 'Product not found.',
    });
  });

  it('returns 401 when the reseller API key is invalid', async () => {
    const response = await request(app)
      .get('/api/v1/products')
      .set('Authorization', 'Bearer wrong-reseller-api-key');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      errorCode: 'UNAUTHORIZED',
      message: 'Invalid reseller API key.',
    });
  });
});
