"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Copy, ImageOff, Pencil, Plus, Trash2 } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/admin/DataTable";
import { PublishedBadge } from "@/components/admin/StatusBadge";
import { Toggle } from "@/components/admin/FormField";
import { useConfirm } from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import {
  deleteService,
  duplicateService,
  reorderService,
  toggleServiceField,
} from "@/actions/admin/services";

export type AdminServiceRow = {
  _id: string;
  title: string;
  slug: string;
  serviceNumber: string;
  shortDescription: string;
  listingImage: string;
  published: boolean;
  featured: boolean;
  order: number;
};

export function ServicesTable({ initialRows }: { initialRows: AdminServiceRow[] }) {
  const [rows, setRows] = useState(initialRows);
  const router = useRouter();
  const { toast } = useToast();
  const { confirm, dialog } = useConfirm();

  const patchRow = (id: string, patch: Partial<AdminServiceRow>) => {
    setRows((prev) => prev.map((r) => (r._id === id ? { ...r, ...patch } : r)));
  };

  const handleToggle = async (id: string, field: "published" | "featured", value: boolean) => {
    patchRow(id, { [field]: value } as Partial<AdminServiceRow>);
    const result = await toggleServiceField(id, field, value);
    if (!result.ok) {
      toast(result.error, "error");
      patchRow(id, { [field]: !value } as Partial<AdminServiceRow>);
    }
  };

  const handleReorder = async (id: string, direction: "up" | "down") => {
    const result = await reorderService(id, direction);
    if (result.ok) {
      router.refresh();
    } else {
      toast(result.error, "error");
    }
  };

  const handleDuplicate = async (id: string) => {
    const result = await duplicateService(id);
    if (result.ok) {
      toast("Service duplicated", "success");
      router.refresh();
    } else {
      toast(result.error, "error");
    }
  };

  const handleDelete = (id: string, title: string) => {
    confirm({
      title: `Delete "${title}"?`,
      description: "This will permanently remove the service. This action cannot be undone.",
      confirmLabel: "Delete",
      onConfirm: async () => {
        const result = await deleteService(id);
        if (result.ok) {
          setRows((prev) => prev.filter((r) => r._id !== id));
          toast("Service deleted", "success");
        } else {
          toast(result.error, "error");
        }
      },
    });
  };

  const columns: DataTableColumn<AdminServiceRow>[] = [
    {
      key: "title",
      header: "Service",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded bg-neutral-800">
            {row.listingImage ? (
              <Image src={row.listingImage} alt={row.title} fill className="object-cover" sizes="56px" />
            ) : (
              <div className="flex h-full items-center justify-center text-neutral-600">
                <ImageOff className="h-4 w-4" />
              </div>
            )}
          </div>
          <div>
            <Link href={`/admin/services/${row._id}`} className="text-sm font-medium text-neutral-100 hover:text-red-400">
              {row.title}
            </Link>
            <p className="text-xs text-neutral-500">/{row.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: "number",
      header: "No.",
      render: (row) => <span className="text-neutral-400">{row.serviceNumber || "—"}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <PublishedBadge published={row.published} />,
    },
    {
      key: "published",
      header: "Published",
      render: (row) => (
        <Toggle
          label=""
          checked={row.published}
          onChange={(v) => handleToggle(row._id, "published", v)}
          className="w-auto border-none bg-transparent p-0"
        />
      ),
    },
    {
      key: "featured",
      header: "Featured",
      render: (row) => (
        <Toggle
          label=""
          checked={row.featured}
          onChange={(v) => handleToggle(row._id, "featured", v)}
          className="w-auto border-none bg-transparent p-0"
        />
      ),
    },
    {
      key: "order",
      header: "Order",
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => handleReorder(row._id, "up")}
            className="rounded p-1 text-neutral-500 hover:bg-neutral-800 hover:text-neutral-200"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={() => handleReorder(row._id, "down")}
            className="rounded p-1 text-neutral-500 hover:bg-neutral-800 hover:text-neutral-200"
          >
            ↓
          </button>
        </div>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <Link
            href={`/admin/services/${row._id}`}
            className="rounded-md p-2 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() => handleDuplicate(row._id)}
            className="rounded-md p-2 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100"
            title="Duplicate"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => handleDelete(row._id, row.title)}
            className="rounded-md p-2 text-neutral-400 hover:bg-red-950/40 hover:text-red-400"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
      className: "text-right",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Link
          href="/admin/services/new"
          className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
        >
          <Plus className="h-4 w-4" />
          New Service
        </Link>
      </div>
      <DataTable
        columns={columns}
        rows={rows}
        getRowId={(row) => row._id}
        searchPlaceholder="Search services…"
        searchFilter={(row, q) =>
          row.title.toLowerCase().includes(q) ||
          row.slug.toLowerCase().includes(q) ||
          row.shortDescription.toLowerCase().includes(q)
        }
      />
      {dialog}
    </div>
  );
}
