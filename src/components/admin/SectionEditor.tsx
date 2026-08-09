"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, GripVertical, Loader2, Plus, Save, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";
import { Input, Textarea } from "@/components/admin/FormField";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { savePageSection } from "@/actions/admin/pages";
import type { PlainSection } from "@/actions/admin/pages";
import type { SectionDefinition } from "@/lib/admin/page-sections";

type SectionItem = {
  title: string;
  description: string;
  image: string;
  link: string;
  meta: string;
};

type SectionFormState = {
  eyebrow: string;
  heading: string;
  subheading: string;
  content: string;
  lists: string[];
  ctaLabel: string;
  ctaLink: string;
  ctaSecondaryLabel: string;
  ctaSecondaryLink: string;
  primaryImage: string;
  secondaryImage: string;
  backgroundImage: string;
  beforeImage: string;
  afterImage: string;
  imageAlt: string;
  items: SectionItem[];
  visible: boolean;
};

function toFormState(section: PlainSection | undefined): SectionFormState {
  return {
    eyebrow: section?.eyebrow ?? "",
    heading: section?.heading ?? "",
    subheading: section?.subheading ?? "",
    content: section?.content ?? "",
    lists: section?.lists ?? [],
    ctaLabel: section?.ctaLabel ?? "",
    ctaLink: section?.ctaLink ?? "",
    ctaSecondaryLabel: section?.ctaSecondaryLabel ?? "",
    ctaSecondaryLink: section?.ctaSecondaryLink ?? "",
    primaryImage: section?.primaryImage ?? "",
    secondaryImage: section?.secondaryImage ?? "",
    backgroundImage: section?.backgroundImage ?? "",
    beforeImage: section?.beforeImage ?? "",
    afterImage: section?.afterImage ?? "",
    imageAlt: section?.imageAlt ?? "",
    items: (section?.items ?? []).map((item) => ({
      title: item.title ?? "",
      description: item.description ?? "",
      image: item.image ?? "",
      link: item.link ?? "",
      meta: item.meta ?? "",
    })),
    visible: section?.visible ?? true,
  };
}

function ListEditor({
  values,
  onChange,
}: {
  values: string[];
  onChange: (values: string[]) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {values.map((value, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            value={value}
            onChange={(e) => {
              const next = [...values];
              next[index] = e.target.value;
              onChange(next);
            }}
            className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600/40"
            placeholder={`Item ${index + 1}`}
          />
          <button
            type="button"
            onClick={() => onChange(values.filter((_, i) => i !== index))}
            className="shrink-0 rounded-md p-2 text-neutral-500 hover:bg-neutral-800 hover:text-red-400"
            aria-label="Remove item"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...values, ""])}
        className="inline-flex items-center gap-1.5 self-start rounded-md border border-dashed border-neutral-700 px-3 py-1.5 text-xs text-neutral-400 hover:border-neutral-500 hover:text-neutral-200"
      >
        <Plus className="h-3.5 w-3.5" />
        Add item
      </button>
    </div>
  );
}

