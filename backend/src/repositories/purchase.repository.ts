import { Types } from 'mongoose';
import { Product, ProductDocument } from '../models/product.model.js';

export const purchaseRepository = {
  // Use one atomic update so the same coupon cannot be sold twice under concurrent requests.
  markProductAsSold: async (productId: string): Promise<ProductDocument | null> => {
    return Product.findOneAndUpdate(
      {
        _id: new Types.ObjectId(productId),
        isSold: false,
      },
      {
        $set: {
          isSold: true,
        },
      },
      {
        new: true,
      },
    ).exec();
  },
};
