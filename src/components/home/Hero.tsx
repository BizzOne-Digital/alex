import { ArrowDown } from "lucide-react";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import type { PublicPageSection } from "@/lib/data";

type HeroProps = {
  section: PublicPageSection | null;
};

export function Hero({ section }: HeroProps) {
  const eyebrow = section?.eyebrow || "Design • Supply • Install";
  const heading = section?.heading || "From Outdated to Outstanding.";
  const subheading =
    section?.subheading ||
    "Custom kitchens, resort-inspired bathrooms and beautifully organised closets—designed, supplied and professionally installed through one coordinated renovation experience.";
  const ctaLabel = section?.ctaLabel || "Book a Free Consultation";
  const ctaLink = section?.ctaLink || "/booking";
  const ctaSecondaryLabel = section?.ctaSecondaryLabel || "View Our Transformations";
  const ctaSecondaryLink = section?.ctaSecondaryLink || "/gallery";
  const image = section?.primaryImage || "";
  const imageAlt =
    section?.imageAlt || "Luxury modern kitchen interior — illustrative design reference";

  return (
    <section className="section-dark film-grain relative flex min-h-[100svh] items-end overflow-hidden bg-ikasa-black text-ikasa-white">
      <div className="absolute inset-0" aria-hidden>
        <ImageWithFallback
          src={image}
          alt=""
          fill
          priority
          className="object-cover opacity-55"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ikasa-black via-ikasa-black/75 to-ikasa-black/35" />
        <div className="absolute inset-0 bg-gradient-to-r from-ikasa-black/70 via-transparent to-ikasa-black/40" />
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 top-[var(--header-height)] h-px bg-gradient-to-r from-transparent via-ikasa-red/70 to-transparent"
        aria-hidden
      />

      <Container className="relative w-full pb-20 pt-40 sm:pb-24 lg:pb-28">
        <div className="grid gap-14 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
          <div>
            <Reveal>
              <p className="font-label text-[0.75rem] tracking-[0.32em] text-ikasa-red">
                {eyebrow}
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="mt-6 max-w-4xl break-words font-heading text-[clamp(2.35rem,8vw,7rem)] font-semibold leading-[0.94] tracking-tight text-ikasa-white text-balance">
                {heading}
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <span className="mt-8 block h-px w-28 bg-ikasa-red" aria-hidden />
            </Reveal>
            <Reveal delay={0.26}>
              <p className="mt-8 max-w-lg text-base leading-relaxed text-ikasa-light-grey sm:text-lg">
                {subheading}
              </p>
            </Reveal>
            <Reveal delay={0.34}>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <MagneticButton>
                  <Button href={ctaLink} size="lg">
                    {ctaLabel}
                  </Button>
                </MagneticButton>
                <Button href={ctaSecondaryLink} variant="ghost" size="lg">
                  {ctaSecondaryLabel}
                </Button>
              </div>
            </Reveal>
          </div>

          <Reveal direction="left" delay={0.2} className="hidden lg:block">
            <div className="ml-auto flex max-w-[16rem] flex-col gap-4 border-l border-white/15 pl-6">
              <p className="font-label text-[0.65rem] tracking-[0.2em] text-ikasa-medium-grey">
                {imageAlt}
              </p>
              <div className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-ikasa-red" />
                <span className="font-label text-[0.65rem] tracking-[0.2em] text-ikasa-warm-white/80">
                  Kitchens · Bathrooms · Closets
                </span>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-16 flex items-center gap-3 text-ikasa-medium-grey">
          <ArrowDown className="h-4 w-4 animate-bounce text-ikasa-red" />
          <span className="font-label text-[0.65rem] tracking-[0.24em]">
            Scroll to explore
          </span>
        </div>
      </Container>
    </section>
  );
}
