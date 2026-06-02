import type { NextFunction, Request, Response } from 'express';

export const requestLoggerMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction,
): void => {
  const requestStartedAt = Date.now();

  // Wait for the response to finish so the log includes the final status and duration.
  response.on('finish', () => {
    const responseDurationMs = Date.now() - requestStartedAt;

    console.log(
      `${request.method} ${request.originalUrl} ${response.statusCode} ${responseDurationMs}ms`,
    );
  });

  next();
};
