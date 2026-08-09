import { revalidatePath } from "next/cache";

/**
 * Central map of which public routes need to be revalidated when admin
 * content changes. Keeping this in one place means every server action
 * stays consistent about cache invalidation.
 */

const PAGE_SLUG_TO_PATH: Record<string, string> = {
  home: "/",
  about: "/about",
  services: "/services",
  gallery: "/gallery",
  testimonials: "/testimonials",
  booking: "/booking",
  shop: "/shop",
  faq: "/faq",
  contact: "/contact",
};

export function revalidatePageSlug(slug: string): void {
  const path = PAGE_SLUG_TO_PATH[slug];
  revalidatePath(path ?? "/");
  revalidatePath("/admin/pages");
  revalidatePath(`/admin/pages/${slug}`);
}

export function revalidateServices(slug?: string | null): void {
  revalidatePath("/");
  revalidatePath("/services");
  if (slug) revalidatePath(`/services/${slug}`);
  revalidatePath("/admin/services");
}

export function revalidateGallery(categorySlug?: string | null): void {
  revalidatePath("/");
  revalidatePath("/gallery");
  if (categorySlug) revalidatePath(`/gallery/${categorySlug}`);
  revalidatePath("/admin/gallery");
}

export function revalidateTestimonials(): void {
  revalidatePath("/");
  revalidatePath("/testimonials");
  revalidatePath("/admin/testimonials");
}

export function revalidateFaqs(): void {
  revalidatePath("/");
  revalidatePath("/faq");
  revalidatePath("/admin/faqs");
}

export function revalidateOffers(): void {
  revalidatePath("/");
  revalidatePath("/offers");
  revalidatePath("/admin/offers");
}

/** Settings affect header/footer/SEO defaults across the entire public site. */
export function revalidateSettings(): void {
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
}

export function revalidateBookingsAdmin(id?: string | null): void {
  revalidatePath("/admin/bookings");
  if (id) revalidatePath(`/admin/bookings/${id}`);
  revalidatePath("/admin");
}

export function revalidateInquiriesAdmin(): void {
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin");
}

export function revalidateDashboard(): void {
  revalidatePath("/admin");
}
