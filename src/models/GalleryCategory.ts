import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const GalleryCategorySchema = new Schema(
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

export type GalleryCategoryDocument = InferSchemaType<
  typeof GalleryCategorySchema
> & {
  _id: mongoose.Types.ObjectId;
};

export const GalleryCategory: Model<GalleryCategoryDocument> =
  (mongoose.models.GalleryCategory as Model<GalleryCategoryDocument>) ||
  mongoose.model<GalleryCategoryDocument>(
    "GalleryCategory",
    GalleryCategorySchema,
  );

export default GalleryCategory;
