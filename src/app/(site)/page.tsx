import type { Metadata } from "next";
import { BeforeAfterShowcase, type BeforeAfterTab } from "@/components/home/BeforeAfterShowcase";
import { BrandPositioning } from "@/components/home/BrandPositioning";
import { FaqPreviewSection } from "@/components/home/FaqPreviewSection";
import { FeatureShowcase } from "@/components/home/FeatureShowcase";
import { FeaturedGallerySection } from "@/components/home/FeaturedGallerySection";
import { Hero } from "@/components/home/Hero";
import { OffersSection } from "@/components/home/OffersSection";
import { OneStopProcess } from "@/components/home/OneStopProcess";
import { ServicesHorizontal } from "@/components/home/ServicesHorizontal";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { TimelineSection } from "@/components/home/TimelineSection";
import { FinalCta } from "@/components/sections/FinalCta";
import {
  findSection,
  getActiveOffers,
  getAllPublishedServices,
  getFeaturedGallery,
  getPageBySlug,
  getPublishedFaqs,
  getPublishedTestimonials,
  getSettings,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([
    getPageBySlug("home"),
    getSettings(),
  ]);
  return {
    title: page?.seoTitle || settings.defaultSeoTitle,
    description: page?.seoDescription || settings.defaultSeoDescription,
  };
}

function findService(
  services: Awaited<ReturnType<typeof getAllPublishedServices>>,
  slug: string,
) {
  return services.find((s) => s.slug === slug) ?? null;
}

export default async function HomePage() {
  const [
    page,
    services,
    offers,
    gallery,
    testimonials,
    faqs,
    settings,
  ] = await Promise.all([
    getPageBySlug("home"),
    getAllPublishedServices(),
    getActiveOffers(),
    getFeaturedGallery(8),
    getPublishedTestimonials({ limit: 6 }),
    getPublishedFaqs(),
    getSettings(),
  ]);

  const kitchenService = findService(services, "full-kitchen-makeovers");
  const bathroomService = findService(services, "complete-bathroom-makeovers");
  const closetService = findService(services, "walk-in-closets-and-wardrobes");

  const beforeAfterSection = findSection(page, "before_after");

  const tabs: BeforeAfterTab[] = [
    {
      key: "kitchen",
      label: "Kitchen",
      before:
        kitchenService?.beforeImage || beforeAfterSection?.beforeImage || "",
      after: kitchenService?.afterImage || beforeAfterSection?.afterImage || "",
    },
    {
      key: "bathroom",
      label: "Bathroom",
      before:
        bathroomService?.beforeImage || beforeAfterSection?.primaryImage || "",
      after:
        bathroomService?.afterImage || beforeAfterSection?.secondaryImage || "",
    },
    {
      key: "closet",
      label: "Closet",
      before: closetService?.beforeImage || beforeAfterSection?.beforeImage || "",
      after: closetService?.afterImage || beforeAfterSection?.afterImage || "",
    },
  ].filter((tab) => tab.before && tab.after);

  const finalCta = findSection(page, "final_cta");

  return (
    <>
      <Hero section={findSection(page, "hero")} />

      <BrandPositioning section={findSection(page, "brand_positioning")} />

      <ServicesHorizontal
        eyebrow={findSection(page, "service_experience")?.eyebrow}
        heading={
          findSection(page, "service_experience")?.heading ||
          "A Complete Renovation Experience"
        }
        subheading={findSection(page, "service_experience")?.subheading}
        services={services}
      />

      {tabs.length ? (
        <BeforeAfterShowcase
          eyebrow="Transformations"
          heading={
            beforeAfterSection?.heading || "See What Transformation Looks Like"
          }
          subheading={beforeAfterSection?.subheading}
          tabs={tabs}
        />
      ) : null}

      <OneStopProcess section={findSection(page, "one_stop")} />

      <FeatureShowcase
        section={findSection(page, "kitchen_feature")}
        tag="Kitchen"
        index="01"
        tone="warm"
      />
      <FeatureShowcase
        section={findSection(page, "bathroom_feature")}
        tag="Bathroom"
        index="02"
        tone="black"
        reverse
      />
      <FeatureShowcase
        section={findSection(page, "closet_feature")}
        tag="Closet"
        index="03"
        tone="warm"
      />

      <OffersSection
        section={findSection(page, "special_offers")}
        offers={offers}
        disclaimer={settings.offerDisclaimer}
      />

      <TimelineSection
        section={findSection(page, "timeline")}
        disclaimer={settings.timelineDisclaimer}
      />

      <FeaturedGallerySection
        section={findSection(page, "selected_projects")}
        projects={gallery}
      />

      <TestimonialsSection
        section={findSection(page, "testimonials")}
        testimonials={testimonials}
      />

      <FaqPreviewSection section={findSection(page, "faq_preview")} faqs={faqs} />

      <FinalCta
        heading={finalCta?.heading || "Ready to Love Your Home Again?"}
        content={finalCta?.content}
        ctaLabel={finalCta?.ctaLabel || "Book a Free Consultation"}
        ctaLink={finalCta?.ctaLink || "/booking"}
        ctaSecondaryLabel={finalCta?.ctaSecondaryLabel}
        ctaSecondaryLink={finalCta?.ctaSecondaryLink}
        backgroundImage={finalCta?.backgroundImage}
      />
    </>
  );
}
