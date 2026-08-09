import { listOffers } from "@/actions/admin/offers";
import { listServices } from "@/actions/admin/services";
import { OffersManager } from "@/components/admin/OffersManager";

export default async function AdminOffersPage() {
  const [offers, services] = await Promise.all([listOffers(), listServices()]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-heading text-xl text-neutral-100">Offers</h2>
        <p className="text-sm text-neutral-500">
          Promotions automatically hide on the public site once their end date passes.
        </p>
      </div>
      <OffersManager
        initialRows={offers.map((o) => ({
          _id: o._id,
          title: o.title,
          description: o.description ?? "",
          terms: o.terms ?? "",
          image: o.image ?? "",
          relatedService: o.relatedService ? String(o.relatedService) : "",
          active: o.active,
          startDate: o.startDate ?? "",
          endDate: o.endDate ?? "",
        }))}
        serviceOptions={services.map((s) => ({ id: s._id, title: s.title }))}
      />
    </div>
  );
}
