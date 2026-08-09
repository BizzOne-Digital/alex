import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

export const STOCK_STATUSES = [
  "in_stock",
  "low_stock",
  "out_of_stock",
  "made_to_order",
  "discontinued",
] as const;

export type StockStatus = (typeof STOCK_STATUSES)[number];

const ProductSpecSchema = new Schema(
  {
    label: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const ProductSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "ProductCategory",
      required: true,
      index: true,
    },
    sku: { type: String, default: "", trim: true, index: true },
    shortDescription: { type: String, default: "", trim: true },
    description: { type: String, default: "" },
    price: { type: Number, default: 0, min: 0 },
    compareAtPrice: { type: Number, default: null },
    showPrice: { type: Boolean, default: true },
    requestQuote: { type: Boolean, default: false },
    purchasable: { type: Boolean, default: false },
    stockStatus: {
      type: String,
      enum: STOCK_STATUSES,
      default: "in_stock",
    },
    mainImage: { type: String, default: "" },
    images: { type: [String], default: [] },
    features: { type: [String], default: [] },
    specs: { type: [ProductSpecSchema], default: [] },
    brand: { type: String, default: "", trim: true },
    relatedProducts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    relatedService: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      default: null,
    },
    seoTitle: { type: String, default: "", trim: true },
    seoDescription: { type: String, default: "", trim: true },
    published: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

ProductSchema.index({ slug: 1 }, { unique: true });
ProductSchema.index({ published: 1, order: 1 });
ProductSchema.index({ featured: 1 });
ProductSchema.index({ showPrice: 1, requestQuote: 1 });

export type ProductDocument = InferSchemaType<typeof ProductSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Product: Model<ProductDocument> =
  (mongoose.models.Product as Model<ProductDocument>) ||
  mongoose.model<ProductDocument>("Product", ProductSchema);

export default Product;
