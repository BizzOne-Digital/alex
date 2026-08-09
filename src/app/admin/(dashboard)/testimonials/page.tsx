import { listTestimonials } from "@/actions/admin/testimonials";
import { listServices } from "@/actions/admin/services";
import { TestimonialsManager } from "@/components/admin/TestimonialsManager";

export default async function AdminTestimonialsPage() {
  const [testimonials, services] = await Promise.all([listTestimonials(), listServices()]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-heading text-xl text-neutral-100">Testimonials</h2>
        <p className="text-sm text-neutral-500">Manage client reviews shown across the site.</p>
      </div>
      <TestimonialsManager
        initialRows={testimonials.map((t) => ({
          _id: t._id,
          name: t.name,
          projectType: t.projectType ?? "",
          role: t.role ?? "",
          location: t.location ?? "",
          quote: t.quote,
          rating: t.rating ?? 5,
          image: t.image ?? "",
          service: t.service ? String(t.service) : "",
          featured: t.featured,
          published: t.published,
        }))}
        serviceOptions={services.map((s) => ({ id: s._id, title: s.title }))}
      />
    </div>
  );
}
