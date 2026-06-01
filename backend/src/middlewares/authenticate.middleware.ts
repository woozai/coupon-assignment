import type { NextFunction, Request, Response } from 'express';
import { authService } from '../services/auth.service.js';
import { ApiError } from '../utils/api-error.js';

const getBearerToken = (authorizationHeader?: string): string => {
  if (!authorizationHeader) {
    throw new ApiError('Missing authorization header.', 401, 'UNAUTHORIZED');
  }

  const [scheme, token] = authorizationHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    throw new ApiError(
      'Authorization header must use Bearer token format.',
      401,
      'UNAUTHORIZED',
    );
  }

  return token;
};

export const authenticateMiddleware = (
  request: Request,
  _response: Response,
  next: NextFunction,
): void => {
  try {
    const bearerToken = getBearerToken(request.headers.authorization);
    const authenticatedUser = authService.verifyToken(bearerToken);

    request.authenticatedUser = authenticatedUser;
    next();
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      next(error);
      return;
    }

    next(new ApiError('Invalid authentication token.', 401, 'UNAUTHORIZED'));
  }
};
