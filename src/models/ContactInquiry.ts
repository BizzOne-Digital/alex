import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

export const CONTACT_STATUSES = [
  "New",
  "In Progress",
  "Resolved",
  "Archived",
] as const;

export type ContactStatus = (typeof CONTACT_STATUSES)[number];

const ContactInquirySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: "", trim: true },
    subject: { type: String, default: "", trim: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: CONTACT_STATUSES,
      default: "New",
      index: true,
    },
    internalNotes: { type: String, default: "" },
  },
  { timestamps: true },
);

ContactInquirySchema.index({ createdAt: -1 });
ContactInquirySchema.index({ email: 1 });

export type ContactInquiryDocument = InferSchemaType<
  typeof ContactInquirySchema
> & {
  _id: mongoose.Types.ObjectId;
};

export const ContactInquiry: Model<ContactInquiryDocument> =
  (mongoose.models.ContactInquiry as Model<ContactInquiryDocument>) ||
  mongoose.model<ContactInquiryDocument>(
    "ContactInquiry",
    ContactInquirySchema,
  );

export default ContactInquiry;
