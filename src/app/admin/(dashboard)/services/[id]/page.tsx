import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getService, listServices } from "@/actions/admin/services";
import { listOffers } from "@/actions/admin/offers";
import { ServiceForm, type ServiceFormValues } from "@/components/admin/ServiceForm";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [service, services, offers] = await Promise.all([
    getService(id),
    listServices(),
    listOffers(),
  ]);

  if (!service) {
    notFound();
  }

  const initial: ServiceFormValues = {
    title: service.title,
    slug: service.slug,
    serviceNumber: service.serviceNumber ?? "",
    shortDescription: service.shortDescription ?? "",
    description: service.description ?? "",
    listingImage: service.listingImage ?? "",
    heroImage: service.heroImage ?? "",
    overviewImage: service.overviewImage ?? "",
    processImage: service.processImage ?? "",
    featureImage: service.featureImage ?? "",
    galleryImages: service.galleryImages ?? [],
    beforeImage: service.beforeImage ?? "",
    afterImage: service.afterImage ?? "",
    imageAlt: service.imageAlt ?? "",
    typicalProjectType: service.typicalProjectType ?? "",
    inclusions: service.inclusions ?? [],
    problems: service.problems ?? [],
    designOptions: (service.designOptions ?? []).map((d) => ({
      title: d.title,
      description: d.description ?? "",
      image: d.image ?? "",
    })),
    materials: (service.materials ?? []).map((m) => ({
      name: m.name,
      description: m.description ?? "",
      image: m.image ?? "",
    })),
    processSteps: (service.processSteps ?? []).map((p, index) => ({
      title: p.title,
      description: p.description ?? "",
      image: p.image ?? "",
      order: p.order ?? index,
    })),
    timeline: service.timeline ?? "",
    ctaLabel: service.ctaLabel ?? "Book a Free Consultation",
    ctaLink: service.ctaLink ?? "/booking",
    relatedServices: (service.relatedServices ?? []).map((r) => String(r)),
    relatedOffer: service.relatedOffer ? String(service.relatedOffer) : "",
    seoTitle: service.seoTitle ?? "",
    seoDescription: service.seoDescription ?? "",
    published: service.published,
    featured: service.featured,
  };

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
        <h2 className="font-heading text-xl text-neutral-100">Edit Service</h2>
        <p className="text-sm text-neutral-500">{service.title}</p>
      </div>

      <ServiceForm
        serviceId={id}
        initial={initial}
        otherServices={services.filter((s) => s._id !== id).map((s) => ({ id: s._id, title: s.title }))}
        offers={offers.map((o) => ({ id: o._id, title: o.title }))}
      />
    </div>
  );
}
