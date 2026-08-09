import { z } from "zod";

export const quoteSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(150),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .toLowerCase(),
  phone: z.string().trim().max(30).optional().default(""),
  product: z
    .string()
    .trim()
    .regex(/^[a-f\d]{24}$/i, "Invalid product id"),
  productTitle: z.string().trim().max(300).optional().default(""),
  quantity: z.coerce.number().int().min(1).max(9999).optional().default(1),
  message: z.string().trim().max(5000).optional().default(""),
  /** Honeypot — must be empty */
  website: z.string().optional().default(""),
});

export type QuoteInput = z.infer<typeof quoteSchema>;
