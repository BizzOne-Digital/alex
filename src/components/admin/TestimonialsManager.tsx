"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ImageOff, Loader2, Pencil, Plus, Save, Star, Trash2 } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/admin/DataTable";
import { PublishedBadge } from "@/components/admin/StatusBadge";
import { Input, Select, Textarea, Toggle } from "@/components/admin/FormField";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Modal } from "@/components/admin/Modal";
import { useConfirm } from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import {
  createTestimonial,
  deleteTestimonial,
  reorderTestimonial,
  toggleTestimonialField,
  updateTestimonial,
} from "@/actions/admin/testimonials";

export type AdminTestimonialRow = {
  _id: string;
  name: string;
  projectType: string;
  role: string;
  location: string;
  quote: string;
  rating: number;
  image: string;
  service: string;
  featured: boolean;
  published: boolean;
};

type FormState = Omit<AdminTestimonialRow, "_id">;
const EMPTY: FormState = {
  name: "",
  projectType: "",
  role: "",
  location: "",
  quote: "",
  rating: 5,
  image: "",
  service: "",
  featured: false,
  published: false,
};

export function TestimonialsManager({
  initialRows,
  serviceOptions,
}: {
  initialRows: AdminTestimonialRow[];
  serviceOptions: { id: string; title: string }[];
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

  const openEdit = (row: AdminTestimonialRow) => {
    setEditingId(row._id);
    setForm({
      name: row.name,
      projectType: row.projectType,
      role: row.role,
      location: row.location,
      quote: row.quote,
      rating: row.rating,
      image: row.image,
      service: row.service,
      featured: row.featured,
      published: row.published,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.quote.trim()) {
      toast("Name and quote are required", "error");
      return;
    }
    setSaving(true);
    try {
      const result = editingId ? await updateTestimonial(editingId, form) : await createTestimonial(form);
      if (result.ok) {
        toast(editingId ? "Testimonial updated" : "Testimonial created", "success");
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
    const result = await toggleTestimonialField(id, field, value);
    if (!result.ok) {
      toast(result.error, "error");
      setRows((prev) => prev.map((r) => (r._id === id ? { ...r, [field]: !value } : r)));
    }
  };

  const handleReorder = async (id: string, direction: "up" | "down") => {
    const result = await reorderTestimonial(id, direction);
    if (result.ok) router.refresh();
    else toast(result.error, "error");
  };

  const handleDelete = (row: AdminTestimonialRow) => {
    confirm({
      title: `Delete testimonial from "${row.name}"?`,
      description: "This action cannot be undone.",
      confirmLabel: "Delete",
      onConfirm: async () => {
        const result = await deleteTestimonial(row._id);
        if (result.ok) {
          setRows((prev) => prev.filter((r) => r._id !== row._id));
          toast("Testimonial deleted", "success");
        } else {
          toast(result.error, "error");
        }
      },
    });
  };

  const columns: DataTableColumn<AdminTestimonialRow>[] = [
    {
      key: "name",
      header: "Testimonial",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-neutral-800">
            {row.image ? (
              <Image src={row.image} alt={row.name} fill className="object-cover" sizes="40px" />
            ) : (
              <div className="flex h-full items-center justify-center text-neutral-600">
                <ImageOff className="h-4 w-4" />
              </div>
            )}
          </div>
          <div className="max-w-xs">
            <button onClick={() => openEdit(row)} className="text-sm font-medium text-neutral-100 hover:text-red-400">
              {row.name}
            </button>
            <p className="truncate text-xs text-neutral-500">{row.quote}</p>
          </div>
        </div>
      ),
    },
    {
      key: "rating",
      header: "Rating",
      render: (row) => (
        <span className="flex items-center gap-0.5 text-amber-400">
          {Array.from({ length: row.rating }).map((_, i) => (
            <Star key={i} className="h-3.5 w-3.5 fill-current" />
          ))}
        </span>
      ),
    },
    { key: "status", header: "Status", render: (row) => <PublishedBadge published={row.published} /> },
    {
      key: "published",
      header: "Published",
      render: (row) => <Toggle label="" checked={row.published} onChange={(v) => handleToggle(row._id, "published", v)} className="w-auto border-none bg-transparent p-0" />,
    },
    {
      key: "featured",
      header: "Featured",
      render: (row) => <Toggle label="" checked={row.featured} onChange={(v) => handleToggle(row._id, "featured", v)} className="w-auto border-none bg-transparent p-0" />,
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
        <button type="button" onClick={openCreate} className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
          <Plus className="h-4 w-4" />
          New Testimonial
        </button>
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        getRowId={(row) => row._id}
        searchPlaceholder="Search testimonials…"
        searchFilter={(row, q) => row.name.toLowerCase().includes(q) || row.quote.toLowerCase().includes(q)}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Testimonial" : "New Testimonial"}>
        <div className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Name" required value={form.name} onChange={(e) => patch({ name: e.target.value })} />
            <Input
              label="Project type"
              value={form.projectType}
              onChange={(e) => patch({ projectType: e.target.value })}
              placeholder="Kitchen Makeover"
            />
            <Input label="Role" value={form.role} onChange={(e) => patch({ role: e.target.value })} placeholder="Homeowner" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Location" value={form.location} onChange={(e) => patch({ location: e.target.value })} />
            <Select
              label="Rating"
              value={String(form.rating)}
              onChange={(e) => patch({ rating: Number(e.target.value) })}
              options={[1, 2, 3, 4, 5].map((n) => ({ value: String(n), label: `${n} star${n === 1 ? "" : "s"}` }))}
            />
          </div>
          <Textarea label="Quote" required value={form.quote} onChange={(e) => patch({ quote: e.target.value })} rows={4} />
          <Select
            label="Related service"
            value={form.service}
            onChange={(e) => patch({ service: e.target.value })}
            options={serviceOptions.map((s) => ({ value: s.id, label: s.title }))}
            placeholder="None"
          />
          <ImageUploader label="Photo" value={form.image} onChange={(image) => patch({ image })} folder="misc" aspect="square" />
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
              {editingId ? "Save changes" : "Create testimonial"}
            </button>
          </div>
        </div>
      </Modal>
      {dialog}
    </div>
  );
}
