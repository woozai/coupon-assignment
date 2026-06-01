import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/async-handler.js';
import { productService } from '../services/product.service.js';
import {
  CreateCouponInput,
  UpdateCouponInput,
} from '../types/product.types.js';

interface ProductIdParams {
  productId: string;
}

// Keep controllers thin so request handling stays separate from domain and persistence logic.
export const createAdminProductController = asyncHandler(
  async (
    request: Request<Record<string, never>, unknown, CreateCouponInput>,
    response: Response,
  ): Promise<void> => {
    const createdProduct = await productService.createProduct(request.body);

    response.status(201).json(createdProduct);
  },
);

export const deleteAdminProductController = asyncHandler(
  async (
    request: Request<ProductIdParams>,
    response: Response,
  ): Promise<void> => {
    const deletedProduct = await productService.deleteProductById(
      request.params.productId,
    );

    response.status(200).json(deletedProduct);
  },
);

export const getAdminProductByIdController = asyncHandler(
  async (
    request: Request<ProductIdParams>,
    response: Response,
  ): Promise<void> => {
    const product = await productService.getProductById(request.params.productId);

    response.status(200).json(product);
  },
);

export const listAdminProductsController = asyncHandler(
  async (_request: Request, response: Response): Promise<void> => {
    const products = await productService.listProducts();

    response.status(200).json(products);
  },
);

export const updateAdminProductController = asyncHandler(
  async (
    request: Request<ProductIdParams, unknown, UpdateCouponInput>,
    response: Response,
  ): Promise<void> => {
    const updatedProduct = await productService.updateProductById(
      request.params.productId,
      request.body,
    );

    response.status(200).json(updatedProduct);
  },
);
