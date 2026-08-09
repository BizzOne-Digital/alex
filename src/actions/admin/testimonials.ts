"use server";

import { connectDB } from "@/lib/db";
import { Testimonial } from "@/models";
import { assertAdmin, actionError, type ActionResult } from "@/lib/admin/guard";
import { serializeDoc } from "@/lib/admin/serialize";
import { revalidateTestimonials } from "@/lib/revalidate";
import { testimonialSchema } from "@/lib/validations/admin";

export async function listTestimonials() {
  await assertAdmin();
  await connectDB();
  const items = await Testimonial.find({}).sort({ order: 1, createdAt: -1 }).lean();
  return serializeDoc(items);
}

export async function getTestimonial(id: string) {
  await assertAdmin();
  await connectDB();
  const item = await Testimonial.findById(id).lean();
  return item ? serializeDoc(item) : null;
}

export async function createTestimonial(input: unknown): Promise<ActionResult<{ id: string }>> {
  try {
    await assertAdmin();
    const parsed = testimonialSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
    }

    await connectDB();
    const maxOrder = await Testimonial.findOne({}).sort({ order: -1 }).select("order").lean();
    const created = await Testimonial.create({
      ...parsed.data,
      service: parsed.data.service || null,
      order: (maxOrder?.order ?? -1) + 1,
    });

    revalidateTestimonials();
    return { ok: true, data: { id: created._id.toString() } };
  } catch (error) {
    return actionError(error, "Unable to create testimonial");
  }
}

export async function updateTestimonial(id: string, input: unknown): Promise<ActionResult> {
  try {
    await assertAdmin();
    const parsed = testimonialSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
    }

    await connectDB();
    const updated = await Testimonial.findByIdAndUpdate(
      id,
      { $set: { ...parsed.data, service: parsed.data.service || null } },
      { new: true },
    );
    if (!updated) return { ok: false, error: "Testimonial not found" };

    revalidateTestimonials();
    return { ok: true, data: undefined };
  } catch (error) {
    return actionError(error, "Unable to update testimonial");
  }
}

export async function deleteTestimonial(id: string): Promise<ActionResult> {
  try {
    await assertAdmin();
    await connectDB();
    const deleted = await Testimonial.findByIdAndDelete(id);
    if (!deleted) return { ok: false, error: "Testimonial not found" };

    revalidateTestimonials();
    return { ok: true, data: undefined };
  } catch (error) {
    return actionError(error, "Unable to delete testimonial");
  }
}

export async function toggleTestimonialField(
  id: string,
  field: "published" | "featured",
  value: boolean,
): Promise<ActionResult> {
  try {
    await assertAdmin();
    await connectDB();
    const updated = await Testimonial.findByIdAndUpdate(id, { $set: { [field]: value } }, { new: true });
    if (!updated) return { ok: false, error: "Testimonial not found" };

    revalidateTestimonials();
    return { ok: true, data: undefined };
  } catch (error) {
    return actionError(error, "Unable to update testimonial");
  }
}

export async function reorderTestimonial(id: string, direction: "up" | "down"): Promise<ActionResult> {
  try {
    await assertAdmin();
    await connectDB();

    const items = await Testimonial.find({}).sort({ order: 1, createdAt: -1 });
    const index = items.findIndex((s) => s._id.toString() === id);
    if (index < 0) return { ok: false, error: "Testimonial not found" };

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

    revalidateTestimonials();
    return { ok: true, data: undefined };
  } catch (error) {
    return actionError(error, "Unable to reorder testimonials");
  }
}
