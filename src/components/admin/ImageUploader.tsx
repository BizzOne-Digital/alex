"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImageOff, Loader2, Trash2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";
import type { UploadFolder } from "@/lib/uploads";

type ImageUploaderProps = {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  folder: UploadFolder;
  className?: string;
  aspect?: "square" | "wide" | "tall";
  hint?: string;
};

const aspectClass: Record<NonNullable<ImageUploaderProps["aspect"]>, string> = {
  square: "aspect-square",
  wide: "aspect-[16/9]",
  tall: "aspect-[3/4]",
};

export function ImageUploader({
  label,
  value,
  onChange,
  folder,
  className,
  aspect = "wide",
  hint,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [broken, setBroken] = useState(false);
  const { toast } = useToast();

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`/api/upload?folder=${folder}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }
      const previous = value;
      onChange(data.url);
      setBroken(false);
      if (previous && previous.startsWith("/uploads/")) {
        fetch("/api/upload/delete", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: previous }),
        }).catch(() => {});
      }
      toast("Image uploaded", "success");
    } catch (error) {
      toast(error instanceof Error ? error.message : "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (value && value.startsWith("/uploads/")) {
      fetch("/api/upload/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: value }),
      }).catch(() => {});
    }
    onChange("");
    setBroken(false);
  };

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? (
        <span className="font-label text-[0.68rem] tracking-[0.16em] text-neutral-400">
          {label}
        </span>
      ) : null}
      <div
        className={cn(
          "group relative overflow-hidden rounded-md border border-dashed border-neutral-700 bg-neutral-900",
          aspectClass[aspect],
        )}
      >
        {value && !broken ? (
          <Image
            src={value}
            alt={label || "Uploaded image"}
            fill
            className="object-cover"
            onError={() => setBroken(true)}
            sizes="400px"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-neutral-500">
            <ImageOff className="h-6 w-6" />
            <span className="text-xs">No image</span>
          </div>
        )}

        {uploading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <Loader2 className="h-5 w-5 animate-spin text-white" />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition-opacity group-hover:bg-black/50 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-md bg-white/95 px-2.5 py-1.5 text-xs font-medium text-neutral-900 hover:bg-white"
            >
              <Upload className="h-3.5 w-3.5" />
              {value ? "Replace" : "Upload"}
            </button>
            {value ? (
              <button
                type="button"
                onClick={handleRemove}
                className="inline-flex items-center gap-1.5 rounded-md bg-red-600/95 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-red-600"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </button>
            ) : null}
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/avif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
      {hint ? <p className="text-xs text-neutral-500">{hint}</p> : null}
    </div>
  );
}
