import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const TestimonialSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    /** Project type label shown publicly (e.g. Kitchen Makeover). */
    projectType: { type: String, default: "", trim: true },
    role: { type: String, default: "", trim: true },
    location: { type: String, default: "", trim: true },
    quote: { type: String, required: true },

    rating: { type: Number, min: 1, max: 5, default: 5 },
    image: { type: String, default: "" },
    service: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      default: null,
    },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

TestimonialSchema.index({ published: 1, order: 1 });
TestimonialSchema.index({ featured: 1 });

export type TestimonialDocument = InferSchemaType<typeof TestimonialSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Testimonial: Model<TestimonialDocument> =
  (mongoose.models.Testimonial as Model<TestimonialDocument>) ||
  mongoose.model<TestimonialDocument>("Testimonial", TestimonialSchema);

export default Testimonial;
