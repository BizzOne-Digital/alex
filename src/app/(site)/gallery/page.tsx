import type { Metadata } from "next";
import { GalleryExplorer } from "@/components/gallery/GalleryExplorer";
import { Reveal } from "@/components/motion/Reveal";
import { FinalCta } from "@/components/sections/FinalCta";
import { PageHero } from "@/components/sections/PageHero";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  findSection,
  getAllGalleryProjects,
  getGalleryCategories,
  getPageBySlug,
  getSettings,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([
    getPageBySlug("gallery"),
    getSettings(),
  ]);
  return {
    title: page?.seoTitle || `Gallery | ${settings.companyName}`,
    description: page?.seoDescription || settings.shortDescription,
  };
}

export default async function GalleryPage() {
  const [page, categories, projects] = await Promise.all([
    getPageBySlug("gallery"),
    getGalleryCategories(),
    getAllGalleryProjects(),
  ]);

  const hero = findSection(page, "hero");
  const featured = findSection(page, "featured");
  const filters = findSection(page, "filters");
  const beforeAfter = findSection(page, "before_after");
  const projectInfo = findSection(page, "project_info");
  const finalCta = findSection(page, "final_cta");

  return (
    <>
      <PageHero
        eyebrow={hero?.eyebrow || "Gallery"}
        title={hero?.heading || "Spaces Worth Looking At Twice"}
        subheading={hero?.subheading}
        image={hero?.primaryImage || hero?.backgroundImage}
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Gallery" }]}
      />

      {featured?.beforeImage && featured?.afterImage ? (
        <section className="section-dark bg-ikasa-black py-24 text-ikasa-white lg:py-28">
          <Container>
            <SectionHeading
              eyebrow="Featured Study"
              title={featured.heading || "Featured Transformation Study"}
              description={featured.content}
              tone="light"
            />
            <div className="mt-12">
              <BeforeAfterSlider
                beforeSrc={featured.beforeImage}
                afterSrc={featured.afterImage}
                className="border border-white/10"
              />
            </div>
          </Container>
        </section>
      ) : null}

      <section className="bg-ikasa-warm-white py-24 lg:py-28">
        <Container>
          <SectionHeading
            eyebrow="Browse"
            title={filters?.heading || "Browse by Category"}
            description={filters?.subheading}
          />
          <div className="mt-12">
            <GalleryExplorer categories={categories} projects={projects} />
          </div>
        </Container>
      </section>

      {beforeAfter?.primaryImage && beforeAfter?.secondaryImage ? (
        <section className="section-dark bg-ikasa-black py-24 text-ikasa-white lg:py-28">
          <Container>
            <SectionHeading
              eyebrow="Comparison"
              title={beforeAfter.heading || "Before and After Comparisons"}
              tone="light"
            />
            <div className="mt-12">
              <BeforeAfterSlider
                beforeSrc={beforeAfter.primaryImage}
                afterSrc={beforeAfter.secondaryImage}
                className="border border-white/10"
              />
            </div>
          </Container>
        </section>
      ) : null}

      {projectInfo ? (
        <section className="bg-ikasa-warm-white py-16 text-center">
          <Container narrow>
            <Reveal>
              <p className="font-label text-[0.65rem] tracking-[0.2em] text-ikasa-red">
                Project Information
              </p>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-ikasa-medium-grey">
                {projectInfo.content}
              </p>
            </Reveal>
          </Container>
        </section>
      ) : null}

      <FinalCta
        heading={finalCta?.heading || "Want This Feeling in Your Home?"}
        ctaLabel={finalCta?.ctaLabel || "Book a Free Consultation"}
        ctaLink={finalCta?.ctaLink || "/booking"}
        backgroundImage={finalCta?.backgroundImage}
      />
    </>
  );
}
