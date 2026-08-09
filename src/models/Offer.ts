import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const OfferSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    terms: { type: String, default: "" },
    image: { type: String, default: "" },
    relatedService: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      default: null,
    },
    active: { type: Boolean, default: true },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

OfferSchema.index({ active: 1, order: 1 });
OfferSchema.index({ startDate: 1, endDate: 1 });

export type OfferDocument = InferSchemaType<typeof OfferSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Offer: Model<OfferDocument> =
  (mongoose.models.Offer as Model<OfferDocument>) ||
  mongoose.model<OfferDocument>("Offer", OfferSchema);

export default Offer;
