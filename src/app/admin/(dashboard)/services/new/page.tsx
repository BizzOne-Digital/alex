import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { listServices } from "@/actions/admin/services";
import { listOffers } from "@/actions/admin/offers";
import { ServiceForm, EMPTY_SERVICE } from "@/components/admin/ServiceForm";

export default async function NewServicePage() {
  const [services, offers] = await Promise.all([listServices(), listOffers()]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/admin/services"
          className="mb-2 inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-300"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Services
        </Link>
        <h2 className="font-heading text-xl text-neutral-100">New Service</h2>
      </div>

      <ServiceForm
        initial={EMPTY_SERVICE}
        otherServices={services.map((s) => ({ id: s._id, title: s.title }))}
        offers={offers.map((o) => ({ id: o._id, title: o.title }))}
      />
    </div>
  );
}
