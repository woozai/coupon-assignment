import { FilterQuery, Types } from 'mongoose';
import { Product, ProductDocument } from '../models/product.model.js';
import { CouponProduct, CreateCouponInput, UpdateCouponInput } from '../types/product.types.js';

// Normalize string ids into one Mongo filter shape so repository methods stay consistent.
const mapIdFilter = (productId: string): FilterQuery<CouponProduct> => {
  return {
    _id: new Types.ObjectId(productId),
  };
};

export const productRepository = {
  create: async (productInput: CreateCouponInput & { minimumSellPrice: number }): Promise<ProductDocument> => {
    return Product.create({
      ...productInput,
    });
  },

  deleteById: async (productId: string): Promise<ProductDocument | null> => {
    return Product.findOneAndDelete(mapIdFilter(productId)).exec();
  },

  findAll: async (): Promise<ProductDocument[]> => {
    return Product.find().sort({ createdAt: -1 }).exec();
  },

  // The reseller and customer listing flows should only work with unsold products.
  findAvailable: async (): Promise<ProductDocument[]> => {
    return Product.find({ isSold: false }).sort({ createdAt: -1 }).exec();
  },

  findById: async (productId: string): Promise<ProductDocument | null> => {
    return Product.findOne(mapIdFilter(productId)).exec();
  },

  // Keep the repository generic so later services can decide the business rules.
  updateById: async (
    productId: string,
    productUpdate: UpdateCouponInput & { minimumSellPrice?: number },
  ): Promise<ProductDocument | null> => {
    return Product.findOneAndUpdate(mapIdFilter(productId), productUpdate, {
      new: true,
      runValidators: true,
    }).exec();
  },
};
