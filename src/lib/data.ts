import { connectDB } from "@/lib/db";
import {
  DEFAULT_SITE_SETTINGS,
  type PublicProductCategory,
  type PublicServiceNavItem,
  type PublicSiteSettings,
} from "@/lib/defaults";
import {
  FAQ,
  GalleryCategory,
  GalleryProject,
  Offer,
  Page,
  Product,
  ProductCategory,
  Service,
  SiteSettings,
  Testimonial,
} from "@/models";

/** Ensure Offer is registered for Service.relatedOffer populate (avoids tree-shake). */
if (!Offer.modelName) {
  throw new Error("Offer model failed to register");
}

const LEGACY_BRAND_PATHS = new Set([
  "/brand/ikasa-logo-light.svg",
  "/brand/ikasa-logo.svg",
  "/brand/ikasa-mark.svg",
  "/brand/ikasa-favicon.svg",
]);

function resolveBrandAsset(
  value: unknown,
  fallback: string,
): string {
  const path = String(value ?? "").trim();
  if (!path || LEGACY_BRAND_PATHS.has(path)) return fallback;
  return path;
}

function logDataError(fn: string, error: unknown): void {
  console.error(`[data:${fn}]`, error);
}

function toPlainSettings(
  doc: Record<string, unknown> | null | undefined,
): PublicSiteSettings {
  const d = doc ?? {};
  return {
    companyName: String(d.companyName ?? DEFAULT_SITE_SETTINGS.companyName),
    shortDescription: String(
      d.shortDescription ?? DEFAULT_SITE_SETTINGS.shortDescription,
    ),
    email: String(d.email ?? DEFAULT_SITE_SETTINGS.email),
    primaryPhone: String(d.primaryPhone ?? DEFAULT_SITE_SETTINGS.primaryPhone),
    phoneTel: String(d.phoneTel ?? DEFAULT_SITE_SETTINGS.phoneTel),
    secondaryPhone: String(
      d.secondaryPhone ?? DEFAULT_SITE_SETTINGS.secondaryPhone,
    ),
    address: String(d.address ?? DEFAULT_SITE_SETTINGS.address),
    serviceArea: String(d.serviceArea ?? DEFAULT_SITE_SETTINGS.serviceArea),
    businessHours: String(
      d.businessHours ?? DEFAULT_SITE_SETTINGS.businessHours,
    ),
    instagramUrl: String(d.instagramUrl ?? DEFAULT_SITE_SETTINGS.instagramUrl),
    facebookUrl: String(d.facebookUrl ?? DEFAULT_SITE_SETTINGS.facebookUrl),
    tiktokUrl: String(d.tiktokUrl ?? DEFAULT_SITE_SETTINGS.tiktokUrl),
    youtubeUrl: String(d.youtubeUrl ?? DEFAULT_SITE_SETTINGS.youtubeUrl),
    headerLogo: resolveBrandAsset(
      d.headerLogo,
      DEFAULT_SITE_SETTINGS.headerLogo,
    ),
    footerLogo: resolveBrandAsset(
      d.footerLogo,
      DEFAULT_SITE_SETTINGS.footerLogo,
    ),
    favicon: resolveBrandAsset(d.favicon, DEFAULT_SITE_SETTINGS.favicon),
    headerCtaLabel: String(
      d.headerCtaLabel || DEFAULT_SITE_SETTINGS.headerCtaLabel,
    ),
    headerCtaLink: String(
      d.headerCtaLink || DEFAULT_SITE_SETTINGS.headerCtaLink,
    ),
    footerCtaLabel: String(
      d.footerCtaLabel || DEFAULT_SITE_SETTINGS.footerCtaLabel,
    ),
    footerCtaLink: String(
      d.footerCtaLink || DEFAULT_SITE_SETTINGS.footerCtaLink,
    ),
    bookingMessage: String(
      d.bookingMessage ?? DEFAULT_SITE_SETTINGS.bookingMessage,
    ),
    defaultSeoTitle: String(
      d.defaultSeoTitle || DEFAULT_SITE_SETTINGS.defaultSeoTitle,
    ),
    defaultSeoDescription: String(
      d.defaultSeoDescription || DEFAULT_SITE_SETTINGS.defaultSeoDescription,
    ),
    googleMapsUrl: String(
      d.googleMapsUrl ?? DEFAULT_SITE_SETTINGS.googleMapsUrl,
    ),
    copyright: String(d.copyright || DEFAULT_SITE_SETTINGS.copyright),
    timelineDisclaimer: String(
      d.timelineDisclaimer ?? DEFAULT_SITE_SETTINGS.timelineDisclaimer,
    ),
    offerDisclaimer: String(
      d.offerDisclaimer ?? DEFAULT_SITE_SETTINGS.offerDisclaimer,
    ),
  };
}

