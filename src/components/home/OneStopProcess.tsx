import { Reveal } from "@/components/motion/Reveal";
import { ProcessTimeline } from "@/components/home/ProcessTimeline";
import { Container } from "@/components/ui/Container";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import type { PublicPageSection } from "@/lib/data";

type OneStopProcessProps = {
  section: PublicPageSection | null;
};

const FALLBACK_STEPS = [
  "Consultation",
  "Custom Design",
  "Product Selection",
  "Supply & Coordination",
  "Professional Installation",
  "Final Walkthrough",
];

export function OneStopProcess({ section }: OneStopProcessProps) {
  const heading =
    section?.heading || "One Team. One Plan. One Complete Transformation.";
  const content = section?.content || "";
  const steps = section?.lists?.length ? section.lists : FALLBACK_STEPS;
  const image = section?.primaryImage || "";

  return (
    <section className="relative overflow-hidden bg-ikasa-warm-white py-24 lg:py-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
          <Reveal direction="right">
            <div className="relative aspect-[4/5] overflow-hidden">
              <ImageWithFallback
                src={image}
                alt="Coordinated renovation planning — illustrative reference"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-x-0 bottom-0 bg-ikasa-black/85 px-6 py-4">
                <p className="font-label text-[0.62rem] tracking-[0.18em] text-ikasa-red">
                  Consultation → Final Walkthrough
                </p>
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <p className="font-label text-[0.72rem] tracking-[0.28em] text-ikasa-red">
                Our Process
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-5 max-w-xl font-heading text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-[1.05] tracking-tight text-balance text-ikasa-black">
                {heading}
              </h2>
            </Reveal>
            {content ? (
              <Reveal delay={0.16}>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-ikasa-medium-grey">
                  {content}
                </p>
              </Reveal>
            ) : null}
          </div>
        </div>

        {/* Full-width timeline so labels have room and never overlap */}
        <Reveal delay={0.12}>
          <div className="mt-16 border-t border-ikasa-light-grey pt-12 lg:mt-20 lg:pt-14">
            <ProcessTimeline steps={steps} tone="dark" />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
