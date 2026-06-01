import type { NextFunction, Request, Response } from 'express';
import { Router } from 'express';
import type { Request as TypedRequest } from 'express';
import {
  getResellerProductByIdController,
  listResellerProductsController,
} from '../controllers/reseller-product.controller.js';
import { authenticateMiddleware } from '../middlewares/authenticate.middleware.js';
import { authorizeRoleMiddleware } from '../middlewares/authorize-role.middleware.js';
import { validateRequestMiddleware } from '../middlewares/validate-request.middleware.js';
import { validateProductIdParam } from '../validators/product.validator.js';

interface ProductIdParams {
  productId: string;
}

const resellerRouter = Router();

resellerRouter.use(authenticateMiddleware, authorizeRoleMiddleware('reseller'));

resellerRouter.get('/api/v1/products', listResellerProductsController);
resellerRouter.get(
  '/api/v1/products/:productId',
  validateProductIdParam(),
  validateRequestMiddleware,
  (request: Request, response: Response, next: NextFunction) => {
    // The validator guarantees the route param exists before the typed controller uses it.
    void getResellerProductByIdController(
      request as unknown as TypedRequest<ProductIdParams>,
      response,
      next,
    );
  },
);

export { resellerRouter };
