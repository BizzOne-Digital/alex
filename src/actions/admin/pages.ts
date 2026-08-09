"use server";

import { connectDB } from "@/lib/db";
import { Page } from "@/models";
import { assertAdmin, actionError, type ActionResult } from "@/lib/admin/guard";
import { serializeDoc } from "@/lib/admin/serialize";
import { revalidatePageSlug } from "@/lib/revalidate";
import {
  pageMetaSchema,
  pageSectionSchema,
  type sectionItemSchema,
} from "@/lib/validations/admin";
import { getPageDefinition, isKnownPageSlug, PAGE_DEFINITIONS } from "@/lib/admin/page-sections";
import { z } from "zod";

export type PlainSection = {
  _id: string;
  key: string;
  eyebrow: string;
  heading: string;
  subheading: string;
  content: string;
  lists: string[];
  ctaLabel: string;
  ctaLink: string;
  ctaSecondaryLabel: string;
  ctaSecondaryLink: string;
  primaryImage: string;
  secondaryImage: string;
  backgroundImage: string;
  beforeImage: string;
  afterImage: string;
  imageAlt: string;
  items: z.infer<typeof sectionItemSchema>[];
  visible: boolean;
  order: number;
};

export type PlainPage = {
  _id: string;
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  published: boolean;
  sections: PlainSection[];
  createdAt: string;
  updatedAt: string;
};

/**
 * Guarantees a Page document exists for a known slug, with a section entry
 * for every key defined in the page config (in config order). Returns the
 * plain, client-safe page.
 */
export async function ensurePage(slug: string): Promise<PlainPage | null> {
  await assertAdmin();
  if (!isKnownPageSlug(slug)) return null;

  await connectDB();
  const definition = getPageDefinition(slug);
  if (!definition) return null;

  let page = await Page.findOne({ slug });
  if (!page) {
    page = await Page.create({
      slug,
      title: definition.title,
      published: true,
      sections: definition.sections.map((s, index) => ({
        key: s.key,
        visible: true,
        order: index,
      })),
    });
  } else {
    const existingKeys = new Set(page.sections.map((s) => s.key));
    let changed = false;
    definition.sections.forEach((s, index) => {
      if (!existingKeys.has(s.key)) {
        page!.sections.push({ key: s.key, visible: true, order: index } as never);
        changed = true;
      }
    });
    if (changed) await page.save();
  }

  return serializeDoc(page.toObject()) as unknown as PlainPage;
}

export async function listPagesStatus(): Promise<
  { slug: string; title: string; exists: boolean; published: boolean; updatedAt: string | null }[]
> {
  await assertAdmin();
  await connectDB();
  const pages = await Page.find({}).select("slug published updatedAt").lean();
  const bySlug = new Map(pages.map((p) => [p.slug, p]));

  return PAGE_DEFINITIONS.map((def) => {
    const existing = bySlug.get(def.slug);
    return {
      slug: def.slug,
      title: def.title,
      exists: Boolean(existing),
      published: existing?.published ?? false,
      updatedAt: existing?.updatedAt ? new Date(existing.updatedAt).toISOString() : null,
    };
  });
}

export async function updatePageMeta(
  slug: string,
  input: unknown,
): Promise<ActionResult> {
  try {
    await assertAdmin();
    const parsed = pageMetaSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
    }

    await connectDB();
    const page = await Page.findOneAndUpdate(
      { slug },
      { $set: parsed.data },
      { new: true, upsert: false },
    );
    if (!page) return { ok: false, error: "Page not found" };

    revalidatePageSlug(slug);
    return { ok: true, data: undefined };
  } catch (error) {
    return actionError(error, "Unable to update page");
  }
}

export async function savePageSection(
  slug: string,
  sectionKey: string,
  input: unknown,
): Promise<ActionResult> {
  try {
    await assertAdmin();
    const parsed = pageSectionSchema.safeParse({ ...(input as object), key: sectionKey });
    if (!parsed.success) {
      return { ok: false, error: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
    }

    await connectDB();
    const page = await Page.findOne({ slug });
    if (!page) return { ok: false, error: "Page not found" };

    const index = page.sections.findIndex((s) => s.key === sectionKey);
    const definition = getPageDefinition(slug);
    const order = definition?.sections.findIndex((s) => s.key === sectionKey) ?? 0;

    if (index >= 0) {
      page.sections[index].set({ ...parsed.data, order });
    } else {
      page.sections.push({ ...parsed.data, order } as never);
    }

    await page.save();
    revalidatePageSlug(slug);
    return { ok: true, data: undefined };
  } catch (error) {
    return actionError(error, "Unable to save section");
  }
}

export async function setSectionVisible(
  slug: string,
  sectionKey: string,
  visible: boolean,
): Promise<ActionResult> {
  try {
    await assertAdmin();
    await connectDB();
    const page = await Page.findOne({ slug });
    if (!page) return { ok: false, error: "Page not found" };

    const section = page.sections.find((s) => s.key === sectionKey);
    if (!section) return { ok: false, error: "Section not found" };

    section.visible = visible;
    await page.save();
    revalidatePageSlug(slug);
    return { ok: true, data: undefined };
  } catch (error) {
    return actionError(error, "Unable to update section visibility");
  }
}
