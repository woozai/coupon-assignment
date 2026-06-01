import { Router } from 'express';
import type { ParamsDictionary } from 'express-serve-static-core';
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
  CreateCouponInput,
  UpdateCouponInput,
} from '../types/product.types.js';
import {
  validateCreateProduct,
  validateProductIdParam,
  validateUpdateProduct,
} from '../validators/product.validator.js';

interface ProductIdParams extends ParamsDictionary {
  productId: string;
}

const adminRouter = Router();

adminRouter.use(authenticateMiddleware, authorizeRoleMiddleware('admin'));

adminRouter.get('/api/admin/products', listAdminProductsController);
adminRouter.post<Record<string, never>, unknown, CreateCouponInput>(
  '/api/admin/products',
  validateCreateProduct(),
  validateRequestMiddleware,
  createAdminProductController,
);
adminRouter.get<ProductIdParams>(
  '/api/admin/products/:productId',
  ...validateProductIdParam(),
  validateRequestMiddleware,
  getAdminProductByIdController,
);
adminRouter.put<ProductIdParams, unknown, UpdateCouponInput>(
  '/api/admin/products/:productId',
  ...validateProductIdParam(),
  ...validateUpdateProduct(),
  validateRequestMiddleware,
  updateAdminProductController,
);
adminRouter.delete<ProductIdParams>(
  '/api/admin/products/:productId',
  ...validateProductIdParam(),
  validateRequestMiddleware,
  deleteAdminProductController,
);

export { adminRouter };
