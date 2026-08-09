"use server";

import { connectDB } from "@/lib/db";
import { FAQ } from "@/models";
import { assertAdmin, actionError, type ActionResult } from "@/lib/admin/guard";
import { serializeDoc } from "@/lib/admin/serialize";
import { revalidateFaqs } from "@/lib/revalidate";
import { faqSchema } from "@/lib/validations/admin";

export async function listFaqs() {
  await assertAdmin();
  await connectDB();
  const items = await FAQ.find({}).sort({ order: 1, createdAt: -1 }).lean();
  return serializeDoc(items);
}

export async function getFaq(id: string) {
  await assertAdmin();
  await connectDB();
  const item = await FAQ.findById(id).lean();
  return item ? serializeDoc(item) : null;
}

export async function createFaq(input: unknown): Promise<ActionResult<{ id: string }>> {
  try {
    await assertAdmin();
    const parsed = faqSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
    }

    await connectDB();
    const maxOrder = await FAQ.findOne({}).sort({ order: -1 }).select("order").lean();
    const created = await FAQ.create({
      ...parsed.data,
      order: (maxOrder?.order ?? -1) + 1,
    });

    revalidateFaqs();
    return { ok: true, data: { id: created._id.toString() } };
  } catch (error) {
    return actionError(error, "Unable to create FAQ");
  }
}

export async function updateFaq(id: string, input: unknown): Promise<ActionResult> {
  try {
    await assertAdmin();
    const parsed = faqSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
    }

    await connectDB();
    const updated = await FAQ.findByIdAndUpdate(id, { $set: parsed.data }, { new: true });
    if (!updated) return { ok: false, error: "FAQ not found" };

    revalidateFaqs();
    return { ok: true, data: undefined };
  } catch (error) {
    return actionError(error, "Unable to update FAQ");
  }
}

export async function deleteFaq(id: string): Promise<ActionResult> {
  try {
    await assertAdmin();
    await connectDB();
    const deleted = await FAQ.findByIdAndDelete(id);
    if (!deleted) return { ok: false, error: "FAQ not found" };

    revalidateFaqs();
    return { ok: true, data: undefined };
  } catch (error) {
    return actionError(error, "Unable to delete FAQ");
  }
}

export async function toggleFaqPublished(id: string, value: boolean): Promise<ActionResult> {
  try {
    await assertAdmin();
    await connectDB();
    const updated = await FAQ.findByIdAndUpdate(id, { $set: { published: value } }, { new: true });
    if (!updated) return { ok: false, error: "FAQ not found" };

    revalidateFaqs();
    return { ok: true, data: undefined };
  } catch (error) {
    return actionError(error, "Unable to update FAQ");
  }
}

export async function reorderFaq(id: string, direction: "up" | "down"): Promise<ActionResult> {
  try {
    await assertAdmin();
    await connectDB();

    const items = await FAQ.find({}).sort({ order: 1, createdAt: -1 });
    const index = items.findIndex((s) => s._id.toString() === id);
    if (index < 0) return { ok: false, error: "FAQ not found" };

    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= items.length) {
      return { ok: true, data: undefined };
    }

    const a = items[index];
    const b = items[swapIndex];
    const aOrder = a.order;
    a.order = b.order;
    b.order = aOrder;
    await Promise.all([a.save(), b.save()]);

    revalidateFaqs();
    return { ok: true, data: undefined };
  } catch (error) {
    return actionError(error, "Unable to reorder FAQs");
  }
}
