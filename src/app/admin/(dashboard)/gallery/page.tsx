import { listGalleryCategories } from "@/actions/admin/gallery";
import { GalleryCategoriesGrid } from "@/components/admin/GalleryCategoriesGrid";

export default async function AdminGalleryPage() {
  const categories = await listGalleryCategories();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-heading text-xl text-neutral-100">Gallery</h2>
        <p className="text-sm text-neutral-500">
          Organize completed projects into categories, then manage each project inside its category.
        </p>
      </div>
      <GalleryCategoriesGrid
        initialRows={categories.map((c) => ({
          _id: c._id,
          name: c.name,
          slug: c.slug,
          description: c.description ?? "",
          image: c.image ?? "",
          published: c.published,
          projectCount: c.projectCount,
        }))}
      />
    </div>
  );
}
