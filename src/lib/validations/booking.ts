import { z } from "zod";

export const bookingSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(100),
  lastName: z.string().trim().min(1, "Last name is required").max(100),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .toLowerCase(),
  phone: z.string().trim().min(7, "Phone number is required").max(30),
  address: z.string().trim().max(300).optional().default(""),
  city: z.string().trim().max(100).optional().default(""),
  province: z.string().trim().max(100).optional().default(""),
  postalCode: z.string().trim().max(20).optional().default(""),
  service: z
    .string()
    .trim()
    .regex(/^[a-f\d]{24}$/i, "Invalid service id")
    .optional()
    .nullable(),
  serviceName: z.string().trim().max(200).optional().default(""),
  preferredDate: z.string().trim().optional().nullable(),
  preferredTime: z.string().trim().max(50).optional().default(""),
  alternateDate: z.string().trim().optional().nullable(),
  alternateTime: z.string().trim().max(50).optional().default(""),
  propertyType: z.string().trim().max(100).optional().default(""),
  projectDetails: z.string().trim().max(5000).optional().default(""),
  message: z.string().trim().max(5000).optional().default(""),
  uploadedImages: z
    .array(z.union([z.string().url(), z.string().startsWith("/")]))
    .optional()
    .default([]),
  /** Honeypot — must be empty */
  website: z.string().optional().default(""),
});

export type BookingInput = z.infer<typeof bookingSchema>;
