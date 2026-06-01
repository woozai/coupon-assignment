import { ApiError } from './api-error.js';

export const createForbiddenError = (): ApiError => {
  return new ApiError('Forbidden.', 403, 'FORBIDDEN');
};

export const createProductAlreadySoldError = (): ApiError => {
  return new ApiError(
    'Product has already been sold.',
    409,
    'PRODUCT_ALREADY_SOLD',
  );
};

export const createProductNotFoundError = (): ApiError => {
  return new ApiError('Product not found.', 404, 'PRODUCT_NOT_FOUND');
};

export const createUnauthorizedError = (message = 'Unauthorized.'): ApiError => {
  return new ApiError(message, 401, 'UNAUTHORIZED');
};
