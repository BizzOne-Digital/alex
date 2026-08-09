import { Accordion, type AccordionItem } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { getPublishedFaqs } from "@/lib/data";
import type { PublicPageSection } from "@/lib/data";

type FaqPreviewSectionProps = {
  section: PublicPageSection | null;
  faqs: Awaited<ReturnType<typeof getPublishedFaqs>>;
};

export function FaqPreviewSection({ section, faqs }: FaqPreviewSectionProps) {
  if (!faqs.length) return null;

  const items: AccordionItem[] = faqs.slice(0, 5).map((faq) => ({
    id: faq._id,
    title: faq.question,
    content: faq.answer,
  }));

  return (
    <section className="relative overflow-hidden bg-ikasa-warm-white py-24 lg:py-32">
      <Container narrow>
        <SectionHeading
          eyebrow={section?.eyebrow || "FAQ"}
          title={section?.heading || "Common Questions"}
          description={section?.subheading}
        />

        <div className="mt-12">
          <Accordion items={items} />
        </div>

        <div className="mt-10 flex justify-center">
          <Button href="/faq" variant="outline">
            View All FAQs
          </Button>
        </div>
      </Container>
    </section>
  );
}
