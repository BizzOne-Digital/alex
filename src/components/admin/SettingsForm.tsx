"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { Input, Textarea } from "@/components/admin/FormField";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { useToast } from "@/components/ui/Toast";
import { updateSiteSettings } from "@/actions/admin/settings";

export type SettingsFormValues = {
  companyName: string;
  shortDescription: string;
  email: string;
  primaryPhone: string;
  phoneTel: string;
  secondaryPhone: string;
  address: string;
  serviceArea: string;
  businessHours: string;
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
  youtubeUrl: string;
  headerLogo: string;
  footerLogo: string;
  favicon: string;
  headerCtaLabel: string;
  headerCtaLink: string;
  footerCtaLabel: string;
  footerCtaLink: string;
  bookingMessage: string;
  defaultSeoTitle: string;
  defaultSeoDescription: string;
  googleMapsUrl: string;
  copyright: string;
  timelineDisclaimer: string;
  offerDisclaimer: string;
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-neutral-800 bg-neutral-900/40 p-5">
      <h3 className="font-heading text-sm text-neutral-100">{title}</h3>
      {children}
    </div>
  );
}

export function SettingsForm({ initial }: { initial: SettingsFormValues }) {
  const router = useRouter();
  const [form, setForm] = useState<SettingsFormValues>(initial);
  const [saving, setSaving] = useState(false);
  const savedSnapshot = useRef(JSON.stringify(initial));
  const { toast } = useToast();

  const patch = (partial: Partial<SettingsFormValues>) =>
    setForm((prev) => ({ ...prev, ...partial }));

  const persist = async (next: SettingsFormValues, quiet = false) => {
    const snapshot = JSON.stringify(next);
    if (snapshot === savedSnapshot.current) return true;

    setSaving(true);
    try {
      const result = await updateSiteSettings(next);
      if (result.ok) {
        savedSnapshot.current = snapshot;
        router.refresh();
        if (!quiet) {
          toast("Settings saved. Refresh the public site to view changes.", "success");
        }
      } else {
        toast(result.error, "error");
      }
      return result.ok;
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    await persist(form, false);
  };

  const saveBranding = async (partial: Partial<SettingsFormValues>) => {
    const next = { ...form, ...partial };
    setForm(next);
    await persist(next, false);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save settings
        </button>
      </div>

      <Section title="Company Information">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Company name" value={form.companyName} onChange={(e) => patch({ companyName: e.target.value })} />
          <Input label="Email" value={form.email} onChange={(e) => patch({ email: e.target.value })} />
        </div>
        <Textarea label="Short description" value={form.shortDescription} onChange={(e) => patch({ shortDescription: e.target.value })} rows={3} />
        <div className="grid gap-4 sm:grid-cols-3">
          <Input label="Primary phone (display)" value={form.primaryPhone} onChange={(e) => patch({ primaryPhone: e.target.value })} placeholder="647-377-3694" />
          <Input label="Phone (tel: link)" value={form.phoneTel} onChange={(e) => patch({ phoneTel: e.target.value })} placeholder="+16473773694" />
          <Input label="Secondary phone" value={form.secondaryPhone} onChange={(e) => patch({ secondaryPhone: e.target.value })} />
        </div>
        <Input label="Address" value={form.address} onChange={(e) => patch({ address: e.target.value })} />
        <Textarea label="Service area" value={form.serviceArea} onChange={(e) => patch({ serviceArea: e.target.value })} rows={2} />
        <Textarea label="Business hours" value={form.businessHours} onChange={(e) => patch({ businessHours: e.target.value })} rows={2} />
      </Section>

      <Section title="Social Links">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Instagram URL" value={form.instagramUrl} onChange={(e) => patch({ instagramUrl: e.target.value })} />
          <Input label="Facebook URL" value={form.facebookUrl} onChange={(e) => patch({ facebookUrl: e.target.value })} />
          <Input label="TikTok URL" value={form.tiktokUrl} onChange={(e) => patch({ tiktokUrl: e.target.value })} />
          <Input label="YouTube URL" value={form.youtubeUrl} onChange={(e) => patch({ youtubeUrl: e.target.value })} />
        </div>
        <Input label="Google Maps URL" value={form.googleMapsUrl} onChange={(e) => patch({ googleMapsUrl: e.target.value })} />
      </Section>

      <Section title="Branding">
        <div className="grid gap-4 sm:grid-cols-3">
          <ImageUploader label="Header logo" value={form.headerLogo} onChange={(headerLogo) => saveBranding({ headerLogo })} folder="misc" aspect="square" />
          <ImageUploader label="Footer logo" value={form.footerLogo} onChange={(footerLogo) => saveBranding({ footerLogo })} folder="misc" aspect="square" />
          <ImageUploader label="Favicon" value={form.favicon} onChange={(favicon) => saveBranding({ favicon })} folder="misc" aspect="square" />
        </div>
      </Section>

      <Section title="Calls To Action">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Header CTA label" value={form.headerCtaLabel} onChange={(e) => patch({ headerCtaLabel: e.target.value })} />
          <Input label="Header CTA link" value={form.headerCtaLink} onChange={(e) => patch({ headerCtaLink: e.target.value })} />
          <Input label="Footer CTA label" value={form.footerCtaLabel} onChange={(e) => patch({ footerCtaLabel: e.target.value })} />
          <Input label="Footer CTA link" value={form.footerCtaLink} onChange={(e) => patch({ footerCtaLink: e.target.value })} />
        </div>
        <Textarea label="Booking form message" value={form.bookingMessage} onChange={(e) => patch({ bookingMessage: e.target.value })} rows={2} />
      </Section>

      <Section title="SEO Defaults">
        <Input label="Default SEO title" value={form.defaultSeoTitle} onChange={(e) => patch({ defaultSeoTitle: e.target.value })} />
        <Textarea label="Default SEO description" value={form.defaultSeoDescription} onChange={(e) => patch({ defaultSeoDescription: e.target.value })} rows={2} />
      </Section>

      <Section title="Legal & Disclaimers">
        <Input label="Copyright text" value={form.copyright} onChange={(e) => patch({ copyright: e.target.value })} />
        <Textarea label="Timeline disclaimer" value={form.timelineDisclaimer} onChange={(e) => patch({ timelineDisclaimer: e.target.value })} rows={2} />
        <Textarea label="Offer disclaimer" value={form.offerDisclaimer} onChange={(e) => patch({ offerDisclaimer: e.target.value })} rows={2} />
      </Section>
    </div>
  );
}
