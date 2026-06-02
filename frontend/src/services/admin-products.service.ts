import { apiClient } from '../lib/api-client';
import {
  AdminProductResponse,
  CreateCouponRequest,
  UpdateCouponRequest,
} from '../types/product.types';

export const adminProductsService = {
  createProduct: async (
    accessToken: string,
    productInput: CreateCouponRequest,
  ): Promise<AdminProductResponse> => {
    return apiClient.request<AdminProductResponse>('/api/admin/products', {
      accessToken,
      body: productInput,
      method: 'POST',
    });
  },

  deleteProductById: async (
    accessToken: string,
    productId: string,
  ): Promise<AdminProductResponse> => {
    return apiClient.request<AdminProductResponse>(
      `/api/admin/products/${productId}`,
      {
        accessToken,
        method: 'DELETE',
      },
    );
  },

  getProductById: async (
    accessToken: string,
    productId: string,
  ): Promise<AdminProductResponse> => {
    return apiClient.request<AdminProductResponse>(
      `/api/admin/products/${productId}`,
      {
        accessToken,
        method: 'GET',
      },
    );
  },

  listProducts: async (accessToken: string): Promise<AdminProductResponse[]> => {
    return apiClient.request<AdminProductResponse[]>('/api/admin/products', {
      accessToken,
      method: 'GET',
    });
  },

  updateProductById: async (
    accessToken: string,
    productId: string,
    productUpdate: UpdateCouponRequest,
  ): Promise<AdminProductResponse> => {
    return apiClient.request<AdminProductResponse>(
      `/api/admin/products/${productId}`,
      {
        accessToken,
        body: productUpdate,
        method: 'PUT',
      },
    );
  },
};
