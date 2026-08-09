import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const ProcessStepSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { _id: false },
);

const DesignOptionSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
  },
  { _id: false },
);

const MaterialSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
  },
  { _id: false },
);

const ServiceSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    serviceNumber: { type: String, default: "", trim: true },
    shortDescription: { type: String, default: "", trim: true },
    description: { type: String, default: "" },
    listingImage: { type: String, default: "" },
    heroImage: { type: String, default: "" },
    overviewImage: { type: String, default: "" },
    processImage: { type: String, default: "" },
    featureImage: { type: String, default: "" },
    galleryImages: { type: [String], default: [] },
    beforeImage: { type: String, default: "" },
    afterImage: { type: String, default: "" },
    imageAlt: { type: String, default: "", trim: true },
    typicalProjectType: { type: String, default: "", trim: true },
    inclusions: { type: [String], default: [] },
    ctaLabel: { type: String, default: "Book a Free Consultation", trim: true },
    ctaLink: { type: String, default: "/booking", trim: true },

    problems: { type: [String], default: [] },
    designOptions: { type: [DesignOptionSchema], default: [] },
    materials: { type: [MaterialSchema], default: [] },
    processSteps: { type: [ProcessStepSchema], default: [] },
    timeline: { type: String, default: "", trim: true },
    relatedServices: [
      {
        type: Schema.Types.ObjectId,
        ref: "Service",
      },
    ],
    relatedOffer: {
      type: Schema.Types.ObjectId,
      ref: "Offer",
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

ServiceSchema.index({ slug: 1 }, { unique: true });
ServiceSchema.index({ published: 1, order: 1 });
ServiceSchema.index({ featured: 1 });

export type ServiceDocument = InferSchemaType<typeof ServiceSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Service: Model<ServiceDocument> =
  (mongoose.models.Service as Model<ServiceDocument>) ||
  mongoose.model<ServiceDocument>("Service", ServiceSchema);

export default Service;
