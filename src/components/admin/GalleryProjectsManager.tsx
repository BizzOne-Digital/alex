"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Copy, ImageOff, Loader2, Pencil, Plus, Save, Trash2 } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/admin/DataTable";
import { PublishedBadge } from "@/components/admin/StatusBadge";
import { Toggle, Input, Textarea } from "@/components/admin/FormField";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { ImageListEditor } from "@/components/admin/ArrayEditor";
import { Modal } from "@/components/admin/Modal";
import { useConfirm } from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import {
  createGalleryProject,
  deleteGalleryProject,
  reorderGalleryProject,
  toggleGalleryProjectField,
  updateGalleryProject,
} from "@/actions/admin/gallery";

export type AdminGalleryProjectRow = {
  _id: string;
  title: string;
  location: string;
  description: string;
  mainImage: string;
  images: string[];
  beforeImage: string;
  afterImage: string;
  alt: string;
  featured: boolean;
  published: boolean;
};

type FormState = Omit<AdminGalleryProjectRow, "_id">;
const EMPTY: FormState = {
  title: "",
  location: "",
  description: "",
  mainImage: "",
  images: [],
  beforeImage: "",
  afterImage: "",
  alt: "",
  featured: false,
  published: false,
};

export function GalleryProjectsManager({
  categoryId,
  initialRows,
}: {
  categoryId: string;
  initialRows: AdminGalleryProjectRow[];
}) {
  const [rows, setRows] = useState(initialRows);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { confirm, dialog } = useConfirm();

  const patch = (partial: Partial<FormState>) => setForm((prev) => ({ ...prev, ...partial }));

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY);
    setModalOpen(true);
  };

  const openEdit = (row: AdminGalleryProjectRow) => {
    setEditingId(row._id);
    setForm({
      title: row.title,
      location: row.location,
      description: row.description,
      mainImage: row.mainImage,
      images: row.images,
      beforeImage: row.beforeImage,
      afterImage: row.afterImage,
      alt: row.alt,
      featured: row.featured,
      published: row.published,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast("Title is required", "error");
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, category: categoryId };
      const result = editingId
        ? await updateGalleryProject(editingId, payload)
        : await createGalleryProject(payload);
      if (result.ok) {
        toast(editingId ? "Project updated" : "Project created", "success");
        setModalOpen(false);
        router.refresh();
      } else {
        toast(result.error, "error");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id: string, field: "published" | "featured", value: boolean) => {
    setRows((prev) => prev.map((r) => (r._id === id ? { ...r, [field]: value } : r)));
    const result = await toggleGalleryProjectField(id, field, value);
    if (!result.ok) {
      toast(result.error, "error");
      setRows((prev) => prev.map((r) => (r._id === id ? { ...r, [field]: !value } : r)));
    }
  };

  const handleReorder = async (id: string, direction: "up" | "down") => {
    const result = await reorderGalleryProject(id, direction);
    if (result.ok) router.refresh();
    else toast(result.error, "error");
  };

  const handleDelete = (row: AdminGalleryProjectRow) => {
    confirm({
      title: `Delete "${row.title}"?`,
      description: "This project will be permanently removed.",
      confirmLabel: "Delete",
      onConfirm: async () => {
        const result = await deleteGalleryProject(row._id);
        if (result.ok) {
          setRows((prev) => prev.filter((r) => r._id !== row._id));
          toast("Project deleted", "success");
        } else {
          toast(result.error, "error");
        }
      },
    });
  };

  const handleDuplicate = (row: AdminGalleryProjectRow) => {
    setEditingId(null);
    setForm({
      title: `${row.title} (Copy)`,
      location: row.location,
      description: row.description,
      mainImage: row.mainImage,
      images: row.images,
      beforeImage: row.beforeImage,
      afterImage: row.afterImage,
      alt: row.alt,
      featured: false,
      published: false,
    });
    setModalOpen(true);
  };

  const columns: DataTableColumn<AdminGalleryProjectRow>[] = [
    {
      key: "title",
      header: "Project",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded bg-neutral-800">
            {row.mainImage ? (
              <Image src={row.mainImage} alt={row.title} fill className="object-cover" sizes="56px" />
            ) : (
              <div className="flex h-full items-center justify-center text-neutral-600">
                <ImageOff className="h-4 w-4" />
              </div>
            )}
          </div>
          <div>
            <button onClick={() => openEdit(row)} className="text-sm font-medium text-neutral-100 hover:text-red-400">
              {row.title}
            </button>
            <p className="text-xs text-neutral-500">{row.location || "No location set"}</p>
          </div>
        </div>
      ),
    },
    { key: "status", header: "Status", render: (row) => <PublishedBadge published={row.published} /> },
    {
      key: "published",
      header: "Published",
      render: (row) => (
        <Toggle label="" checked={row.published} onChange={(v) => handleToggle(row._id, "published", v)} className="w-auto border-none bg-transparent p-0" />
      ),
    },
    {
      key: "featured",
      header: "Featured",
      render: (row) => (
        <Toggle label="" checked={row.featured} onChange={(v) => handleToggle(row._id, "featured", v)} className="w-auto border-none bg-transparent p-0" />
      ),
    },
    {
      key: "order",
      header: "Order",
      render: (row) => (
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => handleReorder(row._id, "up")} className="rounded p-1 text-neutral-500 hover:bg-neutral-800 hover:text-neutral-200">↑</button>
          <button type="button" onClick={() => handleReorder(row._id, "down")} className="rounded p-1 text-neutral-500 hover:bg-neutral-800 hover:text-neutral-200">↓</button>
        </div>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button type="button" onClick={() => openEdit(row)} className="rounded-md p-2 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100" title="Edit">
            <Pencil className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => handleDuplicate(row)} className="rounded-md p-2 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100" title="Duplicate">
            <Copy className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => handleDelete(row)} className="rounded-md p-2 text-neutral-400 hover:bg-red-950/40 hover:text-red-400" title="Delete">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          <Plus className="h-4 w-4" />
          New Project
        </button>
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        getRowId={(row) => row._id}
        searchPlaceholder="Search projects…"
        searchFilter={(row, q) => row.title.toLowerCase().includes(q) || row.location.toLowerCase().includes(q)}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Project" : "New Project"} maxWidth="max-w-2xl">
        <div className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Title" required value={form.title} onChange={(e) => patch({ title: e.target.value })} />
            <Input label="Location" value={form.location} onChange={(e) => patch({ location: e.target.value })} />
          </div>
          <Textarea label="Description" value={form.description} onChange={(e) => patch({ description: e.target.value })} rows={3} />
          <Input label="Image alt text" value={form.alt} onChange={(e) => patch({ alt: e.target.value })} />
          <div className="grid gap-4 sm:grid-cols-2">
            <ImageUploader label="Main image" value={form.mainImage} onChange={(mainImage) => patch({ mainImage })} folder="gallery" />
            <div className="grid grid-cols-2 gap-4">
              <ImageUploader label="Before" value={form.beforeImage} onChange={(beforeImage) => patch({ beforeImage })} folder="gallery" aspect="square" />
              <ImageUploader label="After" value={form.afterImage} onChange={(afterImage) => patch({ afterImage })} folder="gallery" aspect="square" />
            </div>
          </div>
          <ImageListEditor label="Additional images" values={form.images} onChange={(images) => patch({ images })} folder="gallery" />
          <div className="grid grid-cols-2 gap-4">
            <Toggle label="Featured" checked={form.featured} onChange={(featured) => patch({ featured })} />
            <Toggle label="Published" checked={form.published} onChange={(published) => patch({ published })} />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {editingId ? "Save changes" : "Create project"}
            </button>
          </div>
        </div>
      </Modal>
      {dialog}
    </div>
  );
}
