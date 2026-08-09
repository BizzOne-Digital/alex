import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check, X } from "lucide-react";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { Reveal } from "@/components/motion/Reveal";
import { FinalCta } from "@/components/sections/FinalCta";
import { PageHero } from "@/components/sections/PageHero";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getServiceBySlug, getServiceSlugs, getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const slugs = await getServiceSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [service, settings] = await Promise.all([
    getServiceBySlug(slug),
    getSettings(),
  ]);
  if (!service) return { title: `Service | ${settings.companyName}` };
  return {
    title: service.seoTitle || `${service.title} | ${settings.companyName}`,
    description: service.seoDescription || service.shortDescription,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const relatedOffer =
    service.relatedOffer && typeof service.relatedOffer === "object"
      ? service.relatedOffer
      : null;

  return (
    <>
      <PageHero
        eyebrow={`Service ${service.serviceNumber || ""}`.trim()}
        title={service.title}
        subheading={service.shortDescription}
        image={service.heroImage || service.listingImage || ""}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: service.title },
        ]}
        ctaLabel="Book a Free Consultation"
        ctaLink="/booking"
      />

      {/* Description + inclusions */}
      <section className="bg-ikasa-warm-white py-24 lg:py-28">
        <Container>
          <div className="grid items-start gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <div className="min-w-0">
              <SectionHeading eyebrow="Overview" title="What's Included" />
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-ikasa-medium-grey sm:text-lg">
                {service.description}
              </p>
              {service.inclusions?.length ? (
                <ul className="mt-8 grid grid-cols-1 gap-x-10 gap-y-3.5 sm:grid-cols-2">
                  {service.inclusions.map((item, i) => (
                    <li
                      key={`${item}-${i}`}
                      className="flex items-start gap-2.5 text-sm leading-snug text-ikasa-charcoal"
                    >
                      <Check
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ikasa-red"
                        aria-hidden
                      />
                      <span className="min-w-0">{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            {service.problems?.length ? (
              <Reveal direction="left">
                <aside className="border border-ikasa-light-grey bg-white p-7 shadow-[0_12px_40px_rgba(9,9,9,0.06)] sm:p-8">
                  <p className="font-label text-[0.65rem] tracking-[0.2em] text-ikasa-red">
                    Common Problems We Solve
                  </p>
                  <ul className="mt-6 space-y-4">
                    {service.problems.map((problem, i) => (
                      <li
                        key={`${problem}-${i}`}
                        className="flex items-start gap-3 border-b border-ikasa-light-grey/80 pb-4 last:border-b-0 last:pb-0"
                      >
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border border-ikasa-red/30 bg-ikasa-red/5">
                          <X
                            className="h-3 w-3 text-ikasa-red"
                            aria-hidden
                          />
                        </span>
                        <span className="text-sm leading-relaxed text-ikasa-charcoal">
                          {problem}
                        </span>
                      </li>
                    ))}
                  </ul>
                </aside>
              </Reveal>
            ) : null}
          </div>
        </Container>
      </section>

      {/* Before / after */}
      {service.beforeImage && service.afterImage ? (
        <section className="section-dark bg-ikasa-black py-24 text-ikasa-white lg:py-28">
          <Container>
            <SectionHeading
              eyebrow="Transformation"
              title="See the Possibility"
              tone="light"
            />
            <div className="mt-12">
              <BeforeAfterSlider
                beforeSrc={service.beforeImage}
                afterSrc={service.afterImage}
                className="border border-white/10"
              />
              <p className="mt-4 font-label text-[0.6rem] tracking-[0.14em] text-ikasa-medium-grey">
                Illustrative design reference — not a claimed completed Ikasa
                project.
              </p>
            </div>
          </Container>
        </section>
      ) : null}

      {/* Gallery images */}
      {service.galleryImages?.length ? (
        <section className="bg-ikasa-warm-white py-24 lg:py-28">
          <Container>
            <SectionHeading eyebrow="Gallery" title="Design References" />
            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {service.galleryImages.map((image, i) => (
                <Reveal key={image + i} delay={i * 0.06}>
                  <div className="relative aspect-square overflow-hidden">
                    <ImageWithFallback
                      src={image}
                      alt={`${service.title} design reference ${i + 1}`}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-110"
                      sizes="(max-width: 768px) 50vw, 20vw"
                    />
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {/* Design options */}
      {service.designOptions?.length ? (
        <section className="section-dark bg-ikasa-black py-24 text-ikasa-white lg:py-28">
          <Container>
            <SectionHeading eyebrow="Design Direction" title="Design Options" tone="light" />
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {service.designOptions.slice(0, 3).map((option, i) => (
                <Reveal key={option.title} delay={i * 0.1} className="h-full">
                  <div className="group relative flex h-full flex-col overflow-hidden border border-white/10">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <ImageWithFallback
                        src={option.image || ""}
                        alt={option.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <h3 className="font-heading text-lg tracking-tight text-ikasa-white">
                        {option.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-ikasa-light-grey">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {/* Materials */}
      {service.materials?.length ? (
        <section className="bg-ikasa-warm-white py-24 lg:py-28">
          <Container>
            <SectionHeading eyebrow="Materials" title="Material Direction" />
            <div className="mt-14 grid gap-6 sm:grid-cols-3">
              {service.materials.map((material) => (
                <div key={material.name} className="group relative overflow-hidden">
                  <div className="relative aspect-square overflow-hidden">
                    <ImageWithFallback
                      src={material.image || ""}
                      alt={material.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <p className="mt-3 font-heading text-base text-ikasa-black">
                    {material.name}
                  </p>
                  <p className="mt-1 text-sm text-ikasa-medium-grey">
                    {material.description}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {/* Process steps */}
      {service.processSteps?.length ? (
        <section className="section-dark bg-ikasa-black py-24 text-ikasa-white lg:py-28">
          <Container>
            <SectionHeading eyebrow="Process" title="How This Service Works" tone="light" />
            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[...service.processSteps]
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                .map((step, i) => (
                  <Reveal key={step.title} delay={i * 0.1}>
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <ImageWithFallback
                        src={step.image || ""}
                        alt={step.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                      <span className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center border border-white/20 bg-ikasa-black/70 font-label text-[0.65rem] text-ikasa-red backdrop-blur-sm">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="mt-4 font-heading text-lg tracking-tight">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ikasa-light-grey/75">
                      {step.description}
                    </p>
                  </Reveal>
                ))}
            </div>

            {service.timeline ? (
              <p className="mx-auto mt-14 max-w-2xl text-center text-sm leading-relaxed text-ikasa-medium-grey">
                {service.timeline}
              </p>
            ) : null}
          </Container>
        </section>
      ) : null}

      {/* Related offer */}
      {relatedOffer ? (
        <section className="bg-ikasa-red py-16 text-center text-ikasa-white">
          <Container narrow>
            <p className="font-label text-[0.65rem] tracking-[0.2em]">
              Current Offer
            </p>
            <h3 className="mt-3 font-heading text-2xl tracking-tight sm:text-3xl">
              {relatedOffer.title}
            </h3>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/90">
              {relatedOffer.description}
            </p>
            <div className="mt-6">
              <Button href="/booking" variant="secondary">
                Book to Discuss
              </Button>
            </div>
          </Container>
        </section>
      ) : null}

      {/* Related services */}
      {service.relatedServices?.length ? (
        <section className="bg-ikasa-warm-white py-24 lg:py-28">
          <Container>
            <SectionHeading eyebrow="Explore More" title="Related Services" />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {service.relatedServices.map((related) =>
                typeof related === "object" ? (
                  <Link
                    key={related._id}
                    href={`/services/${related.slug}`}
                    className="group relative flex h-64 flex-col justify-end overflow-hidden border border-ikasa-light-grey"
                  >
                    <ImageWithFallback
                      src={related.listingImage || ""}
                      alt={related.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ikasa-black/85 to-transparent" />
                    <div className="relative z-10 p-5">
                      <p className="font-heading text-lg text-ikasa-white">
                        {related.title}
                      </p>
                      <span className="mt-1 inline-flex items-center gap-1 font-label text-[0.6rem] tracking-[0.16em] text-ikasa-red">
                        View Service <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </Link>
                ) : null,
              )}
            </div>
          </Container>
        </section>
      ) : null}

      <FinalCta
        heading={`Ready to Start Your ${service.title}?`}
        content="Book a free consultation and we will prepare a custom proposal for your space."
        ctaLabel="Book a Free Consultation"
        ctaLink="/booking"
        ctaSecondaryLabel="View All Services"
        ctaSecondaryLink="/services"
        backgroundImage={service.heroImage || undefined}
      />
    </>
  );
}
