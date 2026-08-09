import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

export const BOOKING_STATUSES = [
  "New",
  "Contacted",
  "Confirmed",
  "Reschedule Requested",
  "Completed",
  "Cancelled",
] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number];

const BookingSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, default: "", trim: true },
    city: { type: String, default: "", trim: true },
    province: { type: String, default: "", trim: true },
    postalCode: { type: String, default: "", trim: true },
    service: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      default: null,
    },
    serviceName: { type: String, default: "", trim: true },
    preferredDate: { type: Date, default: null },
    preferredTime: { type: String, default: "", trim: true },
    alternateDate: { type: Date, default: null },
    alternateTime: { type: String, default: "", trim: true },
    propertyType: { type: String, default: "", trim: true },
    projectDetails: { type: String, default: "" },
    message: { type: String, default: "" },
    uploadedImages: { type: [String], default: [] },
    status: {
      type: String,
      enum: BOOKING_STATUSES,
      default: "New",
      index: true,
    },
    internalNotes: { type: String, default: "" },
    confirmedDate: { type: Date, default: null },
    confirmedTime: { type: String, default: "", trim: true },
  },
  { timestamps: true },
);

BookingSchema.index({ createdAt: -1 });
BookingSchema.index({ email: 1 });
BookingSchema.index({ status: 1, createdAt: -1 });

export type BookingDocument = InferSchemaType<typeof BookingSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Booking: Model<BookingDocument> =
  (mongoose.models.Booking as Model<BookingDocument>) ||
  mongoose.model<BookingDocument>("Booking", BookingSchema);

export default Booking;
