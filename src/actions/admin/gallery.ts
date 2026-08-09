"use server";

import { connectDB } from "@/lib/db";
import { GalleryCategory, GalleryProject } from "@/models";
import { assertAdmin, actionError, type ActionResult } from "@/lib/admin/guard";
import { serializeDoc } from "@/lib/admin/serialize";
import { revalidateGallery } from "@/lib/revalidate";
import { galleryCategorySchema, galleryProjectSchema } from "@/lib/validations/admin";
import { slugify } from "@/lib/utils";

async function uniqueCategorySlug(base: string, ignoreId?: string): Promise<string> {
  const root = slugify(base) || "category";
  let candidate = root;
  let suffix = 2;
  while (
    await GalleryCategory.exists({
      slug: candidate,
      ...(ignoreId ? { _id: { $ne: ignoreId } } : {}),
    })
  ) {
    candidate = `${root}-${suffix}`;
    suffix += 1;
  }
  return candidate;
}

export async function listGalleryCategories() {
  await assertAdmin();
  await connectDB();
  const categories = await GalleryCategory.find({}).sort({ order: 1, name: 1 }).lean();
  const counts = await GalleryProject.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } },
  ]);
  const countMap = new Map(counts.map((c) => [String(c._id), c.count as number]));

  return categories.map((c) => ({
    ...serializeDoc(c),
    projectCount: countMap.get(String(c._id)) ?? 0,
  }));
}

export async function getGalleryCategory(id: string) {
  await assertAdmin();
  await connectDB();
  const category = await GalleryCategory.findById(id).lean();
  return category ? serializeDoc(category) : null;
}

export async function createGalleryCategory(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  try {
    await assertAdmin();
    const parsed = galleryCategorySchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
    }

    await connectDB();
    const slug = await uniqueCategorySlug(parsed.data.slug || parsed.data.name);
    const maxOrder = await GalleryCategory.findOne({}).sort({ order: -1 }).select("order").lean();

    const created = await GalleryCategory.create({
      ...parsed.data,
      slug,
      order: (maxOrder?.order ?? -1) + 1,
    });

    revalidateGallery(slug);
    return { ok: true, data: { id: created._id.toString() } };
  } catch (error) {
    return actionError(error, "Unable to create category");
  }
}

export async function updateGalleryCategory(id: string, input: unknown): Promise<ActionResult> {
  try {
    await assertAdmin();
    const parsed = galleryCategorySchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
    }

    await connectDB();
    const slug = await uniqueCategorySlug(parsed.data.slug || parsed.data.name, id);
    const updated = await GalleryCategory.findByIdAndUpdate(
      id,
      { $set: { ...parsed.data, slug } },
      { new: true },
    );
    if (!updated) return { ok: false, error: "Category not found" };

    revalidateGallery(slug);
    return { ok: true, data: undefined };
  } catch (error) {
    return actionError(error, "Unable to update category");
  }
}

export async function deleteGalleryCategory(id: string): Promise<ActionResult> {
  try {
    await assertAdmin();
    await connectDB();

    const projectCount = await GalleryProject.countDocuments({ category: id });
    if (projectCount > 0) {
      return {
        ok: false,
        error: `Cannot delete: ${projectCount} project(s) still use this category.`,
      };
    }

    const deleted = await GalleryCategory.findByIdAndDelete(id);
    if (!deleted) return { ok: false, error: "Category not found" };

    revalidateGallery(deleted.slug);
    return { ok: true, data: undefined };
  } catch (error) {
    return actionError(error, "Unable to delete category");
  }
}

export async function listGalleryProjects(categoryId: string) {
  await assertAdmin();
  await connectDB();
  const projects = await GalleryProject.find({ category: categoryId })
    .sort({ order: 1, createdAt: -1 })
    .lean();
  return serializeDoc(projects);
}

export async function getGalleryProject(id: string) {
  await assertAdmin();
  await connectDB();
  const project = await GalleryProject.findById(id).lean();
  return project ? serializeDoc(project) : null;
}

export async function createGalleryProject(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  try {
    await assertAdmin();
    const parsed = galleryProjectSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
    }

    await connectDB();
    const maxOrder = await GalleryProject.findOne({ category: parsed.data.category })
      .sort({ order: -1 })
      .select("order")
      .lean();

    const created = await GalleryProject.create({
      ...parsed.data,
      order: (maxOrder?.order ?? -1) + 1,
    });

    const category = await GalleryCategory.findById(parsed.data.category).select("slug").lean();
    revalidateGallery(category?.slug);
    return { ok: true, data: { id: created._id.toString() } };
  } catch (error) {
    return actionError(error, "Unable to create project");
  }
}

export async function updateGalleryProject(id: string, input: unknown): Promise<ActionResult> {
  try {
    await assertAdmin();
    const parsed = galleryProjectSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
    }

    await connectDB();
    const updated = await GalleryProject.findByIdAndUpdate(id, { $set: parsed.data }, { new: true });
    if (!updated) return { ok: false, error: "Project not found" };

    const category = await GalleryCategory.findById(updated.category).select("slug").lean();
    revalidateGallery(category?.slug);
    return { ok: true, data: undefined };
  } catch (error) {
    return actionError(error, "Unable to update project");
  }
}

export async function deleteGalleryProject(id: string): Promise<ActionResult> {
  try {
    await assertAdmin();
    await connectDB();
    const deleted = await GalleryProject.findByIdAndDelete(id);
    if (!deleted) return { ok: false, error: "Project not found" };

    const category = await GalleryCategory.findById(deleted.category).select("slug").lean();
    revalidateGallery(category?.slug);
    return { ok: true, data: undefined };
  } catch (error) {
    return actionError(error, "Unable to delete project");
  }
}

export async function toggleGalleryProjectField(
  id: string,
  field: "published" | "featured",
  value: boolean,
): Promise<ActionResult> {
  try {
    await assertAdmin();
    await connectDB();
    const updated = await GalleryProject.findByIdAndUpdate(id, { $set: { [field]: value } }, { new: true });
    if (!updated) return { ok: false, error: "Project not found" };

    const category = await GalleryCategory.findById(updated.category).select("slug").lean();
    revalidateGallery(category?.slug);
    return { ok: true, data: undefined };
  } catch (error) {
    return actionError(error, "Unable to update project");
  }
}

export async function reorderGalleryProject(
  id: string,
  direction: "up" | "down",
): Promise<ActionResult> {
  try {
    await assertAdmin();
    await connectDB();

    const current = await GalleryProject.findById(id);
    if (!current) return { ok: false, error: "Project not found" };

    const siblings = await GalleryProject.find({ category: current.category }).sort({
      order: 1,
      createdAt: -1,
    });
    const index = siblings.findIndex((s) => s._id.toString() === id);
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= siblings.length) {
      return { ok: true, data: undefined };
    }

    const a = siblings[index];
    const b = siblings[swapIndex];
    const aOrder = a.order;
    a.order = b.order;
    b.order = aOrder;
    await Promise.all([a.save(), b.save()]);

    const category = await GalleryCategory.findById(current.category).select("slug").lean();
    revalidateGallery(category?.slug);
    return { ok: true, data: undefined };
  } catch (error) {
    return actionError(error, "Unable to reorder projects");
  }
}
