import type { Request, Response } from 'express';
import { purchaseService } from '../services/purchase.service.js';
import { PurchaseProductInput, PurchaseProductResponse } from '../types/product.types.js';
import { asyncHandler } from '../utils/async-handler.js';

interface ProductIdParams {
  productId: string;
}

// Keep the purchase controller thin so sale rules and atomic behavior stay inside services.
export const purchaseProductController = asyncHandler<
  ProductIdParams,
  PurchaseProductResponse,
  PurchaseProductInput
>(
  async (
    request: Request<ProductIdParams, PurchaseProductResponse, PurchaseProductInput>,
    response: Response<PurchaseProductResponse>,
  ): Promise<void> => {
    const purchaseResult = await purchaseService.purchaseProduct(
      request.params.productId,
      request.body,
    );

    response.status(200).json(purchaseResult);
  },
);
