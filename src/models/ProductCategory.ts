import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const ProductCategorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export type ProductCategoryDocument = InferSchemaType<
  typeof ProductCategorySchema
> & {
  _id: mongoose.Types.ObjectId;
};

export const ProductCategory: Model<ProductCategoryDocument> =
  (mongoose.models.ProductCategory as Model<ProductCategoryDocument>) ||
  mongoose.model<ProductCategoryDocument>(
    "ProductCategory",
    ProductCategorySchema,
  );

export default ProductCategory;
