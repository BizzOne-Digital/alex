"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { Input, Select, Textarea, Toggle } from "@/components/admin/FormField";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { CardListEditor, ImageListEditor, StringListEditor } from "@/components/admin/ArrayEditor";
import { useToast } from "@/components/ui/Toast";
import { createService, updateService } from "@/actions/admin/services";
import { cn } from "@/lib/utils";

export type ServiceFormValues = {
  title: string;
  slug: string;
  serviceNumber: string;
  shortDescription: string;
  description: string;
  listingImage: string;
  heroImage: string;
  overviewImage: string;
  processImage: string;
  featureImage: string;
  galleryImages: string[];
  beforeImage: string;
  afterImage: string;
  imageAlt: string;
  typicalProjectType: string;
  inclusions: string[];
  problems: string[];
  designOptions: { title: string; description: string; image: string }[];
  materials: { name: string; description: string; image: string }[];
  processSteps: { title: string; description: string; image: string; order: number }[];
  timeline: string;
  ctaLabel: string;
  ctaLink: string;
  relatedServices: string[];
  relatedOffer: string;
  seoTitle: string;
  seoDescription: string;
  published: boolean;
  featured: boolean;
};

export const EMPTY_SERVICE: ServiceFormValues = {
  title: "",
  slug: "",
  serviceNumber: "",
  shortDescription: "",
  description: "",
  listingImage: "",
  heroImage: "",
  overviewImage: "",
  processImage: "",
  featureImage: "",
  galleryImages: [],
  beforeImage: "",
  afterImage: "",
  imageAlt: "",
  typicalProjectType: "",
  inclusions: [],
  problems: [],
  designOptions: [],
  materials: [],
  processSteps: [],
  timeline: "",
  ctaLabel: "Book a Free Consultation",
  ctaLink: "/booking",
  relatedServices: [],
  relatedOffer: "",
  seoTitle: "",
  seoDescription: "",
  published: false,
  featured: false,
};

type Tab = "listing" | "detail";

