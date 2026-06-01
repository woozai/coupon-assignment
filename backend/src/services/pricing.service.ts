import { ApiError } from '../utils/api-error.js';

const roundCurrency = (amount: number): number => {
  // Normalize money values to 2 decimals so API and persistence stay predictable.
  return Math.round(amount * 100) / 100;
};

export const calculateMinimumSellPrice = (
  costPrice: number,
  marginPercentage: number,
): number => {
  // Keep the core pricing formula in one place so all writes and reads stay consistent.
  const calculatedPrice = costPrice * (1 + marginPercentage / 100);

  return roundCurrency(calculatedPrice);
};

export const isResellerPriceValid = (
  resellerPrice: number,
  minimumSellPrice: number,
): boolean => {
  return resellerPrice >= minimumSellPrice;
};

export const assertValidResellerPrice = (
  resellerPrice: number,
  minimumSellPrice: number,
): void => {
  if (isResellerPriceValid(resellerPrice, minimumSellPrice)) {
    return;
  }

  // Throw a domain error here so purchase flows can reuse the same pricing rule everywhere.
  throw new ApiError(
    'Reseller price must be greater than or equal to the minimum sell price.',
    400,
    'RESELLER_PRICE_TOO_LOW',
  );
};
