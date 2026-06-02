import { Router } from 'express';
import type { ParamsDictionary } from 'express-serve-static-core';
import { purchaseProductController } from '../controllers/purchase.controller.js';
import {
  getResellerProductByIdController,
  listResellerProductsController,
} from '../controllers/reseller-product.controller.js';
import { authenticateMiddleware } from '../middlewares/authenticate.middleware.js';
import { authorizeRoleMiddleware } from '../middlewares/authorize-role.middleware.js';
import { validateRequestMiddleware } from '../middlewares/validate-request.middleware.js';
import {
  PurchaseProductInput,
  PurchaseProductResponse,
} from '../types/product.types.js';
import { validatePurchaseProduct } from '../validators/purchase.validator.js';
import { validateProductIdParam } from '../validators/product.validator.js';

interface ProductIdParams extends ParamsDictionary {
  productId: string;
}

const resellerRouter = Router();

// Scope reseller auth to reseller API paths so unrelated routes can pass through untouched.
resellerRouter.use(
  '/api/v1',
  authenticateMiddleware,
  authorizeRoleMiddleware('reseller'),
);

resellerRouter.get('/api/v1/products', listResellerProductsController);
resellerRouter.get<ProductIdParams>(
  '/api/v1/products/:productId',
  ...validateProductIdParam(),
  validateRequestMiddleware,
  getResellerProductByIdController,
);
resellerRouter.post<
  ProductIdParams,
  PurchaseProductResponse,
  PurchaseProductInput
>(
  '/api/v1/products/:productId/purchase',
  ...validateProductIdParam(),
  ...validatePurchaseProduct(),
  validateRequestMiddleware,
  purchaseProductController,
);

export { resellerRouter };
