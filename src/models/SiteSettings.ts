import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const SiteSettingsSchema = new Schema(
  {
    /** Singleton key — only one settings document should exist. */
    key: {
      type: String,
      default: "site",
      unique: true,
      immutable: true,
    },
    companyName: {
      type: String,
      default: "Ikasa Renovations",
      trim: true,
    },
    shortDescription: { type: String, default: "", trim: true },
    email: { type: String, default: "", trim: true },
    primaryPhone: { type: String, default: "", trim: true },
    phoneTel: { type: String, default: "", trim: true },
    secondaryPhone: { type: String, default: "", trim: true },
    address: { type: String, default: "", trim: true },
    serviceArea: { type: String, default: "", trim: true },
    businessHours: { type: String, default: "", trim: true },
    instagramUrl: { type: String, default: "" },
    facebookUrl: { type: String, default: "" },
    tiktokUrl: { type: String, default: "" },
    youtubeUrl: { type: String, default: "" },
    headerLogo: { type: String, default: "" },
    footerLogo: { type: String, default: "" },
    favicon: { type: String, default: "" },
    headerCtaLabel: { type: String, default: "Book a Free Consultation", trim: true },
    headerCtaLink: { type: String, default: "/booking", trim: true },
    footerCtaLabel: { type: String, default: "Book a Free Consultation", trim: true },
    footerCtaLink: { type: String, default: "/booking", trim: true },
    bookingMessage: { type: String, default: "" },
    defaultSeoTitle: {
      type: String,
      default: "Ikasa Renovations | From Outdated to Outstanding",
      trim: true,
    },
    defaultSeoDescription: { type: String, default: "" },
    googleMapsUrl: { type: String, default: "" },
    copyright: { type: String, default: "", trim: true },
    timelineDisclaimer: { type: String, default: "" },
    offerDisclaimer: { type: String, default: "" },
    /** Used only on the singleton doc with key "admin-auth" (Atlas collection-limit fallback). */
    adminEmail: { type: String, default: "", trim: true, lowercase: true },
    adminPasswordHash: { type: String, default: "", select: false },
    adminName: { type: String, default: "Ikasa Admin", trim: true },
    adminIsActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export type SiteSettingsDocument = InferSchemaType<typeof SiteSettingsSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const SiteSettings: Model<SiteSettingsDocument> =
  (mongoose.models.SiteSettings as Model<SiteSettingsDocument>) ||
  mongoose.model<SiteSettingsDocument>("SiteSettings", SiteSettingsSchema);

export default SiteSettings;
