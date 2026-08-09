import { z } from "zod";
import { BOOKING_STATUSES } from "@/models/Booking";
import { CONTACT_STATUSES } from "@/models/ContactInquiry";
import { QUOTE_STATUSES } from "@/models/ProductQuoteRequest";
import { STOCK_STATUSES } from "@/models/Product";

const objectId = z
  .string()
  .trim()
  .regex(/^[a-f\d]{24}$/i, "Invalid id");

const optionalObjectId = z
  .union([objectId, z.literal(""), z.null()])
  .optional()
  .transform((v) => (v ? v : null));

const imagePath = z.string().trim().optional().default("");

export const sectionItemSchema = z.object({
  title: z.string().trim().optional().default(""),
  description: z.string().trim().optional().default(""),
  image: imagePath,
  link: z.string().trim().optional().default(""),
  meta: z.string().trim().optional().default(""),
});

export const pageSectionSchema = z.object({
  key: z.string().trim().min(1),
  eyebrow: z.string().trim().optional().default(""),
  heading: z.string().trim().optional().default(""),
  subheading: z.string().trim().optional().default(""),
  content: z.string().optional().default(""),
  lists: z.array(z.string()).optional().default([]),
  ctaLabel: z.string().trim().optional().default(""),
  ctaLink: z.string().trim().optional().default(""),
  ctaSecondaryLabel: z.string().trim().optional().default(""),
  ctaSecondaryLink: z.string().trim().optional().default(""),
  primaryImage: imagePath,
  secondaryImage: imagePath,
  backgroundImage: imagePath,
  beforeImage: imagePath,
  afterImage: imagePath,
  imageAlt: z.string().trim().optional().default(""),
  items: z.array(sectionItemSchema).optional().default([]),
  visible: z.boolean().optional().default(true),
});

export const pageMetaSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  seoTitle: z.string().trim().max(200).optional().default(""),
  seoDescription: z.string().trim().max(400).optional().default(""),
  published: z.boolean().optional().default(true),
});

const processStepSchema = z.object({
  title: z.string().trim().min(1, "Step title is required").max(200),
  description: z.string().trim().optional().default(""),
  image: imagePath,
  order: z.number().int().optional().default(0),
});

const designOptionSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  description: z.string().trim().optional().default(""),
  image: imagePath,
});

const materialSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  description: z.string().trim().optional().default(""),
  image: imagePath,
});

export const serviceSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  slug: z.string().trim().max(200).optional().default(""),
  serviceNumber: z.string().trim().max(20).optional().default(""),
  shortDescription: z.string().trim().max(300).optional().default(""),
  description: z.string().optional().default(""),
  listingImage: imagePath,
  heroImage: imagePath,
  overviewImage: imagePath,
  processImage: imagePath,
  featureImage: imagePath,
  galleryImages: z.array(z.string()).optional().default([]),
  beforeImage: imagePath,
  afterImage: imagePath,
  imageAlt: z.string().trim().max(200).optional().default(""),
  typicalProjectType: z.string().trim().max(200).optional().default(""),
  inclusions: z.array(z.string()).optional().default([]),
  problems: z.array(z.string()).optional().default([]),
  designOptions: z.array(designOptionSchema).optional().default([]),
  materials: z.array(materialSchema).optional().default([]),
  processSteps: z.array(processStepSchema).optional().default([]),
  timeline: z.string().trim().max(500).optional().default(""),
  ctaLabel: z.string().trim().max(100).optional().default("Book a Free Consultation"),
  ctaLink: z.string().trim().max(300).optional().default("/booking"),
  relatedServices: z.array(objectId).optional().default([]),
  relatedOffer: optionalObjectId,
  seoTitle: z.string().trim().max(200).optional().default(""),
  seoDescription: z.string().trim().max(400).optional().default(""),
  published: z.boolean().optional().default(false),
  featured: z.boolean().optional().default(false),
});

export const galleryCategorySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  slug: z.string().trim().max(200).optional().default(""),
  description: z.string().optional().default(""),
  image: imagePath,
  published: z.boolean().optional().default(true),
});

export const galleryProjectSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  category: objectId,
  location: z.string().trim().max(200).optional().default(""),
  description: z.string().optional().default(""),
  mainImage: imagePath,
  images: z.array(z.string()).optional().default([]),
  beforeImage: imagePath,
  afterImage: imagePath,
  alt: z.string().trim().max(200).optional().default(""),
  featured: z.boolean().optional().default(false),
  published: z.boolean().optional().default(false),
});

