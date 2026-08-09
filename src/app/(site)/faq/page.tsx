import type { Metadata } from "next";
import { Accordion, type AccordionItem } from "@/components/ui/Accordion";
import { FinalCta } from "@/components/sections/FinalCta";
import { PageHero } from "@/components/sections/PageHero";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { findSection, getPageBySlug, getPublishedFaqs, getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([
    getPageBySlug("faq"),
    getSettings(),
  ]);
  return {
    title: page?.seoTitle || `FAQ | ${settings.companyName}`,
    description: page?.seoDescription || settings.shortDescription,
  };
}

function formatCategory(category: string) {
  return category
    .split(/[-_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default async function FaqPage() {
  const [page, faqs] = await Promise.all([
    getPageBySlug("faq"),
    getPublishedFaqs(),
  ]);

  const hero = findSection(page, "hero");
  const intro = findSection(page, "intro");
  const stillQuestions = findSection(page, "still_questions");
  const finalCta = findSection(page, "final_cta");

  const grouped = faqs.reduce<Record<string, typeof faqs>>((acc, faq) => {
    const key = faq.category || "general";
    acc[key] = acc[key] ? [...acc[key], faq] : [faq];
    return acc;
  }, {});

  const categories = Object.keys(grouped);

  return (
    <>
      <PageHero
        eyebrow={hero?.eyebrow || "FAQ"}
        title={hero?.heading || "Questions Homeowners Ask First"}
        subheading={hero?.subheading}
        image={hero?.primaryImage || hero?.backgroundImage}
        breadcrumb={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
      />

      {intro ? (
        <section className="bg-ikasa-warm-white pt-16">
          <Container narrow className="text-center">
            <p className="font-label text-[0.65rem] tracking-[0.2em] text-ikasa-red">
              Before You Book
            </p>
            <h2 className="mt-4 font-heading text-2xl tracking-tight text-ikasa-black sm:text-3xl">
              {intro.heading}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ikasa-medium-grey">
              {intro.content}
            </p>
          </Container>
        </section>
      ) : null}

      <section className="bg-ikasa-warm-white py-16 lg:py-20">
        <Container narrow className="space-y-14">
          {categories.length ? (
            categories.map((category) => {
              const items: AccordionItem[] = grouped[category].map((faq) => ({
                id: faq._id,
                title: faq.question,
                content: faq.answer,
              }));
              return (
                <div key={category}>
                  <p className="mb-4 font-label text-[0.65rem] tracking-[0.2em] text-ikasa-red">
                    {formatCategory(category)}
                  </p>
                  <Accordion items={items} />
                </div>
              );
            })
          ) : (
            <p className="text-center text-sm text-ikasa-medium-grey">
              FAQs will appear here once published.
            </p>
          )}
        </Container>
      </section>

      {stillQuestions ? (
        <section className="section-dark bg-ikasa-black py-20 text-center text-ikasa-white">
          <Container narrow>
            <h2 className="font-heading text-2xl tracking-tight sm:text-3xl">
              {stillQuestions.heading}
            </h2>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {stillQuestions.ctaLabel && stillQuestions.ctaLink ? (
                <Button href={stillQuestions.ctaLink} variant="outline" className="border-white/20 text-ikasa-white hover:border-ikasa-red hover:text-ikasa-red">
                  {stillQuestions.ctaLabel}
                </Button>
              ) : null}
              {stillQuestions.ctaSecondaryLabel && stillQuestions.ctaSecondaryLink ? (
                <Button href={stillQuestions.ctaSecondaryLink}>
                  {stillQuestions.ctaSecondaryLabel}
                </Button>
              ) : null}
            </div>
          </Container>
        </section>
      ) : null}

      <FinalCta
        heading={finalCta?.heading || "Ready When You Are"}
        ctaLabel={finalCta?.ctaLabel || "Book a Free Consultation"}
        ctaLink={finalCta?.ctaLink || "/booking"}
        backgroundImage={finalCta?.backgroundImage}
      />
    </>
  );
}
