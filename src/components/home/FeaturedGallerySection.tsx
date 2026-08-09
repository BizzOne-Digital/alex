import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { getFeaturedGallery } from "@/lib/data";
import type { PublicPageSection } from "@/lib/data";

type FeaturedGallerySectionProps = {
  section: PublicPageSection | null;
  projects: Awaited<ReturnType<typeof getFeaturedGallery>>;
};

export function FeaturedGallerySection({
  section,
  projects,
}: FeaturedGallerySectionProps) {
  if (!projects.length) return null;

  return (
    <section className="relative overflow-hidden bg-ikasa-warm-white py-24 lg:py-32">
      <Container>
        <SectionHeading
          eyebrow={section?.eyebrow || "Gallery"}
          title={section?.heading || "Selected Design References"}
          description={section?.subheading}
          action={
            <Button href="/gallery" variant="outline" className="hidden sm:inline-flex">
              View Gallery
            </Button>
          }
        />

        <div className="mt-14 grid auto-rows-[14rem] grid-cols-2 gap-4 sm:auto-rows-[18rem] md:grid-cols-4">
          {projects.slice(0, 8).map((project, i) => {
            const span =
              i % 5 === 0
                ? "col-span-2 row-span-2"
                : i % 7 === 3
                  ? "col-span-2"
                  : "col-span-1";
            return (
              <Reveal key={project._id} delay={(i % 4) * 0.06} className={span}>
                <Link
                  href="/gallery"
                  className="group relative block h-full w-full overflow-hidden bg-ikasa-charcoal"
                >
                  <ImageWithFallback
                    src={project.mainImage || ""}
                    alt={project.alt || project.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ikasa-black/80 via-ikasa-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute inset-x-0 bottom-0 translate-y-3 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="font-heading text-sm text-ikasa-white sm:text-base">
                      {project.title}
                    </p>
                  </div>
                  <ArrowUpRight className="absolute right-3 top-3 h-4 w-4 text-ikasa-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </Link>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center sm:hidden">
          <Button href="/gallery" variant="outline">
            View Gallery
          </Button>
        </div>
      </Container>
    </section>
  );
}