function ItemsEditor({
  items,
  onChange,
  itemsLabel,
}: {
  items: SectionItem[];
  onChange: (items: SectionItem[]) => void;
  itemsLabel?: string;
}) {
  const update = (index: number, patch: Partial<SectionItem>) => {
    const next = [...items];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  const move = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="font-label text-[0.68rem] tracking-[0.16em] text-neutral-400">
        {itemsLabel ?? "Items"}
      </p>
      {items.map((item, index) => (
        <div key={index} className="rounded-md border border-neutral-800 bg-neutral-900/50 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs text-neutral-500">
              <GripVertical className="h-3.5 w-3.5" />
              Item {index + 1}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => move(index, "up")}
                disabled={index === 0}
                className="rounded p-1 text-neutral-500 hover:bg-neutral-800 hover:text-neutral-200 disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(index, "down")}
                disabled={index === items.length - 1}
                className="rounded p-1 text-neutral-500 hover:bg-neutral-800 hover:text-neutral-200 disabled:opacity-30"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => onChange(items.filter((_, i) => i !== index))}
                className="rounded p-1 text-neutral-500 hover:bg-neutral-800 hover:text-red-400"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Title"
              value={item.title}
              onChange={(e) => update(index, { title: e.target.value })}
            />
            <Input
              label="Link"
              value={item.link}
              onChange={(e) => update(index, { link: e.target.value })}
              placeholder="/services/example"
            />
          </div>
          <Textarea
            label="Description"
            value={item.description}
            onChange={(e) => update(index, { description: e.target.value })}
            wrapperClassName="mt-3"
            rows={2}
          />
          <Input
            label="Meta (e.g. role, tag)"
            value={item.meta}
            onChange={(e) => update(index, { meta: e.target.value })}
            wrapperClassName="mt-3"
          />
          <ImageUploader
            label="Image"
            value={item.image}
            onChange={(url) => update(index, { image: url })}
            folder="pages"
            aspect="wide"
            className="mt-3"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          onChange([...items, { title: "", description: "", image: "", link: "", meta: "" }])
        }
        className="inline-flex items-center gap-1.5 self-start rounded-md border border-dashed border-neutral-700 px-3 py-1.5 text-xs text-neutral-400 hover:border-neutral-500 hover:text-neutral-200"
      >
        <Plus className="h-3.5 w-3.5" />
        Add item
      </button>
    </div>
  );
}

