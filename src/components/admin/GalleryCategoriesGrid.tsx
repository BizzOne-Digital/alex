"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, ImageOff, Loader2, Pencil, Plus, Save, Trash2 } from "lucide-react";
import { Modal } from "@/components/admin/Modal";
import { Input, Textarea, Toggle } from "@/components/admin/FormField";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { useConfirm } from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import {
  createGalleryCategory,
  deleteGalleryCategory,
  updateGalleryCategory,
} from "@/actions/admin/gallery";

export type AdminGalleryCategoryRow = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  published: boolean;
  projectCount: number;
};

type FormState = { name: string; description: string; image: string; published: boolean };
const EMPTY: FormState = { name: "", description: "", image: "", published: true };

export function GalleryCategoriesGrid({ initialRows }: { initialRows: AdminGalleryCategoryRow[] }) {
  const [rows, setRows] = useState(initialRows);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { confirm, dialog } = useConfirm();

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY);
    setModalOpen(true);
  };

  const openEdit = (row: AdminGalleryCategoryRow) => {
    setEditingId(row._id);
    setForm({ name: row.name, description: row.description, image: row.image, published: row.published });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast("Name is required", "error");
      return;
    }
    setSaving(true);
    try {
      const result = editingId
        ? await updateGalleryCategory(editingId, form)
        : await createGalleryCategory(form);
      if (result.ok) {
        toast(editingId ? "Category updated" : "Category created", "success");
        setModalOpen(false);
        router.refresh();
      } else {
        toast(result.error, "error");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (row: AdminGalleryCategoryRow) => {
    confirm({
      title: `Delete "${row.name}"?`,
      description:
        row.projectCount > 0
          ? `This category has ${row.projectCount} project(s). Move or delete them first.`
          : "This action cannot be undone.",
      confirmLabel: "Delete",
      onConfirm: async () => {
        const result = await deleteGalleryCategory(row._id);
        if (result.ok) {
          setRows((prev) => prev.filter((r) => r._id !== row._id));
          toast("Category deleted", "success");
        } else {
          toast(result.error, "error");
        }
      },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
        >
          <Plus className="h-4 w-4" />
          New Category
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((row) => (
          <div
            key={row._id}
            className="group flex flex-col overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900/50 transition-colors hover:border-neutral-700"
          >
            <Link href={`/admin/gallery/${row._id}`} className="relative block aspect-[16/9] bg-neutral-800">
              {row.image ? (
                <Image src={row.image} alt={row.name} fill className="object-cover" sizes="400px" />
              ) : (
                <div className="flex h-full items-center justify-center text-neutral-600">
                  <ImageOff className="h-6 w-6" />
                </div>
              )}
            </Link>
            <div className="flex flex-1 flex-col gap-2 p-4">
              <div className="flex items-center justify-between">
                <Link href={`/admin/gallery/${row._id}`} className="font-heading text-sm text-neutral-100 hover:text-red-400">
                  {row.name}
                </Link>
                <span className="text-xs text-neutral-500">{row.projectCount} project{row.projectCount === 1 ? "" : "s"}</span>
              </div>
              <p className="line-clamp-2 text-xs text-neutral-500">{row.description || "No description."}</p>
              <div className="mt-2 flex items-center justify-between">
                <Link
                  href={`/admin/gallery/${row._id}`}
                  className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-400"
                >
                  Manage projects
                  <ArrowRight className="h-3 w-3" />
                </Link>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEdit(row)}
                    className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-800 hover:text-neutral-200"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(row)}
                    className="rounded-md p-1.5 text-neutral-500 hover:bg-red-950/40 hover:text-red-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Category" : "New Category"}>
        <div className="flex flex-col gap-4">
          <Input label="Name" required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
          <Textarea
            label="Description"
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            rows={3}
          />
          <ImageUploader
            label="Cover image"
            value={form.image}
            onChange={(image) => setForm((p) => ({ ...p, image }))}
            folder="gallery"
          />
          <Toggle
            label="Published"
            checked={form.published}
            onChange={(published) => setForm((p) => ({ ...p, published }))}
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {editingId ? "Save changes" : "Create category"}
            </button>
          </div>
        </div>
      </Modal>
      {dialog}
    </div>
  );
}