export function ServiceForm({
  serviceId,
  initial,
  otherServices,
  offers,
}: {
  serviceId?: string;
  initial: ServiceFormValues;
  otherServices: { id: string; title: string }[];
  offers: { id: string; title: string }[];
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>("listing");
  const [form, setForm] = useState<ServiceFormValues>(initial);
  const [saving, setSaving] = useState(false);

  const patch = (partial: Partial<ServiceFormValues>) => setForm((prev) => ({ ...prev, ...partial }));

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      toast("Title is required", "error");
      setTab("listing");
      return;
    }

    setSaving(true);
    try {
      if (serviceId) {
        const result = await updateService(serviceId, form);
        if (result.ok) {
          toast(
            form.published
              ? "Service saved. Refresh the public site to view changes."
              : "Service saved as draft. Turn on Published to show it on the public site.",
            "success",
          );
          router.refresh();
        } else {
          toast(result.error, "error");
        }
      } else {
        const result = await createService(form);
        if (result.ok) {
          toast("Service created", "success");
          router.push(`/admin/services/${result.data.id}`);
        } else {
          toast(result.error, "error");
        }
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex gap-1 rounded-lg border border-neutral-800 bg-neutral-900/60 p-1">
          <button
            type="button"
            onClick={() => setTab("listing")}
            className={cn(
              "rounded-md px-4 py-1.5 text-sm transition-colors",
              tab === "listing" ? "bg-red-600 text-white" : "text-neutral-400 hover:text-neutral-100",
            )}
          >
            Listing Information
          </button>
          <button
            type="button"
            onClick={() => setTab("detail")}
            className={cn(
              "rounded-md px-4 py-1.5 text-sm transition-colors",
              tab === "detail" ? "bg-red-600 text-white" : "text-neutral-400 hover:text-neutral-100",
            )}
          >
            Detail Page
          </button>
        </div>

        <div className="flex items-center gap-4">
          <Toggle
            label="Featured"
            checked={form.featured}
            onChange={(featured) => patch({ featured })}
            className="w-auto border-none bg-transparent p-0"
          />
          <Toggle
            label="Published"
            checked={form.published}
            onChange={(published) => patch({ published })}
            className="w-auto border-none bg-transparent p-0"
          />
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {serviceId ? "Save changes" : "Create service"}
          </button>
        </div>
      </div>

      {tab === "listing" ? (
        <div className="flex flex-col gap-4 rounded-lg border border-neutral-800 bg-neutral-900/40 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Title"
              required
              value={form.title}
              onChange={(e) => patch({ title: e.target.value })}
            />
            <Input
              label="Slug"
              value={form.slug}
              onChange={(e) => patch({ slug: e.target.value })}
              hint="Leave blank to auto-generate from the title."
              placeholder="auto-generated"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Service number"
              value={form.serviceNumber}
              onChange={(e) => patch({ serviceNumber: e.target.value })}
              placeholder="01"
            />
            <Input
              label="Timeline"
              value={form.timeline}
              onChange={(e) => patch({ timeline: e.target.value })}
              placeholder="6–10 weeks"
            />
          </div>
          <Textarea
            label="Short description"
            value={form.shortDescription}
            onChange={(e) => patch({ shortDescription: e.target.value })}
            rows={2}
            hint="Shown on the services listing page and nav menus."
          />
          <ImageUploader
            label="Listing image"
            value={form.listingImage}
            onChange={(url) => patch({ listingImage: url })}
            folder="services"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Image alt text"
              value={form.imageAlt}
              onChange={(e) => patch({ imageAlt: e.target.value })}
            />
            <Input
              label="Typical project type"
              value={form.typicalProjectType}
              onChange={(e) => patch({ typicalProjectType: e.target.value })}
              placeholder="Full kitchen renovation"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="SEO title"
              value={form.seoTitle}
              onChange={(e) => patch({ seoTitle: e.target.value })}
            />
            <Input
              label="SEO description"
              value={form.seoDescription}
              onChange={(e) => patch({ seoDescription: e.target.value })}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-5 rounded-lg border border-neutral-800 bg-neutral-900/40 p-5">
          <Textarea
            label="Full description"
            value={form.description}
            onChange={(e) => patch({ description: e.target.value })}
            rows={6}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <ImageUploader
              label="Hero image"
              value={form.heroImage}
              onChange={(url) => patch({ heroImage: url })}
              folder="services"
            />
            <ImageUploader
              label="Overview image"
              value={form.overviewImage}
              onChange={(url) => patch({ overviewImage: url })}
              folder="services"
            />
            <ImageUploader
              label="Process image"
              value={form.processImage}
              onChange={(url) => patch({ processImage: url })}
              folder="services"
            />
            <ImageUploader
              label="Feature image"
              value={form.featureImage}
              onChange={(url) => patch({ featureImage: url })}
              folder="services"
            />
          </div>
          <ImageListEditor
            label="Gallery images"
            values={form.galleryImages}
            onChange={(galleryImages) => patch({ galleryImages })}
            folder="services"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <ImageUploader
              label="Before image"
              value={form.beforeImage}
              onChange={(url) => patch({ beforeImage: url })}
              folder="services"
            />
            <ImageUploader
              label="After image"
              value={form.afterImage}
              onChange={(url) => patch({ afterImage: url })}
              folder="services"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="CTA label"
              value={form.ctaLabel}
              onChange={(e) => patch({ ctaLabel: e.target.value })}
            />
            <Input
              label="CTA link"
              value={form.ctaLink}
              onChange={(e) => patch({ ctaLink: e.target.value })}
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <StringListEditor
              label="Problems it solves"
              values={form.problems}
              onChange={(problems) => patch({ problems })}
            />
            <StringListEditor
              label="What's included"
              values={form.inclusions}
              onChange={(inclusions) => patch({ inclusions })}
            />
          </div>

          <CardListEditor
            label="Design options"
            values={form.designOptions}
            onChange={(designOptions) =>
              patch({ designOptions: designOptions as ServiceFormValues["designOptions"] })
            }
            nameKey="title"
            nameLabel="Title"
          />

          <CardListEditor
            label="Materials"
            values={form.materials}
            onChange={(materials) => patch({ materials: materials as ServiceFormValues["materials"] })}
            nameKey="name"
            nameLabel="Name"
          />

          <CardListEditor
            label="Process steps"
            values={form.processSteps}
            onChange={(processSteps) =>
              patch({ processSteps: processSteps as ServiceFormValues["processSteps"] })
            }
            nameKey="title"
            nameLabel="Step title"
            showOrder
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <span className="font-label text-[0.68rem] tracking-[0.16em] text-neutral-400">
                Related services
              </span>
              <div className="flex max-h-40 flex-col gap-1 overflow-y-auto rounded-md border border-neutral-800 p-2">
                {otherServices.length === 0 ? (
                  <p className="px-1 py-1 text-xs text-neutral-500">No other services yet.</p>
                ) : (
                  otherServices.map((s) => (
                    <label key={s.id} className="flex items-center gap-2 rounded px-1.5 py-1 text-sm text-neutral-300 hover:bg-neutral-800">
                      <input
                        type="checkbox"
                        checked={form.relatedServices.includes(s.id)}
                        onChange={(e) => {
                          patch({
                            relatedServices: e.target.checked
                              ? [...form.relatedServices, s.id]
                              : form.relatedServices.filter((id) => id !== s.id),
                          });
                        }}
                        className="h-3.5 w-3.5 accent-red-600"
                      />
                      {s.title}
                    </label>
                  ))
                )}
              </div>
            </div>
            <Select
              label="Related offer"
              value={form.relatedOffer}
              onChange={(e) => patch({ relatedOffer: e.target.value })}
              options={offers.map((o) => ({ value: o.id, label: o.title }))}
              placeholder="None"
            />
          </div>
        </div>
      )}
    </div>
  );
}
