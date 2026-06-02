import { HydratedDocument, Model, Schema, model } from 'mongoose';
import { CouponProduct, CouponValueType, ProductType } from '../types/product.types.js';

export interface ProductModel extends Model<CouponProduct> { }

// Keep schema rules close to persistence so invalid product data is rejected early.
const productSchema = new Schema<CouponProduct, ProductModel>(
  {
    costPrice: {
      min: 0,
      required: true,
      type: Number,
    },
    description: {
      required: true,
      trim: true,
      type: String,
    },
    imageUrl: {
      required: true,
      trim: true,
      type: String,
    },
    isSold: {
      default: false,
      type: Boolean,
    },
    marginPercentage: {
      min: 0,
      required: true,
      type: Number,
    },
    minimumSellPrice: {
      min: 0,
      required: true,
      type: Number,
    },
    name: {
      required: true,
      trim: true,
      type: String,
    },
    type: {
      default: ProductType.COUPON,
      enum: Object.values(ProductType),
      required: true,
      type: String,
    },
    value: {
      required: true,
      trim: true,
      type: String,
    },
    valueType: {
      enum: Object.values(CouponValueType),
      required: true,
      type: String,
    },
  },
  {
    // Include Mongoose virtuals like `id` when documents are converted for mappers.
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
    versionKey: false,
  },
);

// This index supports the main read path for unsold products by type.
productSchema.index({ isSold: 1, type: 1 });

export type ProductDocument = HydratedDocument<CouponProduct>;

export const Product = model<CouponProduct, ProductModel>('Product', productSchema);
