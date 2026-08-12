import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const StoredUploadSchema = new Schema(
  {
    folder: { type: String, required: true, trim: true, index: true },
    filename: { type: String, required: true, trim: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true, min: 0 },
    data: { type: Buffer, required: true, select: false },
  },
  { timestamps: true },
);

StoredUploadSchema.index({ folder: 1, filename: 1 }, { unique: true });

export type StoredUploadDocument = InferSchemaType<typeof StoredUploadSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const StoredUpload: Model<StoredUploadDocument> =
  (mongoose.models.StoredUpload as Model<StoredUploadDocument>) ||
  mongoose.model<StoredUploadDocument>("StoredUpload", StoredUploadSchema);

export default StoredUpload;
