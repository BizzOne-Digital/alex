import type { Metadata } from "next";
import { Check } from "lucide-react";
import { ProcessTimeline } from "@/components/home/ProcessTimeline";
import { Reveal } from "@/components/motion/Reveal";
import { FinalCta } from "@/components/sections/FinalCta";
import { PageHero } from "@/components/sections/PageHero";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { findSection, getPageBySlug, getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([
    getPageBySlug("about"),
    getSettings(),
  ]);
  return {
    title: page?.seoTitle || `About | ${settings.companyName}`,
    description: page?.seoDescription || settings.shortDescription,
  };
}

export default async function AboutPage() {
  const page = await getPageBySlug("about");

  const hero = findSection(page, "hero");
  const introduction = findSection(page, "introduction");
  const philosophy = findSection(page, "philosophy");
  const oneStop = findSection(page, "one_stop");
  const expertise = findSection(page, "expertise");
  const guidance = findSection(page, "guidance");
  const process = findSection(page, "process");
  const timeline = findSection(page, "timeline");
  const mosaic = findSection(page, "mosaic");
  const offersPreview = findSection(page, "offers_preview");
  const finalCta = findSection(page, "final_cta");

  return (
    <>
      <PageHero
        eyebrow={hero?.eyebrow || "About Ikasa"}
        title={
          hero?.heading ||
          "Designed Around Your Life. Built Around Your Home."
        }
        subheading={hero?.subheading}
        image={hero?.primaryImage || hero?.backgroundImage}
        imageAlt={hero?.imageAlt}
        breadcrumb={[{ label: "Home", href: "/" }, { label: "About" }]}
      />

      {/* Introduction */}
      {introduction ? (
        <section className="bg-ikasa-warm-white py-24 lg:py-28">
          <Container>
            <div className="grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
              <Reveal direction="right">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <ImageWithFallback
                    src={introduction.primaryImage || ""}
                    alt="Renovation planning — illustrative reference"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 45vw"
                  />
                </div>
              </Reveal>
              <div>
                <SectionHeading
                  eyebrow="Who We Are"
                  title={introduction.heading || "Who We Are"}
                  description={introduction.content}
                />
              </div>
            </div>
          </Container>
        </section>
      ) : null}

      {/* Philosophy */}
      {philosophy ? (
        <section className="section-dark film-grain relative overflow-hidden bg-ikasa-black py-24 text-ikasa-white lg:py-28">
          <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-ikasa-red/10 blur-[120px]" aria-hidden />
          <Container className="relative grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <Reveal>
                <p className="font-label text-[0.72rem] tracking-[0.28em] text-ikasa-red">
                  {philosophy.eyebrow || "The Best Is the Least We Can Do"}
                </p>
              </Reveal>
              <Reveal delay={0.08}>
                <h2 className="mt-5 max-w-xl font-heading text-[clamp(2rem,4.2vw,3.5rem)] font-semibold leading-[1.05] tracking-tight text-balance">
                  {philosophy.heading}
                </h2>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="mt-6 max-w-lg text-base leading-relaxed text-ikasa-light-grey/80 sm:text-lg">
                  {philosophy.content}
                </p>
              </Reveal>
            </div>
            <Reveal direction="left" delay={0.1}>
              <div className="relative aspect-[4/5] overflow-hidden border border-white/10">
                <ImageWithFallback
                  src={philosophy.secondaryImage || ""}
                  alt="Living space atmosphere — illustrative reference"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
            </Reveal>
          </Container>
        </section>
      ) : null}

      {/* One-stop approach */}
      {oneStop ? (
        <section className="bg-ikasa-warm-white py-24 lg:py-28">
          <Container>
            <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
              <div>
                <SectionHeading
                  eyebrow="One-Stop Approach"
                  title={oneStop.heading}
                  description={oneStop.content}
                />
                <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                  {(oneStop.lists || []).map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-ikasa-charcoal">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ikasa-red" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <Reveal direction="left">
                <div className="relative aspect-[4/3] overflow-hidden lg:aspect-auto lg:h-full">
                  <ImageWithFallback
                    src={oneStop.primaryImage || ""}
                    alt="Installation coordination — illustrative reference"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 45vw"
                  />
                </div>
              </Reveal>
            </div>
          </Container>
        </section>
      ) : null}

      {/* Expertise */}
      {expertise ? (
        <section className="section-dark bg-ikasa-black py-24 text-ikasa-white lg:py-28">
          <Container>
            <SectionHeading
              eyebrow="Expertise"
              title={expertise.heading}
              description={expertise.content}
              tone="light"
              align="center"
            />
            <div className="mt-14 grid gap-6 sm:grid-cols-3">
              {(expertise.items || []).map((item, i) => (
                <Reveal key={item.title || i} delay={i * 0.1}>
                  <div className="group relative aspect-[3/4] overflow-hidden">
                    <ImageWithFallback
                      src={item.image || ""}
                      alt={item.title || ""}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ikasa-black via-ikasa-black/30 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <p className="font-heading text-xl tracking-tight">
                        {item.title}
                      </p>
                      <p className="mt-1.5 text-sm text-ikasa-light-grey/80">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {/* Product guidance */}
      {guidance ? (
        <section className="bg-ikasa-warm-white py-24 lg:py-28">
          <Container>
            <div className="grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
              <div>
                <SectionHeading
                  eyebrow="Guidance"
                  title={guidance.heading}
                  description={guidance.content}
                />
                <div className="mt-8">
                  <Button href="/services">Explore Services</Button>
                </div>
              </div>
              <Reveal direction="left">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <ImageWithFallback
                    src={guidance.primaryImage || ""}
                    alt="Product and appliance selection — illustrative reference"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 45vw"
                  />
                </div>
              </Reveal>
            </div>
          </Container>
        </section>
      ) : null}

      {/* Process + Timeline */}
      {process ? (
        <section className="section-dark film-grain relative overflow-x-clip bg-ikasa-black py-24 text-ikasa-white lg:py-28">
          <Container>
            <SectionHeading
              eyebrow="How We Work"
              title={process.heading}
              tone="light"
            />
            <div className="mt-16">
              <ProcessTimeline steps={process.lists || []} tone="light" />
            </div>

            {timeline ? (
              <div className="mt-20 grid gap-10 border-t border-white/10 pt-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                <Reveal>
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <ImageWithFallback
                      src={timeline.primaryImage || ""}
                      alt="Project timing — illustrative reference"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 45vw"
                    />
                  </div>
                </Reveal>
                <div>
                  <p className="font-label text-[0.68rem] tracking-[0.24em] text-ikasa-red">
                    Timeline
                  </p>
                  <h3 className="mt-4 font-heading text-2xl tracking-tight sm:text-3xl">
                    {timeline.heading}
                  </h3>
                  <p className="mt-5 max-w-xl text-sm leading-relaxed text-ikasa-light-grey/80 sm:text-base">
                    {timeline.content}
                  </p>
                </div>
              </div>
            ) : null}
          </Container>
        </section>
      ) : null}

      {/* Mosaic */}
      {mosaic && mosaic.items?.length ? (
        <section className="bg-ikasa-warm-white py-24 lg:py-28">
          <Container>
            <SectionHeading
              eyebrow="Inspiration"
              title={mosaic.heading}
              description={mosaic.subheading}
            />
            <div className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-12 lg:grid-rows-3 lg:auto-rows-[minmax(11rem,1fr)]">
              {mosaic.items.slice(0, 5).map((item, i) => {
                const spanClass =
                  [
                    "col-span-2 aspect-[4/3] lg:col-span-7 lg:row-span-2 lg:h-full lg:min-h-[22rem] lg:aspect-auto",
                    "aspect-square lg:col-span-5 lg:row-start-1 lg:h-full lg:aspect-auto",
                    "aspect-square lg:col-span-5 lg:row-start-2 lg:h-full lg:aspect-auto",
                    "aspect-square lg:col-span-5 lg:row-start-3 lg:h-full lg:aspect-auto",
                    "aspect-square lg:col-span-7 lg:row-start-3 lg:h-full lg:aspect-auto",
                  ][i] || "aspect-square lg:col-span-4 lg:h-full";

                return (
                  <Reveal
                    key={item.title || i}
                    delay={i * 0.06}
                    className={spanClass}
                  >
                    <div className="relative h-full min-h-[10rem] overflow-hidden bg-ikasa-charcoal">
                      <ImageWithFallback
                        src={item.image || ""}
                        alt={item.title || "Design inspiration reference"}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-105"
                        sizes="(max-width: 1024px) 50vw, 40vw"
                      />
                    </div>
                  </Reveal>
                );
              })}
            </div>
            <p className="mt-6 text-center text-xs text-ikasa-medium-grey">
              Stock design references, not completed Ikasa Renovations
              projects.
            </p>
          </Container>
        </section>
      ) : null}

      {/* Offers preview */}
      {offersPreview ? (
        <section className="section-dark bg-ikasa-black py-20 text-center text-ikasa-white">
          <Container narrow>
            <p className="font-label text-[0.68rem] tracking-[0.24em] text-ikasa-red">
              Special Offers
            </p>
            <h3 className="mt-4 font-heading text-2xl tracking-tight sm:text-3xl">
              {offersPreview.heading}
            </h3>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-ikasa-light-grey/80">
              {offersPreview.content}
            </p>
            {offersPreview.ctaLabel && offersPreview.ctaLink ? (
              <div className="mt-8">
                <Button href={offersPreview.ctaLink} variant="outline" className="border-white/20 text-ikasa-white hover:border-ikasa-red hover:text-ikasa-red">
                  {offersPreview.ctaLabel}
                </Button>
              </div>
            ) : null}
          </Container>
        </section>
      ) : null}

      <FinalCta
        heading={finalCta?.heading || "Let's Talk About Your Home"}
        ctaLabel={finalCta?.ctaLabel || "Book a Free Consultation"}
        ctaLink={finalCta?.ctaLink || "/booking"}
        ctaSecondaryLabel={finalCta?.ctaSecondaryLabel}
        ctaSecondaryLink={finalCta?.ctaSecondaryLink}
        backgroundImage={finalCta?.backgroundImage}
      />
    </>
  );
}
