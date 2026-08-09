"use client";

import { useMemo, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { cn } from "@/lib/utils";
import type { PublicGalleryCategory, PublicGalleryProject } from "@/lib/data";
import { GalleryLightbox, type LightboxImage } from "@/components/gallery/GalleryLightbox";

type GalleryExplorerProps = {
  categories: PublicGalleryCategory[];
  projects: PublicGalleryProject[];
};

export function GalleryExplorer({ categories, projects }: GalleryExplorerProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all-projects");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (activeCategory === "all-projects") return projects;
    return projects.filter((p) => {
      const category = p.category;
      if (category && typeof category === "object") {
        return category.slug === activeCategory;
      }
      return false;
    });
  }, [projects, activeCategory]);

  const lightboxImages: LightboxImage[] = useMemo(
    () =>
      filtered.map((p) => ({
        src: p.mainImage || "",
        alt: p.alt || p.title,
        title: p.title,
        caption:
          typeof p.category === "object" && p.category ? p.category.name : "",
      })),
    [filtered],
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveCategory("all-projects")}
          className={cn(
            "border px-4 py-2 font-label text-[0.65rem] tracking-[0.16em] transition-colors",
            activeCategory === "all-projects"
              ? "border-ikasa-red bg-ikasa-red text-white"
              : "border-ikasa-light-grey text-ikasa-medium-grey hover:border-ikasa-black hover:text-ikasa-black",
          )}
        >
          All Projects
        </button>
        {categories
          .filter((c) => c.slug !== "all-projects")
          .map((category) => (
            <button
              key={category._id}
              type="button"
              onClick={() => setActiveCategory(category.slug)}
              className={cn(
                "border px-4 py-2 font-label text-[0.65rem] tracking-[0.16em] transition-colors",
                activeCategory === category.slug
                  ? "border-ikasa-red bg-ikasa-red text-white"
                  : "border-ikasa-light-grey text-ikasa-medium-grey hover:border-ikasa-black hover:text-ikasa-black",
              )}
            >
              {category.name}
            </button>
          ))}
      </div>

      {filtered.length ? (
        <div className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {filtered.map((project, i) => (
            <Reveal key={project._id} delay={(i % 6) * 0.05} className="break-inside-avoid">
              <button
                type="button"
                onClick={() => setLightboxIndex(i)}
                className="group relative block w-full overflow-hidden text-left"
              >
                <div
                  className="relative w-full overflow-hidden bg-ikasa-charcoal"
                  style={{ aspectRatio: i % 3 === 0 ? "4 / 5" : i % 3 === 1 ? "1 / 1" : "4 / 3" }}
                >
                  <ImageWithFallback
                    src={project.mainImage || ""}
                    alt={project.alt || project.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ikasa-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="font-heading text-sm text-white sm:text-base">
                      {project.title}
                    </p>
                    {typeof project.category === "object" && project.category ? (
                      <p className="mt-0.5 font-label text-[0.6rem] tracking-[0.16em] text-ikasa-red">
                        {project.category.name}
                      </p>
                    ) : null}
                  </div>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      ) : (
        <p className="mt-14 text-center text-sm text-ikasa-medium-grey">
          No published gallery items in this category yet.
        </p>
      )}

      <GalleryLightbox
        images={lightboxImages}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </div>
  );
}
