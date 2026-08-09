import { Check } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { cn } from "@/lib/utils";
import type { PublicPageSection } from "@/lib/data";

type FeatureShowcaseProps = {
  section: PublicPageSection | null;
  tag: string;
  index: string;
  reverse?: boolean;
  tone?: "warm" | "black";
  fallbackImage?: string;
};

const TAG_FALLBACKS: Record<string, string> = {
  Kitchen:
    "https://images.unsplash.com/photo-1556911220-bff31c812d84?auto=format&fit=crop&w=1600&q=80",
  Bathroom:
    "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1600&q=80",
  Closet:
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=80",
};

export function FeatureShowcase({
  section,
  tag,
  index,
  reverse = false,
  tone = "warm",
  fallbackImage,
}: FeatureShowcaseProps) {
  if (!section) return null;
  const { heading, content, lists, primaryImage, ctaLabel, ctaLink, imageAlt } =
    section;

  const isDark = tone === "black";
  const imageSrc =
    primaryImage || fallbackImage || TAG_FALLBACKS[tag] || "";

  return (
    <section
      className={cn(
        "relative overflow-hidden py-24 lg:py-28",
        isDark
          ? "section-dark bg-ikasa-black text-ikasa-white"
          : "bg-ikasa-warm-white text-ikasa-black",
      )}
    >
      <Container>
        <div
          className={cn(
            "grid items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20",
          )}
        >
          <Reveal
            direction={reverse ? "left" : "right"}
            className={cn(reverse && "lg:order-2")}
          >
            <div
              className={cn(
                "relative overflow-hidden",
                "aspect-[4/5] min-h-[22rem] sm:min-h-[28rem] lg:min-h-[34rem] lg:aspect-auto lg:h-[36rem] xl:h-[40rem]",
                isDark && "ring-1 ring-white/10",
              )}
            >
              <ImageWithFallback
                src={imageSrc}
                alt={imageAlt || heading || `${tag} design inspiration`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 48vw"
                fallbackSrc={TAG_FALLBACKS[tag]}
              />
              <div
                className={cn(
                  "pointer-events-none absolute inset-0",
                  isDark
                    ? "bg-gradient-to-t from-ikasa-black/50 via-transparent to-transparent"
                    : "bg-gradient-to-t from-ikasa-black/20 via-transparent to-transparent",
                )}
              />
              <span className="absolute left-4 top-4 border border-white/25 bg-ikasa-black/75 px-3 py-1.5 font-label text-[0.62rem] tracking-[0.2em] text-ikasa-white backdrop-blur-sm">
                {index} — {tag}
              </span>
            </div>
          </Reveal>

          <div className={cn(reverse && "lg:order-1")}>
            <Reveal>
              <p className="font-label text-[0.72rem] tracking-[0.28em] text-ikasa-red">
                {tag}
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <h2
                className={cn(
                  "mt-5 max-w-xl font-heading text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-[1.05] tracking-tight text-balance",
                  isDark ? "text-ikasa-white" : "text-ikasa-black",
                )}
              >
                {heading}
              </h2>
            </Reveal>
            {content ? (
              <Reveal delay={0.16}>
                <p
                  className={cn(
                    "mt-6 max-w-lg text-base leading-relaxed sm:text-lg",
                    isDark ? "text-ikasa-light-grey" : "text-ikasa-medium-grey",
                  )}
                >
                  {content}
                </p>
              </Reveal>
            ) : null}

            {lists && lists.length ? (
              <Reveal delay={0.22}>
                <ul className="mt-8 grid grid-cols-1 gap-x-10 gap-y-3.5 sm:grid-cols-2">
                  {lists.map((item, i) => (
                    <li
                      key={`${item}-${i}`}
                      className={cn(
                        "flex items-start gap-2.5 text-sm leading-snug",
                        isDark ? "text-ikasa-light-grey" : "text-ikasa-charcoal",
                      )}
                    >
                      <Check
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ikasa-red"
                        aria-hidden
                      />
                      <span className="min-w-0">{item}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ) : null}

            {ctaLabel && ctaLink ? (
              <Reveal delay={0.3}>
                <div className="mt-10">
                  <Button
                    href={ctaLink}
                    variant={isDark ? "primary" : "secondary"}
                  >
                    {ctaLabel}
                  </Button>
                </div>
              </Reveal>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
