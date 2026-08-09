"use server";

import { connectDB } from "@/lib/db";
import {
  Booking,
  ContactInquiry,
  FAQ,
  GalleryProject,
  Page,
  Offer,
  Service,
  Testimonial,
} from "@/models";
import { assertAdmin } from "@/lib/admin/guard";
import { serializeDoc } from "@/lib/admin/serialize";
import { PAGE_DEFINITIONS } from "@/lib/admin/page-sections";

export type DashboardStats = {
  pages: { total: number; published: number };
  services: { total: number; published: number; draft: number };
  gallery: { total: number; published: number; draft: number };
  testimonials: { total: number; published: number; draft: number };
  faqs: { total: number; published: number; draft: number };
  offers: { total: number; active: number };
  bookings: { total: number; new: number };
  inquiries: { total: number; new: number };
  recentBookings: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    serviceName: string;
    status: string;
    createdAt: string;
  }[];
  recentlyUpdated: {
    type: string;
    label: string;
    updatedAt: string;
    href: string;
  }[];
};

export async function getDashboardStats(): Promise<DashboardStats> {
  await assertAdmin();
  await connectDB();

  const [
    pagesCount,
    servicesTotal,
    servicesPublished,
    galleryTotal,
    galleryPublished,
    testimonialsTotal,
    testimonialsPublished,
    faqsTotal,
    faqsPublished,
    offersTotal,
    offersActive,
    bookingsTotal,
    bookingsNew,
    inquiriesTotal,
    inquiriesNew,
    recentBookingsRaw,
    recentServices,
    recentGallery,
    recentTestimonials,
  ] = await Promise.all([
    Page.countDocuments({}),
    Service.countDocuments({}),
    Service.countDocuments({ published: true }),
    GalleryProject.countDocuments({}),
    GalleryProject.countDocuments({ published: true }),
    Testimonial.countDocuments({}),
    Testimonial.countDocuments({ published: true }),
    FAQ.countDocuments({}),
    FAQ.countDocuments({ published: true }),
    Offer.countDocuments({}),
    Offer.countDocuments({ active: true }),
    Booking.countDocuments({}),
    Booking.countDocuments({ status: "New" }),
    ContactInquiry.countDocuments({}),
    ContactInquiry.countDocuments({ status: "New" }),
    Booking.find({}).sort({ createdAt: -1 }).limit(6).lean(),
    Service.find({}).sort({ updatedAt: -1 }).limit(3).select("title slug updatedAt").lean(),
    GalleryProject.find({}).sort({ updatedAt: -1 }).limit(3).select("title updatedAt").lean(),
    Testimonial.find({}).sort({ updatedAt: -1 }).limit(3).select("name updatedAt").lean(),
  ]);

  const recentlyUpdated = [
    ...recentServices.map((s) => ({
      type: "Service",
      label: s.title,
      updatedAt: new Date(s.updatedAt as Date).toISOString(),
      href: `/admin/services/${s._id.toString()}`,
    })),
    ...recentGallery.map((g) => ({
      type: "Gallery",
      label: g.title,
      updatedAt: new Date(g.updatedAt as Date).toISOString(),
      href: `/admin/gallery`,
    })),
    ...recentTestimonials.map((t) => ({
      type: "Testimonial",
      label: t.name,
      updatedAt: new Date(t.updatedAt as Date).toISOString(),
      href: `/admin/testimonials`,
    })),
  ]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6);

  return {
    pages: { total: PAGE_DEFINITIONS.length, published: pagesCount },
    services: {
      total: servicesTotal,
      published: servicesPublished,
      draft: servicesTotal - servicesPublished,
    },
    gallery: {
      total: galleryTotal,
      published: galleryPublished,
      draft: galleryTotal - galleryPublished,
    },
    testimonials: {
      total: testimonialsTotal,
      published: testimonialsPublished,
      draft: testimonialsTotal - testimonialsPublished,
    },
    faqs: { total: faqsTotal, published: faqsPublished, draft: faqsTotal - faqsPublished },
    offers: { total: offersTotal, active: offersActive },
    bookings: { total: bookingsTotal, new: bookingsNew },
    inquiries: { total: inquiriesTotal, new: inquiriesNew },
    recentBookings: serializeDoc(recentBookingsRaw).map((b) => ({
      _id: b._id,
      firstName: b.firstName,
      lastName: b.lastName,
      email: b.email,
      serviceName: b.serviceName,
      status: b.status,
      createdAt: b.createdAt,
    })),
    recentlyUpdated,
  };
}