function SectionAccordionItem({
  pageSlug,
  definition,
  initial,
}: {
  pageSlug: string;
  definition: SectionDefinition;
  initial: PlainSection | undefined;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<SectionFormState>(() => toFormState(initial));
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fields = new Set(definition.fields);

  const patch = (partial: Partial<SectionFormState>) => setForm((prev) => ({ ...prev, ...partial }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await savePageSection(pageSlug, definition.key, form);
      if (result.ok) {
        toast(`${definition.label} saved`, "success");
      } else {
        toast(result.error, "error");
      }
    } catch {
      toast("Unable to save section", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleVisibleToggle = async (visible: boolean) => {
    patch({ visible });
    const result = await savePageSection(pageSlug, definition.key, { ...form, visible });
    if (result.ok) {
      toast(visible ? `${definition.label} shown` : `${definition.label} hidden`, "success");
    } else {
      toast(result.error, "error");
    }
  };

  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-950/60">
      <div className="flex items-center justify-between gap-3 px-4 py-3.5">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex flex-1 items-center gap-3 text-left"
        >
          <ChevronDown
            className={cn("h-4 w-4 shrink-0 text-neutral-500 transition-transform", open && "rotate-180")}
          />
          <div>
            <p className="font-heading text-sm text-neutral-100">{definition.label}</p>
            {definition.description ? (
              <p className="text-xs text-neutral-500">{definition.description}</p>
            ) : null}
          </div>
        </button>
        <div className="flex items-center gap-2">
          <span
            role="switch"
            aria-checked={form.visible}
            onClick={() => handleVisibleToggle(!form.visible)}
            title={form.visible ? "Visible on site" : "Hidden on site"}
            className={cn(
              "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors",
              form.visible ? "bg-emerald-600" : "bg-neutral-700",
            )}
          >
            <span
              className={cn(
                "inline-block h-4 w-4 translate-x-0.5 rounded-full bg-white transition-transform",
                form.visible && "translate-x-[18px]",
              )}
            />
          </span>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-4 border-t border-neutral-800 px-4 py-4">
              {fields.has("eyebrow") && (
                <Input label="Eyebrow" value={form.eyebrow} onChange={(e) => patch({ eyebrow: e.target.value })} />
              )}
              {fields.has("heading") && (
                <Input label="Heading" value={form.heading} onChange={(e) => patch({ heading: e.target.value })} />
              )}
              {fields.has("subheading") && (
                <Input
                  label="Subheading"
                  value={form.subheading}
                  onChange={(e) => patch({ subheading: e.target.value })}
                />
              )}
              {fields.has("content") && (
                <Textarea
                  label="Content"
                  value={form.content}
                  onChange={(e) => patch({ content: e.target.value })}
                  rows={4}
                />
              )}
              {fields.has("lists") && (
                <div className="flex flex-col gap-1.5">
                  <span className="font-label text-[0.68rem] tracking-[0.16em] text-neutral-400">
                    Bullet points
                  </span>
                  <ListEditor values={form.lists} onChange={(lists) => patch({ lists })} />
                </div>
              )}

              {(fields.has("ctaLabel") || fields.has("ctaLink")) && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    label="Primary CTA label"
                    value={form.ctaLabel}
                    onChange={(e) => patch({ ctaLabel: e.target.value })}
                  />
                  <Input
                    label="Primary CTA link"
                    value={form.ctaLink}
                    onChange={(e) => patch({ ctaLink: e.target.value })}
                    placeholder="/booking"
                  />
                </div>
              )}
              {(fields.has("ctaSecondaryLabel") || fields.has("ctaSecondaryLink")) && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    label="Secondary CTA label"
                    value={form.ctaSecondaryLabel}
                    onChange={(e) => patch({ ctaSecondaryLabel: e.target.value })}
                  />
                  <Input
                    label="Secondary CTA link"
                    value={form.ctaSecondaryLink}
                    onChange={(e) => patch({ ctaSecondaryLink: e.target.value })}
                    placeholder="/contact"
                  />
                </div>
              )}

              {fields.has("imageAlt") && (
                <Input
                  label="Image alt text"
                  value={form.imageAlt}
                  onChange={(e) => patch({ imageAlt: e.target.value })}
                  hint="Describe the image for accessibility and SEO."
                />
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                {fields.has("primaryImage") && (
                  <ImageUploader
                    label="Primary image"
                    value={form.primaryImage}
                    onChange={(url) => patch({ primaryImage: url })}
                    folder="pages"
                  />
                )}
                {fields.has("secondaryImage") && (
                  <ImageUploader
                    label="Secondary image"
                    value={form.secondaryImage}
                    onChange={(url) => patch({ secondaryImage: url })}
                    folder="pages"
                  />
                )}
                {fields.has("backgroundImage") && (
                  <ImageUploader
                    label="Background image"
                    value={form.backgroundImage}
                    onChange={(url) => patch({ backgroundImage: url })}
                    folder="pages"
                  />
                )}
                {fields.has("beforeImage") && (
                  <ImageUploader
                    label="Before image"
                    value={form.beforeImage}
                    onChange={(url) => patch({ beforeImage: url })}
                    folder="pages"
                  />
                )}
                {fields.has("afterImage") && (
                  <ImageUploader
                    label="After image"
                    value={form.afterImage}
                    onChange={(url) => patch({ afterImage: url })}
                    folder="pages"
                  />
                )}
              </div>

              {fields.has("items") && (
                <ItemsEditor
                  items={form.items}
                  onChange={(items) => patch({ items })}
                  itemsLabel={definition.itemsLabel}
                />
              )}

              <div className="flex justify-end border-t border-neutral-800 pt-4">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-60"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save section
                </button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function SectionEditor({
  pageSlug,
  definitions,
  sections,
}: {
  pageSlug: string;
  definitions: SectionDefinition[];
  sections: PlainSection[];
}) {
  const byKey = new Map(sections.map((s) => [s.key, s]));

  return (
    <div className="flex flex-col gap-3">
      {definitions.map((definition) => (
        <SectionAccordionItem
          key={definition.key}
          pageSlug={pageSlug}
          definition={definition}
          initial={byKey.get(definition.key)}
        />
      ))}
    </div>
  );
}
