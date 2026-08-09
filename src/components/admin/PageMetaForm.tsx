"use client";

import { useState } from "react";
import { Loader2, Save } from "lucide-react";
import { Input, Textarea, Toggle } from "@/components/admin/FormField";
import { useToast } from "@/components/ui/Toast";
import { updatePageMeta } from "@/actions/admin/pages";

export function PageMetaForm({
  slug,
  title,
  seoTitle,
  seoDescription,
  published,
}: {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  published: boolean;
}) {
  const [form, setForm] = useState({ title, seoTitle, seoDescription, published });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await updatePageMeta(slug, form);
      toast(result.ok ? "Page settings saved" : result.error, result.ok ? "success" : "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-neutral-800 bg-neutral-900/40 p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-sm text-neutral-100">Page Settings</h3>
        <Toggle
          label="Published"
          checked={form.published}
          onChange={(published) => setForm((prev) => ({ ...prev, published }))}
          className="w-auto border-none bg-transparent p-0"
        />
      </div>
      <Input
        label="Page title"
        value={form.title}
        onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
      />
      <Input
        label="SEO title"
        value={form.seoTitle}
        onChange={(e) => setForm((prev) => ({ ...prev, seoTitle: e.target.value }))}
        hint="Overrides the default browser tab / search result title."
      />
      <Textarea
        label="SEO description"
        value={form.seoDescription}
        onChange={(e) => setForm((prev) => ({ ...prev, seoDescription: e.target.value }))}
        rows={2}
      />
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save page settings
        </button>
      </div>
    </div>
  );
}
