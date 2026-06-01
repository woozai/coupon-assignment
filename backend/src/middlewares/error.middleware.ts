import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';

// Custom API error type used to carry an HTTP status code with the error.
export class ApiError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
    Error.captureStackTrace(this, this.constructor);
  }
}

// Global Express error handler middleware.
// Sends a JSON response with a status code, error message, and optional stack trace.
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const statusCode = err.statusCode ?? 500;
  const message = err.message ?? 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

// 404 handler for unmatched routes.
// Uses `_next` to preserve the Express middleware signature without triggering unused-parameter warnings.
export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  res.status(404).json({ success: false, error: 'Resource not found' });
};
