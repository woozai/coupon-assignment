import { apiClient } from '../lib/api-client';
import {
  PublicProductResponse,
  PurchaseProductResponse,
} from '../types/product.types';

export const customerProductsService = {
  // Call the public product endpoints so the caller does not need to manage auth headers.
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
        // This endpoint derives the final price server-side, so the request does not send a body.
        method: 'POST',
      },
    );
  },
};
