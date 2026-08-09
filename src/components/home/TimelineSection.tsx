import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import type { PublicPageSection } from "@/lib/data";

type TimelineSectionProps = {
  section: PublicPageSection | null;
  disclaimer?: string;
};

export function TimelineSection({ section, disclaimer }: TimelineSectionProps) {
  const heading = section?.heading || "A Clearer Path to Your Finished Space";
  const content = section?.content || "";
  const lists = section?.lists || [];
  const image = section?.primaryImage || "";

  return (
    <section className="section-dark relative overflow-hidden bg-ikasa-black py-24 text-ikasa-white lg:py-32">
      <div className="pointer-events-none absolute inset-0 opacity-30" aria-hidden>
        <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-ikasa-red/10 blur-[120px]" />
      </div>

      <Container className="relative">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <Reveal>
              <p className="font-label text-[0.72rem] tracking-[0.28em] text-ikasa-red">
                Timeline
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-5 max-w-xl font-heading text-[clamp(2rem,4.2vw,3.5rem)] font-semibold leading-[1.05] tracking-tight text-balance">
                {heading}
              </h2>
            </Reveal>
            {content ? (
              <Reveal delay={0.16}>
                <p className="mt-6 max-w-lg text-base leading-relaxed text-ikasa-light-grey/80">
                  {content}
                </p>
              </Reveal>
            ) : null}

            <div className="mt-10 space-y-6">
              {lists.map((item, i) => (
                <Reveal key={item} delay={0.1 + i * 0.08}>
                  <div className="flex gap-5 border-l-2 border-ikasa-red/60 pl-5">
                    <span className="font-heading text-3xl text-ikasa-red">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="pt-1 text-sm leading-relaxed text-ikasa-light-grey/85 sm:text-base">
                      {item}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            {disclaimer ? (
              <p className="mt-10 max-w-lg text-xs leading-relaxed text-ikasa-medium-grey/80">
                {disclaimer}
              </p>
            ) : null}
          </div>

          <Reveal direction="left" delay={0.1}>
            <div className="relative aspect-[4/5] overflow-hidden border border-white/10">
              <ImageWithFallback
                src={image}
                alt="Installation coordination — illustrative reference"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