export async function getSettings(): Promise<PublicSiteSettings> {
  try {
    await connectDB();
    const doc = await SiteSettings.findOne({ key: "site" }).lean();
    return toPlainSettings(doc as Record<string, unknown> | null);
  } catch (error) {
    logDataError("getSettings", error);
    return toPlainSettings(null);
  }
}

export async function getPublishedServices(): Promise<PublicServiceNavItem[]> {
  try {
    await connectDB();
    const services = await Service.find({ published: true })
      .sort({ order: 1, title: 1 })
      .select("title slug serviceNumber shortDescription")
      .lean();

    return services.map((s) => ({
      id: String(s._id),
      title: s.title,
      slug: s.slug,
      serviceNumber: s.serviceNumber ?? "",
      shortDescription: s.shortDescription ?? "",
    }));
  } catch (error) {
    logDataError("getPublishedServices", error);
    return [];
  }
}

export async function getPageBySlug(slug: string) {
  try {
    await connectDB();
    const page = await Page.findOne({ slug, published: true }).lean();
    if (!page) return null;
    return {
      ...page,
      _id: String(page._id),
      sections: (page.sections ?? [])
        .filter((s) => s.visible !== false)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((s) => ({ ...s, _id: String(s._id) })),
    };
  } catch (error) {
    logDataError(`getPageBySlug(${slug})`, error);
    return null;
  }
}

export type PublicPage = NonNullable<Awaited<ReturnType<typeof getPageBySlug>>>;
export type PublicPageSection = PublicPage["sections"][number];

/** Finds a single section by key from an already-fetched page, or null. */
export function findSection(
  page: PublicPage | null,
  key: string,
): PublicPageSection | null {
  return page?.sections.find((s) => s.key === key) ?? null;
}

export type PublicServiceRelatedRef = {
  _id: string;
  title: string;
  slug: string;
  serviceNumber: string;
  listingImage: string;
  shortDescription: string;
};

export type PublicServiceOfferRef = {
  _id: string;
  title: string;
  description: string;
  image: string;
};

function toRelatedServiceRef(r: unknown): PublicServiceRelatedRef | string {
  if (r && typeof r === "object" && "_id" in (r as Record<string, unknown>)) {
    const doc = r as Record<string, unknown>;
    return {
      _id: String(doc._id),
      title: String(doc.title ?? ""),
      slug: String(doc.slug ?? ""),
      serviceNumber: String(doc.serviceNumber ?? ""),
      listingImage: String(doc.listingImage ?? ""),
      shortDescription: String(doc.shortDescription ?? ""),
    };
  }
  return String(r);
}

function toRelatedOfferRef(r: unknown): PublicServiceOfferRef | string | null {
  if (!r) return null;
  if (typeof r === "object" && "_id" in (r as Record<string, unknown>)) {
    const doc = r as Record<string, unknown>;
    return {
      _id: String(doc._id),
      title: String(doc.title ?? ""),
      description: String(doc.description ?? ""),
      image: String(doc.image ?? ""),
    };
  }
  return String(r);
}

export async function getAllPublishedServices() {
  try {
    await connectDB();
    const services = await Service.find({ published: true })
      .sort({ order: 1, title: 1 })
      .lean();
    return services.map((s) => ({
      ...s,
      _id: String(s._id),
      relatedServices: (s.relatedServices ?? []).map(toRelatedServiceRef),
      relatedOffer: toRelatedOfferRef(s.relatedOffer),
    }));
  } catch {
    return [];
  }
}

export type PublicServiceSummary = Awaited<
  ReturnType<typeof getAllPublishedServices>
>[number];

export async function getServiceBySlug(slug: string) {
  try {
    await connectDB();

    let service = null;
    try {
      service = await Service.findOne({ slug, published: true })
        .populate(
          "relatedServices",
          "title slug serviceNumber listingImage shortDescription",
        )
        .populate("relatedOffer", "title description image")
        .lean();
    } catch {
      // Populate can fail if a related schema isn't registered; still serve the page.
      service = await Service.findOne({ slug, published: true }).lean();
    }

    if (!service) return null;
    return {
      ...service,
      _id: String(service._id),
      relatedServices: (service.relatedServices ?? []).map(
        toRelatedServiceRef,
      ),
      relatedOffer: toRelatedOfferRef(service.relatedOffer),
    };
  } catch {
    return null;
  }
}

