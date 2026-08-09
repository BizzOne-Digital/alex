import type { Metadata } from "next";
import { Quote, Star } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { FinalCta } from "@/components/sections/FinalCta";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  findSection,
  getPageBySlug,
  getPublishedTestimonials,
  getSettings,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([
    getPageBySlug("testimonials"),
    getSettings(),
  ]);
  return {
    title: page?.seoTitle || `Testimonials | ${settings.companyName}`,
    description: page?.seoDescription || settings.shortDescription,
  };
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < rating ? "fill-ikasa-red text-ikasa-red" : "text-ikasa-graphite"
          }`}
        />
      ))}
    </div>
  );
}

export default async function TestimonialsPage() {
  const [page, testimonials] = await Promise.all([
    getPageBySlug("testimonials"),
    getPublishedTestimonials(),
  ]);

  const hero = findSection(page, "hero");
  const featuredSection = findSection(page, "featured");
  const imageStrip = findSection(page, "image_strip");
  const finalCta = findSection(page, "final_cta");

  const featured = testimonials.filter((t) => t.featured);
  const rest = testimonials.filter((t) => !t.featured);

  return (
    <>
      <PageHero
        eyebrow={hero?.eyebrow || "Testimonials"}
        title={hero?.heading || "Homeowners, In Their Words"}
        subheading={hero?.subheading}
        image={hero?.primaryImage || hero?.backgroundImage}
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Testimonials" }]}
      />

      {featured.length ? (
        <section className="section-dark bg-ikasa-black py-24 text-ikasa-white lg:py-28">
          <Container>
            <SectionHeading
              eyebrow="Featured"
              title={featuredSection?.heading || "Featured Feedback"}
              tone="light"
            />
            <div className="mt-14 -mx-5 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
              {featured.map((t) => (
                <figure
                  key={t._id}
                  className="flex w-[20rem] shrink-0 snap-start flex-col border border-white/10 bg-white/[0.03] p-8 sm:w-[24rem]"
                >
                  <Quote className="h-8 w-8 text-ikasa-red" />
                  <blockquote className="mt-5 flex-1 text-base leading-relaxed text-ikasa-light-grey/90">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <div className="mt-6">
                    <Stars rating={t.rating ?? 5} />
                  </div>
                  <figcaption className="mt-4 border-t border-white/10 pt-4">
                    <p className="font-heading text-lg">{t.name}</p>
                    {t.projectType || t.role || t.location ? (
                      <p className="mt-0.5 text-xs text-ikasa-medium-grey">
                        {[t.projectType || t.role, t.location]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    ) : null}
                  </figcaption>
                </figure>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <section className="bg-ikasa-warm-white py-24 lg:py-28">
        <Container>
          <SectionHeading eyebrow="More Notes" title="More Client Notes" />
          {rest.length ? (
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((t, i) => (
                <Reveal key={t._id} delay={(i % 6) * 0.06}>
                  <figure className="flex h-full flex-col border border-ikasa-light-grey bg-white p-7">
                    <Stars rating={t.rating ?? 5} />
                    <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ikasa-charcoal">
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>
                    <figcaption className="mt-5 border-t border-ikasa-light-grey pt-4">
                      <p className="font-heading text-base text-ikasa-black">
                        {t.name}
                      </p>
                      {t.projectType || t.role || t.location ? (
                        <p className="mt-0.5 text-xs text-ikasa-medium-grey">
                          {[t.projectType || t.role, t.location]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      ) : null}
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="mt-12 text-center text-sm text-ikasa-medium-grey">
              {testimonials.length
                ? "All published testimonials are featured above."
                : "Verified testimonials will appear here once published."}
            </p>
          )}
        </Container>
      </section>

      {imageStrip?.items?.length ? (
        <section className="bg-ikasa-black py-4">
          <div className="grid grid-cols-2 gap-1 sm:grid-cols-5">
            {imageStrip.items.map((item, i) => (
              <div key={i} className="relative aspect-square overflow-hidden">
                <ImageWithFallback
                  src={item.image || ""}
                  alt="Renovation atmosphere reference"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 20vw"
                />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <FinalCta
        heading={finalCta?.heading || "Start Your Own Transformation"}
        ctaLabel={finalCta?.ctaLabel || "Book a Free Consultation"}
        ctaLink={finalCta?.ctaLink || "/booking"}
        backgroundImage={finalCta?.backgroundImage}
      />
    </>
  );
}