export const testimonialSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(150),
  projectType: z.string().trim().max(150).optional().default(""),
  role: z.string().trim().max(150).optional().default(""),
  location: z.string().trim().max(150).optional().default(""),
  quote: z.string().trim().min(1, "Quote is required"),
  rating: z.number().int().min(1).max(5).optional().default(5),
  image: imagePath,
  service: optionalObjectId,
  featured: z.boolean().optional().default(false),
  published: z.boolean().optional().default(false),
});

export const faqSchema = z.object({
  question: z.string().trim().min(1, "Question is required").max(300),
  answer: z.string().trim().min(1, "Answer is required"),
  category: z.string().trim().max(100).optional().default("general"),
  published: z.boolean().optional().default(true),
});

export const productCategorySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  slug: z.string().trim().max(200).optional().default(""),
  description: z.string().optional().default(""),
  image: imagePath,
  published: z.boolean().optional().default(true),
});

const productSpecSchema = z.object({
  label: z.string().trim().min(1).max(100),
  value: z.string().trim().min(1).max(300),
});

export const productSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  slug: z.string().trim().max(200).optional().default(""),
  category: objectId,
  sku: z.string().trim().max(100).optional().default(""),
  shortDescription: z.string().trim().max(300).optional().default(""),
  description: z.string().optional().default(""),
  price: z.number().min(0).optional().default(0),
  compareAtPrice: z.number().min(0).nullable().optional().default(null),
  showPrice: z.boolean().optional().default(true),
  requestQuote: z.boolean().optional().default(false),
  purchasable: z.boolean().optional().default(false),
  stockStatus: z.enum(STOCK_STATUSES).optional().default("in_stock"),
  mainImage: imagePath,
  images: z.array(z.string()).optional().default([]),
  features: z.array(z.string()).optional().default([]),
  specs: z.array(productSpecSchema).optional().default([]),
  brand: z.string().trim().max(150).optional().default(""),
  relatedProducts: z.array(objectId).optional().default([]),
  relatedService: optionalObjectId,
  seoTitle: z.string().trim().max(200).optional().default(""),
  seoDescription: z.string().trim().max(400).optional().default(""),
  published: z.boolean().optional().default(false),
  featured: z.boolean().optional().default(false),
});

export const offerSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  description: z.string().optional().default(""),
  terms: z.string().optional().default(""),
  image: imagePath,
  relatedService: optionalObjectId,
  active: z.boolean().optional().default(true),
  startDate: z.string().trim().optional().nullable().default(null),
  endDate: z.string().trim().optional().nullable().default(null),
});

export const bookingUpdateSchema = z.object({
  status: z.enum(BOOKING_STATUSES).optional(),
  internalNotes: z.string().optional(),
  confirmedDate: z.string().trim().optional().nullable(),
  confirmedTime: z.string().trim().max(50).optional(),
});

export const inquiryUpdateSchema = z.object({
  status: z.enum(CONTACT_STATUSES).optional(),
  internalNotes: z.string().optional(),
});

export const quoteUpdateSchema = z.object({
  status: z.enum(QUOTE_STATUSES).optional(),
  internalNotes: z.string().optional(),
});

export const settingsSchema = z.object({
  companyName: z.string().trim().min(1).max(200),
  shortDescription: z.string().trim().max(1000).optional().default(""),
  email: z.string().trim().max(200).optional().default(""),
  primaryPhone: z.string().trim().max(50).optional().default(""),
  phoneTel: z.string().trim().max(50).optional().default(""),
  secondaryPhone: z.string().trim().max(50).optional().default(""),
  address: z.string().trim().max(300).optional().default(""),
  serviceArea: z.string().trim().max(1000).optional().default(""),
  businessHours: z.string().trim().max(500).optional().default(""),
  instagramUrl: z.string().trim().max(300).optional().default(""),
  facebookUrl: z.string().trim().max(300).optional().default(""),
  tiktokUrl: z.string().trim().max(300).optional().default(""),
  youtubeUrl: z.string().trim().max(300).optional().default(""),
  headerLogo: imagePath,
  footerLogo: imagePath,
  favicon: imagePath,
  headerCtaLabel: z.string().trim().max(100).optional().default(""),
  headerCtaLink: z.string().trim().max(300).optional().default(""),
  footerCtaLabel: z.string().trim().max(100).optional().default(""),
  footerCtaLink: z.string().trim().max(300).optional().default(""),
  bookingMessage: z.string().trim().max(1000).optional().default(""),
  defaultSeoTitle: z.string().trim().max(200).optional().default(""),
  defaultSeoDescription: z.string().trim().max(400).optional().default(""),
  googleMapsUrl: z.string().trim().max(500).optional().default(""),
  copyright: z.string().trim().max(200).optional().default(""),
  timelineDisclaimer: z.string().trim().max(1000).optional().default(""),
  offerDisclaimer: z.string().trim().max(1000).optional().default(""),
});
