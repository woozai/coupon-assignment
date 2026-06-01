import type { NextFunction, Request, Response } from 'express';
import type { Request as TypedRequest } from 'express';
import { Router } from 'express';
import {
  createAdminProductController,
  deleteAdminProductController,
  getAdminProductByIdController,
  listAdminProductsController,
  updateAdminProductController,
} from '../controllers/admin-product.controller.js';
import { authenticateMiddleware } from '../middlewares/authenticate.middleware.js';
import { authorizeRoleMiddleware } from '../middlewares/authorize-role.middleware.js';
import { validateRequestMiddleware } from '../middlewares/validate-request.middleware.js';
import {
  validateCreateProduct,
  validateProductIdParam,
  validateUpdateProduct,
} from '../validators/product.validator.js';

interface ProductIdParams {
  productId: string;
}

const adminRouter = Router();

adminRouter.use(authenticateMiddleware, authorizeRoleMiddleware('admin'));

adminRouter.get('/api/admin/products', listAdminProductsController);
adminRouter.post(
  '/api/admin/products',
  validateCreateProduct(),
  validateRequestMiddleware,
  createAdminProductController,
);
adminRouter.get(
  '/api/admin/products/:productId',
  validateProductIdParam(),
  validateRequestMiddleware,
  (request: Request, response: Response, next: NextFunction) => {
    // The validator guarantees the route param exists before the typed controller uses it.
    void getAdminProductByIdController(
      request as unknown as TypedRequest<ProductIdParams>,
      response,
      next,
    );
  },
);
adminRouter.put(
  '/api/admin/products/:productId',
  validateProductIdParam(),
  validateUpdateProduct(),
  validateRequestMiddleware,
  (request: Request, response: Response, next: NextFunction) => {
    // The validator guarantees the route param exists before the typed controller uses it.
    void updateAdminProductController(
      request as unknown as TypedRequest<ProductIdParams>,
      response,
      next,
    );
  },
);
adminRouter.delete(
  '/api/admin/products/:productId',
  validateProductIdParam(),
  validateRequestMiddleware,
  (request: Request, response: Response, next: NextFunction) => {
    // The validator guarantees the route param exists before the typed controller uses it.
    void deleteAdminProductController(
      request as unknown as TypedRequest<ProductIdParams>,
      response,
      next,
    );
  },
);

export { adminRouter };
