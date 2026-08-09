import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const FAQSchema = new Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true },
    category: { type: String, default: "general", trim: true, index: true },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true },
);

FAQSchema.index({ published: 1, order: 1 });

export type FAQDocument = InferSchemaType<typeof FAQSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const FAQ: Model<FAQDocument> =
  (mongoose.models.FAQ as Model<FAQDocument>) ||
  mongoose.model<FAQDocument>("FAQ", FAQSchema);

export default FAQ;
