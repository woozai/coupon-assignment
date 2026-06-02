import type { ErrorRequestHandler } from 'express';
import { ApiError } from '../utils/api-error.js';

export const errorMiddleware: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next,
) => {
  // Preserve known domain errors and keep the public error contract consistent.
  if (error instanceof ApiError) {
    response.status(error.statusCode).json({
      errorCode: error.errorCode,
      message: error.message,
      ...(error.details ? { details: error.details } : {}),
    });

    return;
  }

  // Fall back to a generic 500 so unexpected internals are not leaked to clients.
  response.status(500).json({
    errorCode: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred.',
  });
};
