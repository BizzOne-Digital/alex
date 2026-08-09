import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const AdminUserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["admin", "editor"],
      default: "admin",
    },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
  },
  { timestamps: true },
);

export type AdminUserDocument = InferSchemaType<typeof AdminUserSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const AdminUser: Model<AdminUserDocument> =
  (mongoose.models.AdminUser as Model<AdminUserDocument>) ||
  mongoose.model<AdminUserDocument>("AdminUser", AdminUserSchema);

export default AdminUser;
