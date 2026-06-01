import { Router } from 'express';
import {
  getResellerProductByIdController,
  listResellerProductsController,
} from '../controllers/reseller-product.controller.js';

const resellerRouter = Router();

resellerRouter.get('/api/v1/products', listResellerProductsController);
resellerRouter.get('/api/v1/products/:productId', getResellerProductByIdController);

export { resellerRouter };
