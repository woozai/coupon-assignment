import type { NextFunction, Request, Response } from 'express';
import { authService } from '../services/auth.service.js';
import { ApiError } from '../utils/api-error.js';
import { createUnauthorizedError } from '../utils/domain-errors.js';

const getBearerToken = (authorizationHeader?: string): string => {
  if (!authorizationHeader) {
    throw createUnauthorizedError('Missing authorization header.');
  }

  const [scheme, token] = authorizationHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    throw createUnauthorizedError(
      'Authorization header must use Bearer token format.',
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

    next(createUnauthorizedError('Invalid authentication token.'));
  }
};
