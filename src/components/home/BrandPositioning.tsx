import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import type { PublicPageSection } from "@/lib/data";

type BrandPositioningProps = {
  section: PublicPageSection | null;
};

export function BrandPositioning({ section }: BrandPositioningProps) {
  const eyebrow = section?.eyebrow || "The Best Is the Least We Can Do";
  const heading = section?.heading || "Spaces Designed for the Way You Live";
  const content = section?.content || "";
  const primaryImage = section?.primaryImage || "";
  const secondaryImage = section?.secondaryImage || "";
  const backgroundImage = section?.backgroundImage || "";

  return (
    <section className="relative overflow-hidden bg-ikasa-warm-white py-24 lg:py-32">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.2fr] lg:gap-14 xl:gap-16">
          <div className="max-w-xl">
            <Reveal>
              <p className="font-label text-[0.72rem] tracking-[0.28em] text-ikasa-red">
                {eyebrow}
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-5 font-heading text-[clamp(2.25rem,4.5vw,3.75rem)] font-semibold leading-[1.02] tracking-tight text-balance text-ikasa-black">
                {heading}
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <span className="mt-7 block h-px w-20 bg-ikasa-red" aria-hidden />
            </Reveal>
            <Reveal delay={0.22}>
              <p className="mt-7 text-base leading-relaxed text-ikasa-medium-grey sm:text-lg">
                {content}
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <dl className="mt-10 grid grid-cols-3 gap-3 border-t border-ikasa-light-grey pt-8 sm:gap-6">
                {[
                  { label: "Kitchens", value: "01" },
                  { label: "Bathrooms", value: "02" },
                  { label: "Closets", value: "03" },
                ].map((item) => (
                  <div key={item.label} className="min-w-0">
                    <dt className="font-label text-[0.58rem] tracking-[0.14em] text-ikasa-medium-grey sm:text-[0.62rem] sm:tracking-[0.2em]">
                      {item.label}
                    </dt>
                    <dd className="mt-1 font-heading text-xl text-ikasa-red sm:text-2xl">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <Reveal direction="left" delay={0.12}>
            <div className="relative grid h-[30rem] grid-cols-12 grid-rows-12 gap-3 sm:h-[36rem] lg:h-[40rem] xl:h-[44rem]">
              <div className="relative col-span-8 row-span-10 overflow-hidden">
                <ImageWithFallback
                  src={primaryImage}
                  alt="Kitchen design inspiration"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 70vw, 48vw"
                  priority={false}
                />
              </div>
              <div className="relative col-span-4 row-span-6 overflow-hidden">
                <ImageWithFallback
                  src={secondaryImage}
                  alt="Bathroom design inspiration"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 40vw, 24vw"
                />
              </div>
              <div className="relative col-span-4 row-span-4 row-start-7 overflow-hidden">
                <ImageWithFallback
                  src={backgroundImage}
                  alt="Closet design inspiration"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 40vw, 24vw"
                />
              </div>
              <div className="relative col-span-12 row-span-2 row-start-11 flex items-center bg-ikasa-black px-5 sm:px-6">
                <p className="font-label text-[0.62rem] tracking-[0.2em] text-ikasa-red sm:text-[0.68rem]">
                  Stock design references
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
