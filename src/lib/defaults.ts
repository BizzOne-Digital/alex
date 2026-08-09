/** Fallback site settings when MongoDB is unavailable or empty. */
export const DEFAULT_SITE_SETTINGS = {
  key: "site",
  companyName: "Ikasa Renovations",
  shortDescription:
    "Ikasa Renovations helps homeowners transform outdated kitchens, bathrooms, closets, and interior spaces into beautiful, organised, functional environments—through design, product guidance, supply, installation, and complete renovation coordination.",
  email: "contact@ikasarenovations.ca",
  primaryPhone: "647-377-3694",
  phoneTel: "+16473773694",
  secondaryPhone: "",
  address: "",
  serviceArea:
    "Contact us to discuss your project location and whether we can support your renovation.",
  businessHours:
    "Consultations by appointment. Call or book online to arrange a convenient time.",
  instagramUrl: "",
  facebookUrl: "",
  tiktokUrl: "",
  youtubeUrl: "",
  headerLogo: "/brand/ikasa-logo-light.svg",
  footerLogo: "/brand/ikasa-logo-light.svg",
  favicon: "/brand/ikasa-favicon.svg",
  headerCtaLabel: "Book a Free Consultation",
  headerCtaLink: "/booking",
  footerCtaLabel: "Book a Free Consultation",
  footerCtaLink: "/booking",
  bookingMessage:
    "Your selected date and time is a requested appointment. An Ikasa Renovations team member will contact you to confirm availability before your consultation is confirmed.",
  defaultSeoTitle: "Ikasa Renovations | From Outdated to Outstanding",
  defaultSeoDescription:
    "Custom kitchen, bathroom and closet renovations—designed, supplied and professionally installed. Book a free consultation with Ikasa Renovations.",
  googleMapsUrl: "",
  copyright: `© ${new Date().getFullYear()} Ikasa Renovations`,
  timelineDisclaimer:
    "Project timelines are planning targets, not guarantees. Actual schedules depend on scope, product availability, custom manufacturing, site conditions, inspections, client changes and trade coordination.",
  offerDisclaimer:
    "Special offers are subject to eligibility, model selection, product availability, site compatibility and installation conditions. Confirm current offer details during your consultation. Offers may change or end without notice.",
} as const;

export type PublicSiteSettings = {
  companyName: string;
  shortDescription: string;
  email: string;
  primaryPhone: string;
  phoneTel: string;
  secondaryPhone: string;
  address: string;
  serviceArea: string;
  businessHours: string;
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
  youtubeUrl: string;
  headerLogo: string;
  footerLogo: string;
  favicon: string;
  headerCtaLabel: string;
  headerCtaLink: string;
  footerCtaLabel: string;
  footerCtaLink: string;
  bookingMessage: string;
  defaultSeoTitle: string;
  defaultSeoDescription: string;
  googleMapsUrl: string;
  copyright: string;
  timelineDisclaimer: string;
  offerDisclaimer: string;
};

export type PublicServiceNavItem = {
  id: string;
  title: string;
  slug: string;
  serviceNumber: string;
  shortDescription: string;
};

export type PublicProductCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
};
