import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const GalleryProjectSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: Schema.Types.ObjectId,
      ref: "GalleryCategory",
      required: true,
      index: true,
    },
    location: { type: String, default: "", trim: true },
    description: { type: String, default: "" },
    mainImage: { type: String, default: "" },
    images: { type: [String], default: [] },
    beforeImage: { type: String, default: "" },
    afterImage: { type: String, default: "" },
    alt: { type: String, default: "", trim: true },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

GalleryProjectSchema.index({ published: 1, order: 1 });
GalleryProjectSchema.index({ featured: 1 });

export type GalleryProjectDocument = InferSchemaType<
  typeof GalleryProjectSchema
> & {
  _id: mongoose.Types.ObjectId;
};

export const GalleryProject: Model<GalleryProjectDocument> =
  (mongoose.models.GalleryProject as Model<GalleryProjectDocument>) ||
  mongoose.model<GalleryProjectDocument>(
    "GalleryProject",
    GalleryProjectSchema,
  );

export default GalleryProject;
