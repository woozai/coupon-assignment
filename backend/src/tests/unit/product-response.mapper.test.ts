import { describe, expect, it } from 'vitest';
import {
  mapProductToAdminResponse,
  mapProductToPublicResponse,
} from '../../mappers/product-response.mapper.js';
import { buildCouponProduct } from '../helpers/product-test-helpers.js';

describe('product response mapper', () => {
  it('returns only public fields for reseller and customer responses', () => {
    const product = buildCouponProduct();
    const publicResponse = mapProductToPublicResponse(product);

    expect(publicResponse).toEqual({
      description: product.description,
      id: product.id,
      imageUrl: product.imageUrl,
      name: product.name,
      price: product.minimumSellPrice,
    });
    expect(publicResponse).not.toHaveProperty('costPrice');
    expect(publicResponse).not.toHaveProperty('marginPercentage');
    expect(publicResponse).not.toHaveProperty('minimumSellPrice');
    expect(publicResponse).not.toHaveProperty('value');
  });

  it('keeps internal fields available for admin responses', () => {
    const product = buildCouponProduct();
    const adminResponse = mapProductToAdminResponse(product);

    expect(adminResponse).toMatchObject({
      costPrice: product.costPrice,
      id: product.id,
      isSold: product.isSold,
      marginPercentage: product.marginPercentage,
      minimumSellPrice: product.minimumSellPrice,
      value: product.value,
      valueType: product.valueType,
    });
  });
});
