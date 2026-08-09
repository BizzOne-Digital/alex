/**
 * Declarative configuration describing which sections exist on each public
 * page and which fields of the shared `PageSection` schema apply to each one.
 * Keys MUST match the section keys used by public pages (`findSection(...)`).
 */

export type SectionFieldKey =
  | "eyebrow"
  | "heading"
  | "subheading"
  | "content"
  | "lists"
  | "ctaLabel"
  | "ctaLink"
  | "ctaSecondaryLabel"
  | "ctaSecondaryLink"
  | "primaryImage"
  | "secondaryImage"
  | "backgroundImage"
  | "beforeImage"
  | "afterImage"
  | "imageAlt"
  | "items";

export type SectionDefinition = {
  key: string;
  label: string;
  description?: string;
  fields: SectionFieldKey[];
  itemsLabel?: string;
};

export type PageDefinition = {
  slug: string;
  title: string;
  sections: SectionDefinition[];
};

const CTA_FIELDS: SectionFieldKey[] = [
  "ctaLabel",
  "ctaLink",
  "ctaSecondaryLabel",
  "ctaSecondaryLink",
];

const HERO_FIELDS: SectionFieldKey[] = [
  "eyebrow",
  "heading",
  "subheading",
  "primaryImage",
  "imageAlt",
  ...CTA_FIELDS,
];

const FINAL_CTA: SectionDefinition = {
  key: "final_cta",
  label: "Final Call To Action",
  fields: ["heading", "content", "subheading", "backgroundImage", ...CTA_FIELDS],
};

