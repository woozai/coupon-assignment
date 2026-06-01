import type { NextFunction, Request, Response } from 'express';
import { AuthRole } from '../types/auth.types.js';
import {
  createForbiddenError,
  createUnauthorizedError,
} from '../utils/domain-errors.js';

export const authorizeRoleMiddleware = (requiredRole: AuthRole) => {
  return (
    request: Request,
    _response: Response,
    next: NextFunction,
  ): void => {
    if (!request.authenticatedUser) {
      next(createUnauthorizedError());
      return;
    }

    if (request.authenticatedUser.role !== requiredRole) {
      next(createForbiddenError());
      return;
    }

    next();
  };
};
