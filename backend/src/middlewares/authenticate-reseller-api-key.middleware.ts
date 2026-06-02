import type { NextFunction, Request, Response } from 'express';
import { env } from '../config/env.js';
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

export const authenticateResellerApiKeyMiddleware = (
  request: Request,
  _response: Response,
  next: NextFunction,
): void => {
  try {
    const bearerToken = getBearerToken(request.headers.authorization);

    if (bearerToken !== env.RESELLER_API_KEY) {
      throw createUnauthorizedError('Invalid reseller API key.');
    }

    next();
  } catch (error: unknown) {
    next(error);
  }
};
