import type { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ApiError } from '../utils/api-error.js';

export const validateRequestMiddleware = (
  request: Request,
  _response: Response,
  next: NextFunction,
): void => {
  const validationState = validationResult(request);

  // Stop the request early if a validator already found invalid input.
  if (validationState.isEmpty()) {
    next();
    return;
  }

  next(
    new ApiError(
      'Request validation failed.',
      400,
      'VALIDATION_ERROR',
      validationState.array(),
    ),
  );
};
