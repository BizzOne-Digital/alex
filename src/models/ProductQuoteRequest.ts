import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

export const QUOTE_STATUSES = [
  "New",
  "Contacted",
  "Quoted",
  "Closed",
  "Archived",
] as const;

export type QuoteStatus = (typeof QUOTE_STATUSES)[number];

const ProductQuoteRequestSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: "", trim: true },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    productTitle: { type: String, default: "", trim: true },
    quantity: { type: Number, default: 1, min: 1 },
    message: { type: String, default: "" },
    status: {
      type: String,
      enum: QUOTE_STATUSES,
      default: "New",
      index: true,
    },
    internalNotes: { type: String, default: "" },
  },
  { timestamps: true },
);

ProductQuoteRequestSchema.index({ createdAt: -1 });
ProductQuoteRequestSchema.index({ email: 1 });

export type ProductQuoteRequestDocument = InferSchemaType<
  typeof ProductQuoteRequestSchema
> & {
  _id: mongoose.Types.ObjectId;
};

export const ProductQuoteRequest: Model<ProductQuoteRequestDocument> =
  (mongoose.models.ProductQuoteRequest as Model<ProductQuoteRequestDocument>) ||
  mongoose.model<ProductQuoteRequestDocument>(
    "ProductQuoteRequest",
    ProductQuoteRequestSchema,
  );

export default ProductQuoteRequest;
