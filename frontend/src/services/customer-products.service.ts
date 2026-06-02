import { apiClient } from '../lib/api-client';
import {
  PublicProductResponse,
  PurchaseProductResponse,
} from '../types/product.types';

export const customerProductsService = {
  getProductById: async (productId: string): Promise<PublicProductResponse> => {
    return apiClient.request<PublicProductResponse>(`/api/products/${productId}`, {
      method: 'GET',
    });
  },

  listProducts: async (): Promise<PublicProductResponse[]> => {
    return apiClient.request<PublicProductResponse[]>('/api/products', {
      method: 'GET',
    });
  },

  purchaseProduct: async (productId: string): Promise<PurchaseProductResponse> => {
    return apiClient.request<PurchaseProductResponse>(
      `/api/products/${productId}/purchase`,
      {
        method: 'POST',
      },
    );
  },
};
