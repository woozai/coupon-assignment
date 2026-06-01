import { ApiError } from '../utils/api-error.js';
import {
  createProductNotFoundError,
} from '../utils/domain-errors.js';
import { productRepository } from '../repositories/product.repository.js';
import {
  CouponProduct,
  CreateCouponInput,
  UpdateCouponInput,
} from '../types/product.types.js';
import { calculateMinimumSellPrice } from './pricing.service.js';

// Reuse one fetch-or-throw helper so admin read, update, and delete flows behave consistently.
const getProductOrThrow = async (productId: string): Promise<CouponProduct> => {
  const existingProduct = await productRepository.findById(productId);

  if (!existingProduct) {
    throw createProductNotFoundError();
  }

  return existingProduct.toObject();
};

const buildUpdatePayload = (
  existingProduct: CouponProduct,
  productUpdate: UpdateCouponInput,
): UpdateCouponInput & { minimumSellPrice?: number } => {
  const nextCostPrice = productUpdate.costPrice ?? existingProduct.costPrice;
  const nextMarginPercentage =
    productUpdate.marginPercentage ?? existingProduct.marginPercentage;

  // Recalculate the minimum price whenever pricing inputs change so stored values stay in sync.
  if (
    productUpdate.costPrice !== undefined ||
    productUpdate.marginPercentage !== undefined
  ) {
    return {
      ...productUpdate,
      minimumSellPrice: calculateMinimumSellPrice(
        nextCostPrice,
        nextMarginPercentage,
      ),
    };
  }

  return productUpdate;
};

export const productService = {
  // Admin create flows are responsible for setting pricing inputs, but minimum price stays server-derived.
  createProduct: async (productInput: CreateCouponInput): Promise<CouponProduct> => {
    const minimumSellPrice = calculateMinimumSellPrice(
      productInput.costPrice,
      productInput.marginPercentage,
    );

    const createdProduct = await productRepository.create({
      ...productInput,
      minimumSellPrice,
    });

    return createdProduct.toObject();
  },

  deleteProductById: async (productId: string): Promise<CouponProduct> => {
    const deletedProduct = await productRepository.deleteById(productId);

    if (!deletedProduct) {
      throw createProductNotFoundError();
    }

    return deletedProduct.toObject();
  },

  getProductById: async (productId: string): Promise<CouponProduct> => {
    return getProductOrThrow(productId);
  },

  getAvailableProductById: async (productId: string): Promise<CouponProduct> => {
    const product = await getProductOrThrow(productId);

    if (product.isSold) {
      throw new ApiError('Product not found.', 404, 'PRODUCT_NOT_FOUND');
    }

    return product;
  },

  listProducts: async (): Promise<CouponProduct[]> => {
    const products = await productRepository.findAll();

    return products.map((productDocument) => productDocument.toObject());
  },

  // Reseller and customer browse flows should only receive products that are still unsold.
  listAvailableProducts: async (): Promise<CouponProduct[]> => {
    const products = await productRepository.findAvailable();

    return products.map((productDocument) => productDocument.toObject());
  },

  updateProductById: async (
    productId: string,
    productUpdate: UpdateCouponInput,
  ): Promise<CouponProduct> => {
    const existingProduct = await getProductOrThrow(productId);
    const updatePayload = buildUpdatePayload(existingProduct, productUpdate);
    const updatedProduct = await productRepository.updateById(
      productId,
      updatePayload,
    );

    if (!updatedProduct) {
      throw createProductNotFoundError();
    }

    return updatedProduct.toObject();
  },
};
