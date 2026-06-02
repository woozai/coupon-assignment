import type { ErrorRequestHandler } from 'express';
import { ApiError } from '../utils/api-error.js';

const isMalformedJsonError = (error: unknown): boolean => {
  return (
    error instanceof SyntaxError &&
    'status' in error &&
    error.status === 400 &&
    'body' in error
  );
};

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

  // Surface malformed JSON as a client error so request bugs do not look like server failures.
  if (isMalformedJsonError(error)) {
    response.status(400).json({
      errorCode: 'INVALID_JSON',
      message: 'Request body contains invalid JSON.',
    });

    return;
  }

  // Fall back to a generic 500 so unexpected internals are not leaked to clients.
  response.status(500).json({
    errorCode: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred.',
  });
};
