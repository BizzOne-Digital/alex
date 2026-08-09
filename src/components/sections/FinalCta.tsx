import { Reveal } from "@/components/motion/Reveal";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";

type FinalCtaProps = {
  eyebrow?: string;
  heading: string;
  content?: string;
  ctaLabel?: string;
  ctaLink?: string;
  ctaSecondaryLabel?: string;
  ctaSecondaryLink?: string;
  backgroundImage?: string;
};

export function FinalCta({
  eyebrow = "Start Today",
  heading,
  content,
  ctaLabel = "Book a Free Consultation",
  ctaLink = "/booking",
  ctaSecondaryLabel,
  ctaSecondaryLink,
  backgroundImage,
}: FinalCtaProps) {
  return (
    <section className="section-dark film-grain relative overflow-hidden bg-ikasa-black py-24 text-ikasa-white lg:py-32">
      {backgroundImage ? (
        <div className="absolute inset-0" aria-hidden>
          <ImageWithFallback
            src={backgroundImage}
            alt=""
            fill
            className="object-cover opacity-25"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ikasa-black via-ikasa-black/85 to-ikasa-black/70" />
        </div>
      ) : (
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          aria-hidden
        >
          <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-ikasa-red/10 blur-[100px] sm:h-96 sm:w-96 sm:blur-[130px]" />
        </div>
      )}

      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ikasa-red to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-ikasa-red to-transparent"
        aria-hidden
      />

      <Container className="relative flex flex-col items-center text-center">
        <Reveal>
          <p className="font-label text-[0.72rem] tracking-[0.3em] text-ikasa-red">
            {eyebrow}
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-6 max-w-3xl font-heading text-[clamp(2.25rem,5vw,4.25rem)] font-semibold leading-[1.02] tracking-tight text-balance">
            {heading}
          </h2>
        </Reveal>
        {content ? (
          <Reveal delay={0.16}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ikasa-light-grey/80 sm:text-lg">
              {content}
            </p>
          </Reveal>
        ) : null}
        <Reveal delay={0.24}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <MagneticButton>
              <Button href={ctaLink} size="lg">
                {ctaLabel}
              </Button>
            </MagneticButton>
            {ctaSecondaryLabel && ctaSecondaryLink ? (
              <Button href={ctaSecondaryLink} variant="ghost" size="lg">
                {ctaSecondaryLabel}
              </Button>
            ) : null}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
