"use client";

import { Plus, Trash2, X } from "lucide-react";
import { Input, Textarea } from "@/components/admin/FormField";
import { ImageUploader } from "@/components/admin/ImageUploader";
import type { UploadFolder } from "@/lib/upload-urls";

export function StringListEditor({
  label,
  values,
  onChange,
  placeholder,
}: {
  label?: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      {label ? (
        <span className="font-label text-[0.68rem] tracking-[0.16em] text-neutral-400">{label}</span>
      ) : null}
      {values.map((value, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            value={value}
            onChange={(e) => {
              const next = [...values];
              next[index] = e.target.value;
              onChange(next);
            }}
            placeholder={placeholder ?? `Item ${index + 1}`}
            className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600/40"
          />
          <button
            type="button"
            onClick={() => onChange(values.filter((_, i) => i !== index))}
            className="shrink-0 rounded-md p-2 text-neutral-500 hover:bg-neutral-800 hover:text-red-400"
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
        Add
      </button>
    </div>
  );
}

export type NamedCard = {
  title: string;
  description: string;
  image: string;
};

/** Editor for arrays of { title|name, description, image } cards (design options, materials, process steps). */
export function CardListEditor({
  label,
  values,
  onChange,
  nameKey = "title",
  nameLabel = "Title",
  imageFolder = "misc",
  showOrder = false,
}: {
  label: string;
  values: Record<string, unknown>[];
  onChange: (values: Record<string, unknown>[]) => void;
  nameKey?: string;
  nameLabel?: string;
  imageFolder?: UploadFolder;
  showOrder?: boolean;
}) {
  const update = (index: number, patch: Record<string, unknown>) => {
    const next = [...values];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  const move = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= values.length) return;
    const next = [...values];
    [next[index], next[target]] = [next[target], next[index]];
    if (showOrder) {
      next.forEach((item, i) => (item.order = i));
    }
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-3">
      <span className="font-label text-[0.68rem] tracking-[0.16em] text-neutral-400">{label}</span>
      {values.map((value, index) => (
        <div key={index} className="rounded-md border border-neutral-800 bg-neutral-900/50 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs text-neutral-500">Item {index + 1}</span>
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
                disabled={index === values.length - 1}
                className="rounded p-1 text-neutral-500 hover:bg-neutral-800 hover:text-neutral-200 disabled:opacity-30"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => onChange(values.filter((_, i) => i !== index))}
                className="rounded p-1 text-neutral-500 hover:bg-neutral-800 hover:text-red-400"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <Input
            label={nameLabel}
            value={String(value[nameKey] ?? "")}
            onChange={(e) => update(index, { [nameKey]: e.target.value })}
          />
          <Textarea
            label="Description"
            value={String(value.description ?? "")}
            onChange={(e) => update(index, { description: e.target.value })}
            wrapperClassName="mt-3"
            rows={2}
          />
          <ImageUploader
            label="Image"
            value={String(value.image ?? "")}
            onChange={(url) => update(index, { image: url })}
            folder={imageFolder}
            className="mt-3"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          onChange([
            ...values,
            { [nameKey]: "", description: "", image: "", ...(showOrder ? { order: values.length } : {}) },
          ])
        }
        className="inline-flex items-center gap-1.5 self-start rounded-md border border-dashed border-neutral-700 px-3 py-1.5 text-xs text-neutral-400 hover:border-neutral-500 hover:text-neutral-200"
      >
        <Plus className="h-3.5 w-3.5" />
        Add
      </button>
    </div>
  );
}

export function ImageListEditor({
  label,
  values,
  onChange,
  folder = "misc",
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  folder?: UploadFolder;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-label text-[0.68rem] tracking-[0.16em] text-neutral-400">{label}</span>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {values.map((value, index) => (
          <div key={index} className="relative">
            <ImageUploader
              value={value}
              onChange={(url) => {
                const next = [...values];
                next[index] = url;
                onChange(next.filter(Boolean));
              }}
              folder={folder}
              aspect="square"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...values, ""])}
          className="flex aspect-square items-center justify-center rounded-md border border-dashed border-neutral-700 text-neutral-500 hover:border-neutral-500 hover:text-neutral-300"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
