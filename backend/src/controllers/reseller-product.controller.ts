import type { Request, Response } from 'express';
import { mapProductToPublicResponse } from '../mappers/product-response.mapper.js';
import { productService } from '../services/product.service.js';
import { asyncHandler } from '../utils/async-handler.js';

interface ProductIdParams {
  productId: string;
}

// Keep reseller controllers thin so availability rules stay in the service layer.
export const getResellerProductByIdController = asyncHandler(
  async (
    request: Request<ProductIdParams>,
    response: Response,
  ): Promise<void> => {
    const product = await productService.getAvailableProductById(
      request.params.productId,
    );

    response.status(200).json(mapProductToPublicResponse(product));
  },
);

export const listResellerProductsController = asyncHandler(
  async (_request: Request, response: Response): Promise<void> => {
    const products = await productService.listAvailableProducts();

    response
      .status(200)
      .json(products.map((product) => mapProductToPublicResponse(product)));
  },
);
