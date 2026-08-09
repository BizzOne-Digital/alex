"use server";

import { connectDB } from "@/lib/db";
import { ContactInquiry, ProductQuoteRequest } from "@/models";
import { assertAdmin, actionError, type ActionResult } from "@/lib/admin/guard";
import { serializeDoc } from "@/lib/admin/serialize";
import { revalidateInquiriesAdmin } from "@/lib/revalidate";
import { inquiryUpdateSchema, quoteUpdateSchema } from "@/lib/validations/admin";

export async function listInquiries() {
  await assertAdmin();
  await connectDB();
  const items = await ContactInquiry.find({}).sort({ createdAt: -1 }).lean();
  return serializeDoc(items);
}

export async function updateInquiry(id: string, input: unknown): Promise<ActionResult> {
  try {
    await assertAdmin();
    const parsed = inquiryUpdateSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
    }

    await connectDB();
    const updated = await ContactInquiry.findByIdAndUpdate(id, { $set: parsed.data }, { new: true });
    if (!updated) return { ok: false, error: "Inquiry not found" };

    revalidateInquiriesAdmin();
    return { ok: true, data: undefined };
  } catch (error) {
    return actionError(error, "Unable to update inquiry");
  }
}

export async function deleteInquiry(id: string): Promise<ActionResult> {
  try {
    await assertAdmin();
    await connectDB();
    const deleted = await ContactInquiry.findByIdAndDelete(id);
    if (!deleted) return { ok: false, error: "Inquiry not found" };

    revalidateInquiriesAdmin();
    return { ok: true, data: undefined };
  } catch (error) {
    return actionError(error, "Unable to delete inquiry");
  }
}

export async function listQuoteRequests() {
  await assertAdmin();
  await connectDB();
  const items = await ProductQuoteRequest.find({})
    .sort({ createdAt: -1 })
    .populate("product", "title slug")
    .lean();
  return serializeDoc(items);
}

export async function updateQuoteRequest(id: string, input: unknown): Promise<ActionResult> {
  try {
    await assertAdmin();
    const parsed = quoteUpdateSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
    }

    await connectDB();
    const updated = await ProductQuoteRequest.findByIdAndUpdate(id, { $set: parsed.data }, { new: true });
    if (!updated) return { ok: false, error: "Quote request not found" };

    revalidateInquiriesAdmin();
    return { ok: true, data: undefined };
  } catch (error) {
    return actionError(error, "Unable to update quote request");
  }
}

export async function deleteQuoteRequest(id: string): Promise<ActionResult> {
  try {
    await assertAdmin();
    await connectDB();
    const deleted = await ProductQuoteRequest.findByIdAndDelete(id);
    if (!deleted) return { ok: false, error: "Quote request not found" };

    revalidateInquiriesAdmin();
    return { ok: true, data: undefined };
  } catch (error) {
    return actionError(error, "Unable to delete quote request");
  }
}
