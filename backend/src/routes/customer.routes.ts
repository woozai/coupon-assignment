import { Router } from 'express';
import type { ParamsDictionary } from 'express-serve-static-core';
import { purchaseCustomerProductController } from '../controllers/purchase.controller.js';
import {
  getCustomerProductByIdController,
  listCustomerProductsController,
} from '../controllers/customer-product.controller.js';
import { validateRequestMiddleware } from '../middlewares/validate-request.middleware.js';
import { validateProductIdParam } from '../validators/product.validator.js';

interface ProductIdParams extends ParamsDictionary {
  productId: string;
}

const customerRouter = Router();

// Keep these routes public so the frontend can browse and purchase without JWT middleware.
customerRouter.get('/api/products', listCustomerProductsController);
customerRouter.get<ProductIdParams>(
  '/api/products/:productId',
  ...validateProductIdParam(),
  validateRequestMiddleware,
  getCustomerProductByIdController,
);
customerRouter.post<ProductIdParams>(
  '/api/products/:productId/purchase',
  ...validateProductIdParam(),
  validateRequestMiddleware,
  purchaseCustomerProductController,
);

export { customerRouter };
