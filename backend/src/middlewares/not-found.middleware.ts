import type { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/api-error.js';

export const notFoundMiddleware = (
  request: Request,
  _response: Response,
  next: NextFunction,
): void => {
  // Convert unmatched routes into the same error flow used by the rest of the app.
  next(
    new ApiError(
      `Route not found: ${request.method} ${request.originalUrl}`,
      404,
      'ROUTE_NOT_FOUND',
    ),
  );
};
