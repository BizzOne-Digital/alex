import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProcessTimeline } from "@/components/home/ProcessTimeline";
import { Reveal } from "@/components/motion/Reveal";
import { FinalCta } from "@/components/sections/FinalCta";
import { PageHero } from "@/components/sections/PageHero";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  findSection,
  getAllPublishedServices,
  getPageBySlug,
  getSettings,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([
    getPageBySlug("services"),
    getSettings(),
  ]);
  return {
    title: page?.seoTitle || `Services | ${settings.companyName}`,
    description: page?.seoDescription || settings.shortDescription,
  };
}

export default async function ServicesPage() {
  const [page, services] = await Promise.all([
    getPageBySlug("services"),
    getAllPublishedServices(),
  ]);

  const hero = findSection(page, "hero");
  const overview = findSection(page, "overview");
  const serviceRows = findSection(page, "service_rows");
  const kitchenExpertise = findSection(page, "kitchen_expertise");
  const bathroomExpertise = findSection(page, "bathroom_expertise");
  const closetExpertise = findSection(page, "closet_expertise");
  const productGuidance = findSection(page, "product_guidance");
  const process = findSection(page, "process");
  const estimate = findSection(page, "estimate");
  const collage = findSection(page, "collage");
  const finalCta = findSection(page, "final_cta");

  return (
    <>
      <PageHero
        eyebrow={hero?.eyebrow || "Services"}
        title={hero?.heading || "Better Spaces for Everyday Living"}
        subheading={hero?.subheading}
        image={hero?.primaryImage || hero?.backgroundImage}
        imageAlt={hero?.imageAlt}
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Services" }]}
      />

      {overview ? (
        <section className="bg-ikasa-warm-white py-20 lg:py-24">
          <Container className="grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
            <SectionHeading
              eyebrow="Overview"
              title={overview.heading}
              description={overview.content}
            />
            <Reveal direction="left">
              <div className="relative aspect-[4/3] overflow-hidden">
                <ImageWithFallback
                  src={overview.primaryImage || ""}
                  alt="Renovation planning — illustrative reference"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                />
              </div>
            </Reveal>
          </Container>
        </section>
      ) : null}

      {/* Alternating service rows */}
      <section className="section-dark bg-ikasa-black py-24 text-ikasa-white lg:py-28">
        <Container>
          <SectionHeading
            eyebrow="Our Renovation Services"
            title={serviceRows?.heading || "Our Renovation Services"}
            description={serviceRows?.subheading}
            tone="light"
          />

          <div className="mt-16 divide-y divide-white/10">
            {services.map((service, i) => (
              <Reveal key={service._id}>
                <Link
                  href={`/services/${service.slug}`}
                  className={`group grid items-center gap-8 py-12 lg:grid-cols-2 lg:gap-16 ${
                    i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <ImageWithFallback
                      src={service.listingImage || ""}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 45vw"
                    />
                  </div>
                  <div>
                    <span className="font-label text-[0.68rem] tracking-[0.2em] text-ikasa-red">
                      {service.serviceNumber || String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-4 font-heading text-2xl tracking-tight sm:text-3xl">
                      {service.title}
                    </h3>
                    <p className="mt-4 max-w-lg text-sm leading-relaxed text-ikasa-light-grey/80 sm:text-base">
                      {service.shortDescription}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 font-label text-[0.68rem] tracking-[0.18em] text-ikasa-white transition-colors group-hover:text-ikasa-red">
                      View Service
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Expertise strip */}
      <section className="bg-ikasa-warm-white py-24 lg:py-28">
        <Container>
          <SectionHeading eyebrow="Expertise" title="Where We Focus" />
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {[kitchenExpertise, bathroomExpertise, closetExpertise]
              .filter(Boolean)
              .map((item, i) => (
                <Reveal key={item?.key || i} delay={i * 0.1}>
                  <div className="group relative flex h-full flex-col overflow-hidden border border-ikasa-light-grey">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <ImageWithFallback
                        src={item?.primaryImage || ""}
                        alt={item?.heading || ""}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <div className="p-7">
                      <h3 className="font-heading text-xl tracking-tight text-ikasa-black">
                        {item?.heading}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-ikasa-medium-grey">
                        {item?.content}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
          </div>
        </Container>
      </section>

      {/* Product guidance */}
      {productGuidance ? (
        <section className="section-dark bg-ikasa-black py-24 text-ikasa-white lg:py-28">
          <Container className="grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
            <Reveal>
              <div className="relative aspect-[4/3] overflow-hidden">
                <ImageWithFallback
                  src={productGuidance.primaryImage || ""}
                  alt="Appliance and product guidance — illustrative reference"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                />
              </div>
            </Reveal>
            <SectionHeading
              eyebrow="Guidance"
              title={productGuidance.heading}
              description={productGuidance.content}
              tone="light"
              action={
                <Button href="/booking" variant="outline" className="border-white/20 text-ikasa-white hover:border-ikasa-red hover:text-ikasa-red">
                  Book a Free Consultation
                </Button>
              }
            />
          </Container>
        </section>
      ) : null}

      {/* Process */}
      {process ? (
        <section className="bg-ikasa-warm-white py-24 lg:py-28">
          <Container>
            <SectionHeading eyebrow="Process" title={process.heading} />
            <div className="mt-16">
              <ProcessTimeline steps={process.lists || []} tone="dark" />
            </div>
          </Container>
        </section>
      ) : null}

      {/* Estimate — no prices */}
      {estimate ? (
        <section className="film-grain relative overflow-hidden bg-ikasa-red py-20 text-center text-ikasa-white">
          <Container narrow>
            <p className="font-label text-[0.68rem] tracking-[0.24em]">
              Estimate
            </p>
            <h3 className="mt-4 font-heading text-3xl tracking-tight sm:text-4xl">
              {estimate.heading}
            </h3>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/90 sm:text-base">
              {estimate.content}
            </p>
            <div className="mt-8">
              <Button
                href={estimate.ctaLink || "/booking"}
                variant="secondary"
                size="lg"
              >
                {estimate.ctaLabel || "Book a Consultation"}
              </Button>
            </div>
          </Container>
        </section>
      ) : null}

      {/* Material collage */}
      {collage?.items?.length ? (
        <section className="bg-ikasa-warm-white py-24 lg:py-28">
          <Container>
            <SectionHeading eyebrow="Materials" title={collage.heading} />
            <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-5">
              {collage.items.map((item, i) => (
                <Reveal key={item.title || i} delay={i * 0.06}>
                  <div className="relative aspect-square overflow-hidden">
                    <ImageWithFallback
                      src={item.image || ""}
                      alt={item.title || "Material reference"}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-110"
                      sizes="(max-width: 768px) 50vw, 20vw"
                    />
                    <span className="absolute bottom-0 left-0 right-0 bg-ikasa-black/70 px-2 py-1.5 text-center font-label text-[0.6rem] tracking-[0.14em] text-ikasa-white">
                      {item.title}
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <FinalCta
        heading={finalCta?.heading || "Ready to Plan Your Renovation?"}
        ctaLabel={finalCta?.ctaLabel || "Book a Free Consultation"}
        ctaLink={finalCta?.ctaLink || "/booking"}
        backgroundImage={finalCta?.backgroundImage}
      />
    </>
  );
}
