import { connectDB } from "@/lib/db";
import { getPageDefinition } from "@/lib/admin/page-sections";
import { Page } from "@/models";
import { pageSectionSchema } from "@/lib/validations/admin";

export type PersistSectionResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

/** Shared DB write for admin section saves (actions + API route). */
export async function persistPageSection(
  slug: string,
  sectionKey: string,
  input: unknown,
): Promise<PersistSectionResult> {
  const parsed = pageSectionSchema.safeParse({ ...(input as object), key: sectionKey });
  if (!parsed.success) {
    return {
      ok: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  await connectDB();
  const definition = getPageDefinition(slug);
  const order = definition?.sections.findIndex((s) => s.key === sectionKey) ?? 0;
  const sectionData = { ...parsed.data, order };

  const hasSection = await Page.exists({ slug, "sections.key": sectionKey });

  if (hasSection) {
    const $set: Record<string, unknown> = {};
    for (const [field, value] of Object.entries(sectionData)) {
      $set[`sections.$[elem].${field}`] = value;
    }

    const result = await Page.updateOne(
      { slug },
      { $set },
      { arrayFilters: [{ "elem.key": sectionKey }] },
    );

    if (result.matchedCount === 0) {
      return { ok: false, error: "Page not found" };
    }
  } else {
    const page = await Page.findOne({ slug });
    if (!page) return { ok: false, error: "Page not found" };
    page.sections.push(sectionData as never);
    page.markModified("sections");
    await page.save();
  }

  return { ok: true };
}
