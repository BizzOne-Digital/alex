import { Quote, Star } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { getPublishedTestimonials } from "@/lib/data";
import type { PublicPageSection } from "@/lib/data";

type TestimonialsSectionProps = {
  section: PublicPageSection | null;
  testimonials: Awaited<ReturnType<typeof getPublishedTestimonials>>;
};

export function TestimonialsSection({
  section,
  testimonials,
}: TestimonialsSectionProps) {
  if (!testimonials.length) return null;

  return (
    <section className="section-dark relative overflow-hidden bg-ikasa-black py-24 text-ikasa-white lg:py-32">
      <Container>
        <SectionHeading
          eyebrow={section?.eyebrow || "Client Voices"}
          title={section?.heading || "What Homeowners Say"}
          description={section?.subheading}
          tone="light"
          action={
            <Button href="/testimonials" variant="ghost" className="hidden sm:inline-flex">
              Read Testimonials
            </Button>
          }
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {testimonials.slice(0, 3).map((t, i) => (
            <Reveal key={t._id} delay={i * 0.1}>
              <figure className="flex h-full flex-col border border-white/10 bg-white/[0.03] p-8">
                <Quote className="h-7 w-7 text-ikasa-red" />
                <blockquote className="mt-5 flex-1 text-base leading-relaxed text-ikasa-light-grey/90">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="mt-6 flex items-center gap-1" aria-hidden>
                  {Array.from({ length: 5 }).map((_, starIdx) => (
                    <Star
                      key={starIdx}
                      className={`h-3.5 w-3.5 ${
                        starIdx < (t.rating ?? 5)
                          ? "fill-ikasa-red text-ikasa-red"
                          : "text-ikasa-graphite"
                      }`}
                    />
                  ))}
                </div>
                <figcaption className="mt-4 border-t border-white/10 pt-4">
                  <p className="font-heading text-lg text-ikasa-white">
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

        <div className="mt-10 flex justify-center sm:hidden">
          <Button href="/testimonials" variant="ghost">
            Read Testimonials
          </Button>
        </div>
      </Container>
    </section>
  );
}
