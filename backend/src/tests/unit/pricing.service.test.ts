import { describe, expect, it } from 'vitest';
import {
  assertValidResellerPrice,
  calculateMinimumSellPrice,
  isResellerPriceValid,
} from '../../services/pricing.service.js';
import { ApiError } from '../../utils/api-error.js';

describe('pricing service', () => {
  it('calculates the minimum sell price from cost and margin', () => {
    expect(calculateMinimumSellPrice(80, 25)).toBe(100);
  });

  it('rounds the minimum sell price to two decimals', () => {
    expect(calculateMinimumSellPrice(19.99, 17.5)).toBe(23.49);
  });

  it('accepts reseller prices that meet the minimum price', () => {
    expect(isResellerPriceValid(100, 100)).toBe(true);
    expect(isResellerPriceValid(120, 100)).toBe(true);
  });

  it('rejects reseller prices below the minimum price', () => {
    expect(isResellerPriceValid(99.99, 100)).toBe(false);
  });

  it('throws a stable domain error when reseller price is too low', () => {
    expect(() => assertValidResellerPrice(99.99, 100)).toThrowError(ApiError);
    expect(() => assertValidResellerPrice(99.99, 100)).toThrowError(
      'Reseller price must be greater than or equal to the minimum sell price.',
    );
  });
});
