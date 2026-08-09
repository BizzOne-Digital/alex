import { listServices } from "@/actions/admin/services";
import { ServicesTable } from "@/components/admin/ServicesTable";

export default async function AdminServicesPage() {
  const services = await listServices();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-heading text-xl text-neutral-100">Services</h2>
        <p className="text-sm text-neutral-500">
          Manage every renovation service offered on the public site.
        </p>
      </div>
      <ServicesTable
        initialRows={services.map((s) => ({
          _id: s._id,
          title: s.title,
          slug: s.slug,
          serviceNumber: s.serviceNumber ?? "",
          shortDescription: s.shortDescription ?? "",
          listingImage: s.listingImage ?? "",
          published: s.published,
          featured: s.featured,
          order: s.order,
        }))}
      />
    </div>
  );
}