export type PublicServiceDetail = NonNullable<
  Awaited<ReturnType<typeof getServiceBySlug>>
>;

export async function getFeaturedServices(limit = 3) {
  try {
    await connectDB();
    const services = await Service.find({ published: true, featured: true })
      .sort({ order: 1 })
      .limit(limit)
      .lean();
    return services.map((s) => ({
      ...s,
      _id: String(s._id),
      relatedServices: (s.relatedServices ?? []).map(toRelatedServiceRef),
      relatedOffer: toRelatedOfferRef(s.relatedOffer),
    }));
  } catch {
    return [];
  }
}

export async function getServiceSlugs(): Promise<string[]> {
  try {
    await connectDB();
    const services = await Service.find({ published: true })
      .select("slug")
      .lean();
    return services.map((s) => s.slug);
  } catch {
    return [];
  }
}

export async function getGalleryCategories() {
  try {
    await connectDB();
    const categories = await GalleryCategory.find({ published: true })
      .sort({ order: 1, name: 1 })
      .lean();
    return categories.map((c) => ({
      ...c,
      _id: String(c._id),
    }));
  } catch {
    return [];
  }
}

export type PublicGalleryCategory = Awaited<
  ReturnType<typeof getGalleryCategories>
>[number];

export type PublicCategoryRef = { _id: string; name: string; slug: string };

function toCategoryRef(c: unknown): PublicCategoryRef | string | null {
  if (!c) return null;
  if (typeof c === "object" && "_id" in (c as Record<string, unknown>)) {
    const doc = c as Record<string, unknown>;
    return {
      _id: String(doc._id),
      name: String(doc.name ?? ""),
      slug: String(doc.slug ?? ""),
    };
  }
  return String(c);
}

export async function getAllGalleryProjects(options?: {
  categorySlug?: string;
}) {
  try {
    await connectDB();
    const query: Record<string, unknown> = { published: true };

    if (options?.categorySlug && options.categorySlug !== "all-projects") {
      const category = await GalleryCategory.findOne({
        slug: options.categorySlug,
        published: true,
      })
        .select("_id")
        .lean();
      if (!category) return [];
      query.category = category._id;
    }

    const projects = await GalleryProject.find(query)
      .sort({ order: 1 })
      .populate("category", "name slug")
      .lean();

    return projects.map((p) => ({
      ...p,
      _id: String(p._id),
      category: toCategoryRef(p.category),
    }));
  } catch {
    return [];
  }
}

export type PublicGalleryProject = Awaited<
  ReturnType<typeof getAllGalleryProjects>
>[number];

export type PublicProductServiceRef = { _id: string; title: string; slug: string };
export type PublicProductRelatedRef = {
  _id: string;
  title: string;
  slug: string;
  mainImage: string;
  price: number;
  showPrice: boolean;
};

function toProductServiceRef(
  r: unknown,
): PublicProductServiceRef | string | null {
  if (!r) return null;
  if (typeof r === "object" && "_id" in (r as Record<string, unknown>)) {
    const doc = r as Record<string, unknown>;
    return {
      _id: String(doc._id),
      title: String(doc.title ?? ""),
      slug: String(doc.slug ?? ""),
    };
  }
  return String(r);
}

function toProductRelatedRef(r: unknown): PublicProductRelatedRef | string {
  if (r && typeof r === "object" && "_id" in (r as Record<string, unknown>)) {
    const doc = r as Record<string, unknown>;
    return {
      _id: String(doc._id),
      title: String(doc.title ?? ""),
      slug: String(doc.slug ?? ""),
      mainImage: String(doc.mainImage ?? ""),
      price: Number(doc.price ?? 0),
      showPrice: Boolean(doc.showPrice),
    };
  }
  return String(r);
}

export async function getProductBySlug(slug: string) {
  try {
    await connectDB();
    const product = await Product.findOne({ slug, published: true })
      .populate("category", "name slug")
      .populate("relatedService", "title slug")
      .populate("relatedProducts", "title slug mainImage price showPrice")
      .lean();
    if (!product) return null;
    return {
      ...product,
      _id: String(product._id),
      category: toCategoryRef(product.category),
      relatedService: toProductServiceRef(product.relatedService),
      relatedProducts: (product.relatedProducts ?? []).map(
        toProductRelatedRef,
      ),
    };
  } catch {
    return null;
  }
}

