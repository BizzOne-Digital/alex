"use server";

import { connectDB } from "@/lib/db";
import { Service } from "@/models";
import { assertAdmin, actionError, type ActionResult } from "@/lib/admin/guard";
import { serializeDoc } from "@/lib/admin/serialize";
import { revalidateServices } from "@/lib/revalidate";
import { serviceSchema } from "@/lib/validations/admin";
import { slugify } from "@/lib/utils";

async function uniqueSlug(base: string, ignoreId?: string): Promise<string> {
  const root = slugify(base) || "service";
  let candidate = root;
  let suffix = 2;
  while (
    await Service.exists({
      slug: candidate,
      ...(ignoreId ? { _id: { $ne: ignoreId } } : {}),
    })
  ) {
    candidate = `${root}-${suffix}`;
    suffix += 1;
  }
  return candidate;
}

export async function listServices() {
  await assertAdmin();
  await connectDB();
  const services = await Service.find({}).sort({ order: 1, createdAt: -1 }).lean();
  return serializeDoc(services);
}

export async function getService(id: string) {
  await assertAdmin();
  await connectDB();
  const service = await Service.findById(id).lean();
  return service ? serializeDoc(service) : null;
}

export async function createService(input: unknown): Promise<ActionResult<{ id: string }>> {
  try {
    await assertAdmin();
    const parsed = serviceSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
    }

    await connectDB();
    const slug = await uniqueSlug(parsed.data.slug || parsed.data.title);
    const maxOrder = await Service.findOne({}).sort({ order: -1 }).select("order").lean();

    const created = await Service.create({
      ...parsed.data,
      slug,
      relatedOffer: parsed.data.relatedOffer || null,
      order: (maxOrder?.order ?? -1) + 1,
    });

    revalidateServices(slug);
    return { ok: true, data: { id: created._id.toString() } };
  } catch (error) {
    return actionError(error, "Unable to create service");
  }
}

export async function updateService(id: string, input: unknown): Promise<ActionResult> {
  try {
    await assertAdmin();
    const parsed = serviceSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
    }

    await connectDB();
    const slug = await uniqueSlug(parsed.data.slug || parsed.data.title, id);

    const updated = await Service.findByIdAndUpdate(
      id,
      { $set: { ...parsed.data, slug, relatedOffer: parsed.data.relatedOffer || null } },
      { new: true },
    );
    if (!updated) return { ok: false, error: "Service not found" };

    revalidateServices(slug);
    return { ok: true, data: undefined };
  } catch (error) {
    return actionError(error, "Unable to update service");
  }
}

export async function deleteService(id: string): Promise<ActionResult> {
  try {
    await assertAdmin();
    await connectDB();
    const deleted = await Service.findByIdAndDelete(id);
    if (!deleted) return { ok: false, error: "Service not found" };

    revalidateServices(deleted.slug);
    return { ok: true, data: undefined };
  } catch (error) {
    return actionError(error, "Unable to delete service");
  }
}

export async function duplicateService(id: string): Promise<ActionResult<{ id: string }>> {
  try {
    await assertAdmin();
    await connectDB();
    const original = await Service.findById(id).lean();
    if (!original) return { ok: false, error: "Service not found" };

    const slug = await uniqueSlug(`${original.title}-copy`);
    const maxOrder = await Service.findOne({}).sort({ order: -1 }).select("order").lean();

    const { _id, createdAt, updatedAt, ...rest } = original as typeof original & {
      _id: unknown;
      createdAt: unknown;
      updatedAt: unknown;
    };
    void _id;
    void createdAt;
    void updatedAt;

    const created = await Service.create({
      ...rest,
      title: `${original.title} (Copy)`,
      slug,
      published: false,
      featured: false,
      order: (maxOrder?.order ?? -1) + 1,
    });

    revalidateServices();
    return { ok: true, data: { id: created._id.toString() } };
  } catch (error) {
    return actionError(error, "Unable to duplicate service");
  }
}

export async function toggleServiceField(
  id: string,
  field: "published" | "featured",
  value: boolean,
): Promise<ActionResult> {
  try {
    await assertAdmin();
    await connectDB();
    const updated = await Service.findByIdAndUpdate(id, { $set: { [field]: value } }, { new: true });
    if (!updated) return { ok: false, error: "Service not found" };

    revalidateServices(updated.slug);
    return { ok: true, data: undefined };
  } catch (error) {
    return actionError(error, "Unable to update service");
  }
}

/** Swaps order with the adjacent service in the given direction. */
export async function reorderService(id: string, direction: "up" | "down"): Promise<ActionResult> {
  try {
    await assertAdmin();
    await connectDB();

    const services = await Service.find({}).sort({ order: 1, createdAt: -1 });
    const index = services.findIndex((s) => s._id.toString() === id);
    if (index < 0) return { ok: false, error: "Service not found" };

    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= services.length) {
      return { ok: true, data: undefined };
    }

    const a = services[index];
    const b = services[swapIndex];
    const aOrder = a.order;
    a.order = b.order;
    b.order = aOrder;
    await Promise.all([a.save(), b.save()]);

    revalidateServices();
    return { ok: true, data: undefined };
  } catch (error) {
    return actionError(error, "Unable to reorder services");
  }
}
