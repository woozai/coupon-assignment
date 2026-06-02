import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import app from '../../app.js';
import { env } from '../../config/env.js';
import { authService } from '../../services/auth.service.js';

describe('app health and auth routes', () => {
  // Use real signed tokens here so these checks exercise the actual auth middleware path.
  const adminToken = authService.issueToken(
    'admin-local',
    'admin',
    'admin@example.com',
  );

  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation((): void => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns a healthy status from the health route', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  it('returns validation error for malformed admin login payloads', async () => {
    const response = await request(app).post('/api/admin/login').send({
      email: 'not-an-email',
      password: '',
    });

    expect(response.status).toBe(400);
    expect(response.body.errorCode).toBe('VALIDATION_ERROR');
  });

  it('returns unauthorized for invalid admin credentials', async () => {
    const response = await request(app).post('/api/admin/login').send({
      email: 'admin@example.com',
      password: 'wrong-password',
    });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      errorCode: 'UNAUTHORIZED',
      message: 'Invalid admin credentials.',
    });
  });

  it('returns unauthorized when an admin JWT hits reseller routes', async () => {
    const response = await request(app)
      .get('/api/v1/products')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      errorCode: 'UNAUTHORIZED',
      message: 'Invalid reseller API key.',
    });
  });

  it('returns unauthorized when a reseller API key hits admin routes', async () => {
    const response = await request(app)
      .get('/api/admin/products')
      .set('Authorization', `Bearer ${env.RESELLER_API_KEY}`);

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      errorCode: 'UNAUTHORIZED',
      message: 'Invalid authentication token.',
    });
  });
});