export type PublicProductDetail = NonNullable<
  Awaited<ReturnType<typeof getProductBySlug>>
>;

export async function getProductSlugs(): Promise<string[]> {
  try {
    await connectDB();
    const products = await Product.find({ published: true })
      .select("slug")
      .lean();
    return products.map((p) => p.slug);
  } catch {
    return [];
  }
}

export async function getActiveOffers() {
  try {
    await connectDB();
    const now = new Date();
    const offers = await Offer.find({
      active: true,
      $and: [
        {
          $or: [{ startDate: null }, { startDate: { $lte: now } }],
        },
        {
          $or: [{ endDate: null }, { endDate: { $gte: now } }],
        },
      ],
    })
      .sort({ order: 1 })
      .lean();

    return offers.map((o) => ({
      ...o,
      _id: String(o._id),
      relatedService: o.relatedService ? String(o.relatedService) : null,
    }));
  } catch {
    return [];
  }
}

export async function getFeaturedGallery(limit = 8) {
  try {
    await connectDB();
    const projects = await GalleryProject.find({
      published: true,
      featured: true,
    })
      .sort({ order: 1 })
      .limit(limit)
      .populate("category", "name slug")
      .lean();

    return projects.map((p) => ({
      ...p,
      _id: String(p._id),
      category:
        p.category && typeof p.category === "object" && "_id" in p.category
          ? {
              _id: String((p.category as { _id: unknown })._id),
              name: String((p.category as { name?: string }).name ?? ""),
              slug: String((p.category as { slug?: string }).slug ?? ""),
            }
          : p.category
            ? String(p.category)
            : null,
    }));
  } catch {
    return [];
  }
}

export async function getPublishedFaqs(category?: string) {
  try {
    await connectDB();
    const query: Record<string, unknown> = { published: true };
    if (category) query.category = category;

    const faqs = await FAQ.find(query).sort({ order: 1 }).lean();
    return faqs.map((f) => ({
      ...f,
      _id: String(f._id),
    }));
  } catch {
    return [];
  }
}

export async function getPublishedTestimonials(options?: {
  featuredOnly?: boolean;
  limit?: number;
}) {
  try {
    await connectDB();
    const query: Record<string, unknown> = { published: true };
    if (options?.featuredOnly) query.featured = true;

    let q = Testimonial.find(query).sort({ order: 1 });
    if (options?.limit) q = q.limit(options.limit);

    const items = await q.lean();
    return items.map((t) => ({
      ...t,
      _id: String(t._id),
      service: t.service ? String(t.service) : null,
    }));
  } catch {
    return [];
  }
}

export async function getProductCategories(): Promise<PublicProductCategory[]> {
  try {
    await connectDB();
    const categories = await ProductCategory.find({ published: true })
      .sort({ order: 1, name: 1 })
      .lean();

    return categories.map((c) => ({
      id: String(c._id),
      name: c.name,
      slug: c.slug,
      description: c.description ?? "",
      image: c.image ?? "",
    }));
  } catch {
    return [];
  }
}

export async function getPublishedProducts(options?: {
  categorySlug?: string;
  featuredOnly?: boolean;
  limit?: number;
}) {
  try {
    await connectDB();
    const query: Record<string, unknown> = { published: true };
    if (options?.featuredOnly) query.featured = true;

    if (options?.categorySlug) {
      const category = await ProductCategory.findOne({
        slug: options.categorySlug,
        published: true,
      })
        .select("_id")
        .lean();
      if (!category) return [];
      query.category = category._id;
    }

    let q = Product.find(query)
      .sort({ order: 1, title: 1 })
      .populate("category", "name slug");
    if (options?.limit) q = q.limit(options.limit);

    const products = await q.lean();
    return products.map((p) => ({
      ...p,
      _id: String(p._id),
      category:
        p.category && typeof p.category === "object" && "_id" in p.category
          ? {
              _id: String((p.category as { _id: unknown })._id),
              name: String((p.category as { name?: string }).name ?? ""),
              slug: String((p.category as { slug?: string }).slug ?? ""),
            }
          : p.category
            ? String(p.category)
            : null,
      relatedService: p.relatedService ? String(p.relatedService) : null,
      relatedProducts: (p.relatedProducts ?? []).map((id) => String(id)),
    }));
  } catch {
    return [];
  }
}
