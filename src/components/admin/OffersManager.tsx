"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ImageOff, Loader2, Pencil, Plus, Save, Trash2 } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/admin/DataTable";
import { ActiveBadge, StatusBadge } from "@/components/admin/StatusBadge";
import { Input, Select, Textarea, Toggle } from "@/components/admin/FormField";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Modal } from "@/components/admin/Modal";
import { useConfirm } from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { createOffer, deleteOffer, reorderOffer, toggleOfferActive, updateOffer } from "@/actions/admin/offers";

export type AdminOfferRow = {
  _id: string;
  title: string;
  description: string;
  terms: string;
  image: string;
  relatedService: string;
  active: boolean;
  startDate: string;
  endDate: string;
};

type FormState = Omit<AdminOfferRow, "_id">;
const EMPTY: FormState = {
  title: "",
  description: "",
  terms: "",
  image: "",
  relatedService: "",
  active: true,
  startDate: "",
  endDate: "",
};

function toDateInput(value: string): string {
  if (!value) return "";
  return value.slice(0, 10);
}

function isExpired(endDate: string): boolean {
  if (!endDate) return false;
  return new Date(endDate).getTime() < Date.now();
}

export function OffersManager({
  initialRows,
  serviceOptions,
}: {
  initialRows: AdminOfferRow[];
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

  const openEdit = (row: AdminOfferRow) => {
    setEditingId(row._id);
    setForm({
      title: row.title,
      description: row.description,
      terms: row.terms,
      image: row.image,
      relatedService: row.relatedService,
      active: row.active,
      startDate: toDateInput(row.startDate),
      endDate: toDateInput(row.endDate),
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
      const result = editingId ? await updateOffer(editingId, form) : await createOffer(form);
      if (result.ok) {
        toast(editingId ? "Offer updated" : "Offer created", "success");
        setModalOpen(false);
        router.refresh();
      } else {
        toast(result.error, "error");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id: string, value: boolean) => {
    setRows((prev) => prev.map((r) => (r._id === id ? { ...r, active: value } : r)));
    const result = await toggleOfferActive(id, value);
    if (!result.ok) {
      toast(result.error, "error");
      setRows((prev) => prev.map((r) => (r._id === id ? { ...r, active: !value } : r)));
    }
  };

  const handleReorder = async (id: string, direction: "up" | "down") => {
    const result = await reorderOffer(id, direction);
    if (result.ok) router.refresh();
    else toast(result.error, "error");
  };

  const handleDelete = (row: AdminOfferRow) => {
    confirm({
      title: `Delete "${row.title}"?`,
      description: "This action cannot be undone.",
      confirmLabel: "Delete",
      onConfirm: async () => {
        const result = await deleteOffer(row._id);
        if (result.ok) {
          setRows((prev) => prev.filter((r) => r._id !== row._id));
          toast("Offer deleted", "success");
        } else {
          toast(result.error, "error");
        }
      },
    });
  };

  const columns: DataTableColumn<AdminOfferRow>[] = [
    {
      key: "title",
      header: "Offer",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded bg-neutral-800">
            {row.image ? (
              <Image src={row.image} alt={row.title} fill className="object-cover" sizes="56px" />
            ) : (
              <div className="flex h-full items-center justify-center text-neutral-600">
                <ImageOff className="h-4 w-4" />
              </div>
            )}
          </div>
          <button onClick={() => openEdit(row)} className="text-sm font-medium text-neutral-100 hover:text-red-400">
            {row.title}
          </button>
        </div>
      ),
    },
    {
      key: "window",
      header: "Window",
      render: (row) => (
        <span className="text-xs text-neutral-400">
          {row.startDate ? toDateInput(row.startDate) : "Any"} → {row.endDate ? toDateInput(row.endDate) : "No end"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) =>
        isExpired(row.endDate) ? (
          <StatusBadge label="Expired" tone="red" />
        ) : (
          <ActiveBadge active={row.active} />
        ),
    },
    {
      key: "active",
      header: "Active",
      render: (row) => <Toggle label="" checked={row.active} onChange={(v) => handleToggle(row._id, v)} className="w-auto border-none bg-transparent p-0" />,
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
          New Offer
        </button>
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        getRowId={(row) => row._id}
        searchPlaceholder="Search offers…"
        searchFilter={(row, q) => row.title.toLowerCase().includes(q)}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Offer" : "New Offer"}>
        <div className="flex flex-col gap-4">
          <Input label="Title" required value={form.title} onChange={(e) => patch({ title: e.target.value })} />
          <Textarea label="Description" value={form.description} onChange={(e) => patch({ description: e.target.value })} rows={3} />
          <Textarea label="Terms & conditions" value={form.terms} onChange={(e) => patch({ terms: e.target.value })} rows={2} />
          <ImageUploader label="Image" value={form.image} onChange={(image) => patch({ image })} folder="offers" />
          <Select
            label="Related service"
            value={form.relatedService}
            onChange={(e) => patch({ relatedService: e.target.value })}
            options={serviceOptions.map((s) => ({ value: s.id, label: s.title }))}
            placeholder="None"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start date" type="date" value={form.startDate} onChange={(e) => patch({ startDate: e.target.value })} />
            <Input label="End date" type="date" value={form.endDate} onChange={(e) => patch({ endDate: e.target.value })} />
          </div>
          <Toggle label="Active" checked={form.active} onChange={(active) => patch({ active })} />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {editingId ? "Save changes" : "Create offer"}
            </button>
          </div>
        </div>
      </Modal>
      {dialog}
    </div>
  );
}
