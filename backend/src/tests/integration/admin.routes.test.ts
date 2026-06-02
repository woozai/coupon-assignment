import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import app from '../../app.js';
import { productRepository } from '../../repositories/product.repository.js';
import { authService } from '../../services/auth.service.js';
import {
  buildCouponProduct,
  buildProductDocument,
} from '../helpers/product-test-helpers.js';

describe('admin routes', () => {
  const adminToken = authService.issueToken('admin-local', 'admin', 'admin@example.com');

  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation((): void => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('logs in the admin with env-backed credentials', async () => {
    const response = await request(app).post('/api/admin/login').send({
      email: 'admin@example.com',
      password: 'admin123',
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('rejects unauthenticated admin product access', async () => {
    const response = await request(app).get('/api/admin/products');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      errorCode: 'UNAUTHORIZED',
      message: 'Missing authorization header.',
    });
  });

  it('returns validation error for invalid admin create payloads', async () => {
    const response = await request(app)
      .post('/api/admin/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: '',
      });

    expect(response.status).toBe(400);
    expect(response.body.errorCode).toBe('VALIDATION_ERROR');
  });

  it('lists admin products with internal pricing fields', async () => {
    const product = buildCouponProduct();

    vi.spyOn(productRepository, 'findAll').mockResolvedValue([
      buildProductDocument(product),
    ]);

    const response = await request(app)
      .get('/api/admin/products')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body[0]).toMatchObject({
      costPrice: product.costPrice,
      id: product.id,
      marginPercentage: product.marginPercentage,
      minimumSellPrice: product.minimumSellPrice,
      value: product.value,
    });
  });

  it('creates a product and returns admin-only pricing fields', async () => {
    const createdProduct = buildCouponProduct({
      minimumSellPrice: 150,
      name: 'Created coupon',
      value: 'CREATED-CODE-111',
    });

    vi.spyOn(productRepository, 'create').mockResolvedValue(
      buildProductDocument(createdProduct),
    );

    const response = await request(app)
      .post('/api/admin/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        costPrice: 120,
        description: createdProduct.description,
        imageUrl: createdProduct.imageUrl,
        marginPercentage: 25,
        name: createdProduct.name,
        value: createdProduct.value,
        valueType: createdProduct.valueType,
      });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      costPrice: createdProduct.costPrice,
      minimumSellPrice: createdProduct.minimumSellPrice,
      name: 'Created coupon',
      value: 'CREATED-CODE-111',
    });
  });

  it('updates a product and returns recalculated admin fields', async () => {
    const existingProduct = buildCouponProduct({
      id: '666666666666666666666666',
      minimumSellPrice: 100,
    });
    const updatedProduct = buildCouponProduct({
      id: existingProduct.id,
      costPrice: 100,
      marginPercentage: 50,
      minimumSellPrice: 150,
      name: 'Updated coupon',
    });

    vi.spyOn(productRepository, 'findById').mockResolvedValue(
      buildProductDocument(existingProduct),
    );
    vi.spyOn(productRepository, 'updateById').mockResolvedValue(
      buildProductDocument(updatedProduct),
    );

    const response = await request(app)
      .put(`/api/admin/products/${existingProduct.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        costPrice: 100,
        marginPercentage: 50,
        name: 'Updated coupon',
      });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      marginPercentage: 50,
      minimumSellPrice: 150,
      name: 'Updated coupon',
    });
  });

  it('deletes a product and returns the deleted admin record', async () => {
    const product = buildCouponProduct({
      id: '777777777777777777777777',
    });

    vi.spyOn(productRepository, 'deleteById').mockResolvedValue(
      buildProductDocument(product),
    );

    const response = await request(app)
      .delete(`/api/admin/products/${product.id}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: product.id,
      value: product.value,
    });
  });
});
