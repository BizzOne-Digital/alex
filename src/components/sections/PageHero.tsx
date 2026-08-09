import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  subheading?: string;
  image?: string;
  imageAlt?: string;
  secondaryImage?: string;
  ctaLabel?: string;
  ctaLink?: string;
  ctaSecondaryLabel?: string;
  ctaSecondaryLink?: string;
  breadcrumb?: { label: string; href?: string }[];
  size?: "default" | "compact";
};

/** Split long titles on sentence boundaries for cleaner wrapping. */
function TitleLines({ title }: { title: string }) {
  const parts = title
    .split(/(?<=\.)\s+/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (parts.length < 2) {
    return <>{title}</>;
  }

  return (
    <>
      {parts.map((part, i) => (
        <span key={`${part}-${i}`} className="block">
          {part}
        </span>
      ))}
    </>
  );
}

export function PageHero({
  eyebrow,
  title,
  subheading,
  image,
  imageAlt = "",
  secondaryImage,
  ctaLabel,
  ctaLink,
  ctaSecondaryLabel,
  ctaSecondaryLink,
  breadcrumb,
  size = "default",
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "section-dark film-grain relative overflow-x-clip bg-ikasa-black text-ikasa-white",
        size === "default"
          ? "pt-[calc(var(--header-height)+2.75rem)] pb-16 lg:pb-24"
          : "pt-[calc(var(--header-height)+2rem)] pb-12",
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ikasa-red to-transparent" />
        <div className="absolute -right-32 top-1/3 h-80 w-80 rounded-full bg-ikasa-red/10 blur-[110px]" />
        <div className="absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-ikasa-red/5 blur-[100px]" />
      </div>

      <Container className="relative">
        {breadcrumb && breadcrumb.length > 0 ? (
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex flex-wrap items-center gap-2 font-label text-[0.65rem] tracking-[0.2em] text-ikasa-light-grey/70"
          >
            {breadcrumb.map((crumb, i) => (
              <span key={crumb.label} className="flex items-center gap-2">
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="transition-colors hover:text-ikasa-white"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-ikasa-red">{crumb.label}</span>
                )}
                {i < breadcrumb.length - 1 ? (
                  <span className="text-ikasa-light-grey/40">/</span>
                ) : null}
              </span>
            ))}
          </nav>
        ) : null}

        <div
          className={cn(
            "grid items-center gap-10 lg:gap-14",
            image ? "lg:grid-cols-[1fr_0.95fr] xl:grid-cols-[1.05fr_0.95fr]" : "grid-cols-1",
          )}
        >
          <div className="min-w-0 max-w-2xl">
            {eyebrow ? (
              <Reveal>
                <p className="font-label text-[0.7rem] tracking-[0.28em] text-ikasa-red">
                  {eyebrow}
                </p>
              </Reveal>
            ) : null}

            <Reveal delay={0.08}>
              <h1
                className={cn(
                  "mt-4 font-heading font-semibold tracking-tight text-ikasa-white text-balance",
                  size === "default"
                    ? "text-[clamp(2.1rem,4.2vw,3.75rem)] leading-[1.08]"
                    : "text-[clamp(1.9rem,3.6vw,3rem)] leading-[1.12]",
                )}
              >
                <TitleLines title={title} />
              </h1>
            </Reveal>

            <Reveal delay={0.14}>
              <span
                className="mt-6 block h-px w-20 bg-ikasa-red"
                aria-hidden
              />
            </Reveal>

            {subheading ? (
              <Reveal delay={0.2}>
                <p className="mt-6 max-w-lg text-base leading-relaxed text-ikasa-light-grey sm:text-lg">
                  {subheading}
                </p>
              </Reveal>
            ) : null}

            {ctaLabel || ctaSecondaryLabel ? (
              <Reveal delay={0.28}>
                <div className="mt-9 flex flex-wrap items-center gap-4">
                  {ctaLabel && ctaLink ? (
                    <MagneticButton>
                      <Button href={ctaLink} size="lg">
                        {ctaLabel}
                      </Button>
                    </MagneticButton>
                  ) : null}
                  {ctaSecondaryLabel && ctaSecondaryLink ? (
                    <Button href={ctaSecondaryLink} variant="ghost" size="lg">
                      {ctaSecondaryLabel}
                    </Button>
                  ) : null}
                </div>
              </Reveal>
            ) : null}
          </div>

          {image ? (
            <Reveal direction="left" delay={0.1} className="relative min-w-0">
              <div className="relative aspect-[4/5] max-h-[32rem] w-full overflow-hidden border border-white/10 lg:max-h-[36rem] lg:aspect-[5/6]">
                <ImageWithFallback
                  src={image}
                  alt={imageAlt || title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  priority
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ikasa-black/45 via-transparent to-transparent" />
              </div>
              {secondaryImage ? (
                <div className="absolute -bottom-6 -left-6 hidden aspect-square w-28 overflow-hidden border-4 border-ikasa-black bg-ikasa-charcoal shadow-2xl sm:block lg:w-36">
                  <ImageWithFallback
                    src={secondaryImage}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="144px"
                  />
                </div>
              ) : null}
            </Reveal>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
