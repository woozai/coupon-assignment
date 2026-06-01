import type { NextFunction, Request, Response } from 'express';
import { AuthRole } from '../types/auth.types.js';
import { ApiError } from '../utils/api-error.js';

export const authorizeRoleMiddleware = (requiredRole: AuthRole) => {
  return (
    request: Request,
    _response: Response,
    next: NextFunction,
  ): void => {
    if (!request.authenticatedUser) {
      next(new ApiError('Unauthorized.', 401, 'UNAUTHORIZED'));
      return;
    }

    if (request.authenticatedUser.role !== requiredRole) {
      next(new ApiError('Forbidden.', 403, 'FORBIDDEN'));
      return;
    }

    next();
  };
};
