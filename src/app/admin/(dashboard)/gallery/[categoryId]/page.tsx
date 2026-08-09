import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getGalleryCategory, listGalleryProjects } from "@/actions/admin/gallery";
import { GalleryProjectsManager } from "@/components/admin/GalleryProjectsManager";

export default async function AdminGalleryCategoryPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = await params;
  const [category, projects] = await Promise.all([
    getGalleryCategory(categoryId),
    listGalleryProjects(categoryId),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/admin/gallery"
          className="mb-2 inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-300"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Gallery
        </Link>
        <h2 className="font-heading text-xl text-neutral-100">{category.name}</h2>
        <p className="text-sm text-neutral-500">{category.description || "Manage projects in this category."}</p>
      </div>

      <GalleryProjectsManager
        categoryId={categoryId}
        initialRows={projects.map((p) => ({
          _id: p._id,
          title: p.title,
          location: p.location ?? "",
          description: p.description ?? "",
          mainImage: p.mainImage ?? "",
          images: p.images ?? [],
          beforeImage: p.beforeImage ?? "",
          afterImage: p.afterImage ?? "",
          alt: p.alt ?? "",
          featured: p.featured,
          published: p.published,
        }))}
      />
    </div>
  );
}
