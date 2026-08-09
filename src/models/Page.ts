import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const SectionItemSchema = new Schema(
  {
    title: { type: String, default: "", trim: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    link: { type: String, default: "" },
    meta: { type: String, default: "" },
  },
  { _id: false },
);

const PageSectionSchema = new Schema(
  {
    key: { type: String, required: true, trim: true },
    eyebrow: { type: String, default: "", trim: true },
    heading: { type: String, default: "", trim: true },
    subheading: { type: String, default: "", trim: true },
    content: { type: String, default: "" },
    lists: { type: [String], default: [] },
    ctaLabel: { type: String, default: "", trim: true },
    ctaLink: { type: String, default: "", trim: true },
    ctaSecondaryLabel: { type: String, default: "", trim: true },
    ctaSecondaryLink: { type: String, default: "", trim: true },
    primaryImage: { type: String, default: "" },
    secondaryImage: { type: String, default: "" },
    backgroundImage: { type: String, default: "" },
    beforeImage: { type: String, default: "" },
    afterImage: { type: String, default: "" },
    imageAlt: { type: String, default: "", trim: true },
    items: { type: [SectionItemSchema], default: [] },
    visible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { _id: true },
);

const PageSchema = new Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    seoTitle: { type: String, default: "", trim: true },
    seoDescription: { type: String, default: "", trim: true },
    sections: { type: [PageSectionSchema], default: [] },
    published: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export type PageDocument = InferSchemaType<typeof PageSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Page: Model<PageDocument> =
  (mongoose.models.Page as Model<PageDocument>) ||
  mongoose.model<PageDocument>("Page", PageSchema);

export default Page;
