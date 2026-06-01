import { purchaseRepository } from '../repositories/purchase.repository.js';
import { productRepository } from '../repositories/product.repository.js';
import {
  PurchaseProductInput,
  PurchaseProductResponse,
} from '../types/product.types.js';
import { ApiError } from '../utils/api-error.js';
import { assertValidResellerPrice } from './pricing.service.js';

export const purchaseService = {
  purchaseProduct: async (
    productId: string,
    purchaseInput: PurchaseProductInput,
  ): Promise<PurchaseProductResponse> => {
    const existingProduct = await productRepository.findById(productId);

    if (!existingProduct) {
      throw new ApiError('Product not found.', 404, 'PRODUCT_NOT_FOUND');
    }

    const product = existingProduct.toObject();

    if (product.isSold) {
      throw new ApiError(
        'Product has already been sold.',
        409,
        'PRODUCT_ALREADY_SOLD',
      );
    }

    assertValidResellerPrice(
      purchaseInput.resellerPrice,
      product.minimumSellPrice,
    );

    const soldProduct = await purchaseRepository.markProductAsSold(productId);

    if (!soldProduct) {
      throw new ApiError(
        'Product has already been sold.',
        409,
        'PRODUCT_ALREADY_SOLD',
      );
    }

    // Return the redeemable value only after the atomic sold-state update succeeds.
    return {
      finalPrice: purchaseInput.resellerPrice,
      productId: soldProduct.id,
      value: soldProduct.value,
      valueType: soldProduct.valueType,
    };
  },
};