export const PAGE_DEFINITIONS: PageDefinition[] = [
  {
    slug: "home",
    title: "Home",
    sections: [
      {
        key: "hero",
        label: "Hero",
        description: "Full-bleed first viewport on the homepage.",
        fields: [
          "eyebrow",
          "heading",
          "subheading",
          "primaryImage",
          "imageAlt",
          ...CTA_FIELDS,
        ],
      },
      {
        key: "brand_positioning",
        label: "Brand Positioning",
        fields: [
          "eyebrow",
          "heading",
          "content",
          "primaryImage",
          "secondaryImage",
          "backgroundImage",
        ],
      },
      {
        key: "service_experience",
        label: "Services Experience",
        description: "Heading above the horizontal services swipe.",
        fields: ["eyebrow", "heading", "subheading"],
      },
      {
        key: "before_after",
        label: "Before & After Showcase",
        description: "Fallback images when a service has no before/after set.",
        fields: [
          "heading",
          "subheading",
          "beforeImage",
          "afterImage",
          "primaryImage",
          "secondaryImage",
        ],
      },
      {
        key: "one_stop",
        label: "One-Stop Process",
        fields: ["heading", "content", "lists", "primaryImage"],
      },
      {
        key: "kitchen_feature",
        label: "Kitchen Feature",
        fields: ["heading", "content", "lists", "primaryImage", "imageAlt", ...CTA_FIELDS],
      },
      {
        key: "bathroom_feature",
        label: "Bathroom Feature",
        fields: ["heading", "content", "lists", "primaryImage", "imageAlt", ...CTA_FIELDS],
      },
      {
        key: "closet_feature",
        label: "Closet Feature",
        fields: ["heading", "content", "lists", "primaryImage", "imageAlt", ...CTA_FIELDS],
      },
      {
        key: "special_offers",
        label: "Special Offers",
        fields: ["eyebrow", "heading", "subheading", ...CTA_FIELDS],
      },
      {
        key: "timeline",
        label: "Timeline",
        fields: ["heading", "content", "lists", "primaryImage"],
      },
      {
        key: "selected_projects",
        label: "Selected Projects",
        fields: ["eyebrow", "heading", "subheading", ...CTA_FIELDS],
      },
      {
        key: "testimonials",
        label: "Testimonials Highlight",
        fields: ["eyebrow", "heading", "subheading"],
      },
      {
        key: "faq_preview",
        label: "FAQ Preview",
        fields: ["eyebrow", "heading", "subheading", ...CTA_FIELDS],
      },
      FINAL_CTA,
    ],
  },
  {
    slug: "about",
    title: "About",
    sections: [
      {
        key: "hero",
        label: "Hero",
        fields: HERO_FIELDS,
      },
      {
        key: "introduction",
        label: "Introduction",
        fields: ["heading", "content", "primaryImage", "imageAlt"],
      },
      {
        key: "philosophy",
        label: "Philosophy",
        fields: ["eyebrow", "heading", "content", "secondaryImage"],
      },
      {
        key: "one_stop",
        label: "One-Stop Approach",
        fields: ["heading", "content", "lists", "primaryImage"],
      },
      {
        key: "expertise",
        label: "Expertise",
        fields: ["heading", "content", "items"],
        itemsLabel: "Expertise cards",
      },
      {
        key: "guidance",
        label: "Guidance",
        fields: ["heading", "content", "primaryImage", "secondaryImage", ...CTA_FIELDS],
      },
      {
        key: "process",
        label: "Process",
        fields: ["heading", "subheading", "lists", "items"],
        itemsLabel: "Process steps",
      },
      {
        key: "timeline",
        label: "Timeline",
        fields: ["heading", "content", "lists", "primaryImage"],
      },
      {
        key: "mosaic",
        label: "Inspiration Mosaic",
        fields: ["heading", "subheading", "items"],
        itemsLabel: "Mosaic images",
      },
      {
        key: "offers_preview",
        label: "Offers Preview",
        fields: ["heading", "subheading", "content", ...CTA_FIELDS],
      },
      FINAL_CTA,
    ],
  },
  {
    slug: "services",
    title: "Services",
    sections: [
      {
        key: "hero",
        label: "Hero",
        fields: HERO_FIELDS,
      },
      {
        key: "overview",
        label: "Overview",
        fields: ["heading", "content", "primaryImage"],
      },
      {
        key: "service_rows",
        label: "Service Rows",
        description: "Heading above the published services list.",
        fields: ["heading", "subheading"],
      },
      {
        key: "kitchen_expertise",
        label: "Kitchen Expertise Card",
        fields: ["heading", "content", "primaryImage"],
      },
      {
        key: "bathroom_expertise",
        label: "Bathroom Expertise Card",
        fields: ["heading", "content", "primaryImage"],
      },
      {
        key: "closet_expertise",
        label: "Closet Expertise Card",
        fields: ["heading", "content", "primaryImage"],
      },
      {
        key: "product_guidance",
        label: "Product Guidance",
        fields: ["heading", "content", "primaryImage", ...CTA_FIELDS],
      },
      {
        key: "process",
        label: "Process",
        fields: ["heading", "lists"],
      },
      {
        key: "estimate",
        label: "Estimate CTA",
        description: "No prices — consultation-focused message only.",
        fields: ["heading", "content", "ctaLabel", "ctaLink"],
      },
      {
        key: "collage",
        label: "Materials Collage",
        fields: ["heading", "items"],
        itemsLabel: "Material images",
      },
      FINAL_CTA,
    ],
  },
  {
    slug: "gallery",
    title: "Gallery",
    sections: [
      {
        key: "hero",
        label: "Hero",
        fields: HERO_FIELDS,
      },
      {
        key: "featured",
        label: "Featured Transformation",
        fields: ["heading", "content", "beforeImage", "afterImage"],
      },
      {
        key: "filters",
        label: "Browse Heading",
        fields: ["heading", "subheading"],
      },
      {
        key: "before_after",
        label: "Before & After Comparison",
        fields: ["heading", "primaryImage", "secondaryImage"],
      },
      {
        key: "project_info",
        label: "Project Information Note",
        fields: ["content"],
      },
      FINAL_CTA,
    ],
  },
  {
    slug: "testimonials",
    title: "Testimonials",
    sections: [
      {
        key: "hero",
        label: "Hero",
        fields: HERO_FIELDS,
      },
      {
        key: "featured",
        label: "Featured Strip Heading",
        fields: ["heading", "subheading", "content"],
      },
      {
        key: "image_strip",
        label: "Image Strip",
        fields: ["heading", "items"],
        itemsLabel: "Strip images",
      },
      FINAL_CTA,
    ],
  },
  {
    slug: "booking",
    title: "Booking",
    sections: [
      {
        key: "hero",
        label: "Hero",
        fields: HERO_FIELDS,
      },
      {
        key: "intro",
        label: "What To Expect",
        fields: ["heading", "content", "lists"],
      },
      {
        key: "form",
        label: "Booking Form Intro",
        fields: ["heading", "content"],
      },
      {
        key: "assurance",
        label: "Assurance Note",
        fields: ["heading", "content"],
      },
      FINAL_CTA,
    ],
  },
  {
    slug: "faq",
    title: "FAQ",
    sections: [
      {
        key: "hero",
        label: "Hero",
        fields: HERO_FIELDS,
      },
      {
        key: "intro",
        label: "Introduction",
        fields: ["heading", "content"],
      },
      {
        key: "still_questions",
        label: "Still Have Questions",
        fields: ["heading", ...CTA_FIELDS],
      },
      FINAL_CTA,
    ],
  },
  {
    slug: "contact",
    title: "Contact",
    sections: [
      {
        key: "hero",
        label: "Hero",
        fields: HERO_FIELDS,
      },
      {
        key: "details",
        label: "Contact Details Heading",
        fields: ["heading", "content"],
      },
      {
        key: "form",
        label: "Contact Form Intro",
        fields: ["heading", "content", "subheading"],
      },
      {
        key: "hours",
        label: "Hours Note",
        fields: ["heading", "content", "lists"],
      },
      FINAL_CTA,
    ],
  },
];

export function getPageDefinition(slug: string): PageDefinition | undefined {
  return PAGE_DEFINITIONS.find((p) => p.slug === slug);
}

export function isKnownPageSlug(slug: string): boolean {
  return PAGE_DEFINITIONS.some((p) => p.slug === slug);
}
