import { purchaseRepository } from '../repositories/purchase.repository.js';
import { productRepository } from '../repositories/product.repository.js';
import {
  PurchaseProductInput,
  PurchaseProductResponse,
} from '../types/product.types.js';
import {
  createProductAlreadySoldError,
  createProductNotFoundError,
} from '../utils/domain-errors.js';
import { assertValidResellerPrice } from './pricing.service.js';

const getSellableProductOrThrow = async (productId: string) => {
  const existingProduct = await productRepository.findById(productId);

  if (!existingProduct) {
    throw createProductNotFoundError();
  }

  const product = existingProduct.toObject();

  if (product.isSold) {
    throw createProductAlreadySoldError();
  }

  return product;
};

export const purchaseService = {
  purchaseCustomerProduct: async (
    productId: string,
  ): Promise<PurchaseProductResponse> => {
    const product = await getSellableProductOrThrow(productId);
    const soldProduct = await purchaseRepository.markProductAsSold(productId);

    if (!soldProduct) {
      throw createProductAlreadySoldError();
    }

    return {
      finalPrice: product.minimumSellPrice,
      productId: soldProduct.id,
      value: soldProduct.value,
      valueType: soldProduct.valueType,
    };
  },

  purchaseProduct: async (
    productId: string,
    purchaseInput: PurchaseProductInput,
  ): Promise<PurchaseProductResponse> => {
    const product = await getSellableProductOrThrow(productId);

    assertValidResellerPrice(
      purchaseInput.resellerPrice,
      product.minimumSellPrice,
    );

    const soldProduct = await purchaseRepository.markProductAsSold(productId);

    if (!soldProduct) {
      throw createProductAlreadySoldError();
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
