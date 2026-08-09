import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(150),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .toLowerCase(),
  phone: z.string().trim().max(30).optional().default(""),
  subject: z.string().trim().max(200).optional().default(""),
  message: z.string().trim().min(1, "Message is required").max(5000),
  /** Honeypot — must be empty */
  website: z.string().optional().default(""),
});

export type ContactInput = z.infer<typeof contactSchema>;
