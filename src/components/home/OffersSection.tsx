import { Tag } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { getActiveOffers } from "@/lib/data";
import type { PublicPageSection } from "@/lib/data";

type OffersSectionProps = {
  section: PublicPageSection | null;
  offers: Awaited<ReturnType<typeof getActiveOffers>>;
  disclaimer?: string;
};

export function OffersSection({ section, offers, disclaimer }: OffersSectionProps) {
  if (!offers.length) return null;

  return (
    <section className="relative overflow-hidden bg-ikasa-warm-white py-24 lg:py-32">
      <Container>
        <SectionHeading
          eyebrow={section?.eyebrow || "Current Offers"}
          title={section?.heading || "Thoughtful Extras on Qualifying Makeovers"}
          description={section?.subheading}
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {offers.map((offer, i) => (
            <Reveal key={offer._id} delay={i * 0.08}>
              <article className="group relative flex h-full flex-col overflow-hidden border border-ikasa-light-grey bg-white">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <ImageWithFallback
                    src={offer.image || ""}
                    alt={offer.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute left-0 top-0 flex items-center gap-2 bg-ikasa-red px-4 py-2 text-ikasa-white">
                    <Tag className="h-3.5 w-3.5" />
                    <span className="font-label text-[0.62rem] tracking-[0.18em]">
                      Limited-Time Offer
                    </span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <h3 className="font-heading text-xl tracking-tight text-ikasa-black sm:text-2xl">
                    {offer.title}
                  </h3>
                  {offer.description ? (
                    <p className="mt-3 text-sm leading-relaxed text-ikasa-medium-grey">
                      {offer.description}
                    </p>
                  ) : null}
                  <div className="mt-auto pt-6">
                    <Button href="/booking" size="sm">
                      Book to Discuss
                    </Button>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {disclaimer ? (
          <p className="mx-auto mt-10 max-w-3xl text-center text-xs leading-relaxed text-ikasa-medium-grey">
            {disclaimer}
          </p>
        ) : null}
      </Container>
    </section>
  );
}
