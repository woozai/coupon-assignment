import { apiClient } from '../lib/api-client';
import {
  PublicProductResponse,
  PurchaseProductRequest,
  PurchaseProductResponse,
} from '../types/product.types';

export const customerProductsService = {
  getProductById: async (
    accessToken: string,
    productId: string,
  ): Promise<PublicProductResponse> => {
    return apiClient.request<PublicProductResponse>(
      `/api/v1/products/${productId}`,
      {
        accessToken,
        method: 'GET',
      },
    );
  },

  listProducts: async (accessToken: string): Promise<PublicProductResponse[]> => {
    return apiClient.request<PublicProductResponse[]>('/api/v1/products', {
      accessToken,
      method: 'GET',
    });
  },

  purchaseProduct: async (
    accessToken: string,
    productId: string,
    purchaseInput: PurchaseProductRequest,
  ): Promise<PurchaseProductResponse> => {
    return apiClient.request<PurchaseProductResponse>(
      `/api/v1/products/${productId}/purchase`,
      {
        accessToken,
        body: purchaseInput,
        method: 'POST',
      },
    );
  },
};
