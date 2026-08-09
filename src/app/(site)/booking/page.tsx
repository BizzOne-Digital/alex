import type { Metadata } from "next";
import { Check } from "lucide-react";
import { BookingForm } from "@/components/forms/BookingForm";
import { Reveal } from "@/components/motion/Reveal";
import { FinalCta } from "@/components/sections/FinalCta";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import {
  findSection,
  getPageBySlug,
  getPublishedServices,
  getSettings,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([
    getPageBySlug("booking"),
    getSettings(),
  ]);
  return {
    title: page?.seoTitle || `Book a Consultation | ${settings.companyName}`,
    description: page?.seoDescription || settings.shortDescription,
  };
}

export default async function BookingPage() {
  const [page, services, settings] = await Promise.all([
    getPageBySlug("booking"),
    getPublishedServices(),
    getSettings(),
  ]);

  const hero = findSection(page, "hero");
  const intro = findSection(page, "intro");
  const form = findSection(page, "form");
  const assurance = findSection(page, "assurance");
  const finalCta = findSection(page, "final_cta");

  return (
    <>
      <PageHero
        eyebrow={hero?.eyebrow || "Consultation"}
        title={hero?.heading || "Book Your Free Renovation Consultation"}
        subheading={hero?.subheading}
        image={hero?.primaryImage || hero?.backgroundImage}
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Booking" }]}
      />

      {intro ? (
        <section className="bg-ikasa-warm-white py-20 lg:py-24">
          <Container narrow>
            <Reveal>
              <p className="font-label text-[0.68rem] tracking-[0.22em] text-ikasa-red">
                What to Expect
              </p>
              <h2 className="mt-4 font-heading text-2xl tracking-tight text-ikasa-black sm:text-3xl">
                {intro.heading}
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-ikasa-medium-grey">
                {intro.content}
              </p>
            </Reveal>
            {intro.lists?.length ? (
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {intro.lists.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-ikasa-charcoal">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ikasa-red" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
          </Container>
        </section>
      ) : null}

      <section className="section-dark relative overflow-hidden bg-ikasa-black py-24 text-ikasa-white lg:py-28">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ikasa-red to-transparent"
          aria-hidden
        />
        <Container narrow>
          <div className="mb-12 text-center text-ikasa-warm-white">
            <p className="font-label text-[0.68rem] tracking-[0.22em] text-ikasa-red">
              Request an Appointment
            </p>
            <h2 className="mt-4 font-heading text-3xl tracking-tight sm:text-4xl">
              {form?.heading || "Request an Appointment"}
            </h2>
            {form?.content ? (
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ikasa-light-grey/80">
                {form.content}
              </p>
            ) : null}
          </div>

          <div className="border border-white/10 bg-ikasa-warm-white p-6 sm:p-10">
            <BookingForm
              services={services.map((s) => ({
                id: s.id,
                title: s.title,
                slug: s.slug,
              }))}
              bookingMessage={settings.bookingMessage}
            />
          </div>
        </Container>
      </section>

      {assurance ? (
        <section className="bg-ikasa-warm-white py-16">
          <Container narrow className="text-center">
            <p className="font-label text-[0.65rem] tracking-[0.2em] text-ikasa-red">
              {assurance.heading}
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-ikasa-medium-grey">
              {assurance.content}
            </p>
          </Container>
        </section>
      ) : null}

      <FinalCta
        eyebrow="Prefer to Call?"
        heading={finalCta?.heading || "Prefer to Call?"}
        ctaLabel={finalCta?.ctaLabel || "Call Us"}
        ctaLink={
          finalCta?.ctaLink ||
          (settings.phoneTel ? `tel:${settings.phoneTel}` : "/contact")
        }
        ctaSecondaryLabel={finalCta?.ctaSecondaryLabel || "Email Us"}
        ctaSecondaryLink={
          finalCta?.ctaSecondaryLink ||
          (settings.email ? `mailto:${settings.email}` : "/contact")
        }
        backgroundImage={finalCta?.backgroundImage || finalCta?.primaryImage}
      />
    </>
  );
}
