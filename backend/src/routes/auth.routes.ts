import { Router } from 'express';
import { adminLoginController } from '../controllers/auth.controller.js';
import { validateRequestMiddleware } from '../middlewares/validate-request.middleware.js';
import { validateAdminLogin } from '../validators/auth.validator.js';

const authRouter = Router();

authRouter.post(
  '/api/admin/login',
  validateAdminLogin(),
  validateRequestMiddleware,
  adminLoginController,
);

export { authRouter };
