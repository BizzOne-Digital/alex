"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Eye, Trash2 } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/admin/DataTable";
import { BookingStatusBadge } from "@/components/admin/StatusBadge";
import { useConfirm } from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { deleteBooking, updateBooking } from "@/actions/admin/bookings";
import { BOOKING_STATUSES } from "@/lib/admin/constants";

export type AdminBookingRow = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  serviceName: string;
  preferredDate: string;
  status: string;
  createdAt: string;
};

export function BookingsTable({ initialRows }: { initialRows: AdminBookingRow[] }) {
  const [rows, setRows] = useState(initialRows);
  const [statusFilter, setStatusFilter] = useState("all");
  const router = useRouter();
  const { toast } = useToast();
  const { confirm, dialog } = useConfirm();

  const handleStatusChange = async (id: string, status: string) => {
    setRows((prev) => prev.map((r) => (r._id === id ? { ...r, status } : r)));
    const result = await updateBooking(id, { status });
    if (!result.ok) {
      toast(result.error, "error");
      router.refresh();
    }
  };

  const handleDelete = (row: AdminBookingRow) => {
    confirm({
      title: `Delete booking from ${row.firstName} ${row.lastName}?`,
      description: "This will permanently remove the booking request. This action cannot be undone.",
      confirmLabel: "Delete",
      onConfirm: async () => {
        const result = await deleteBooking(row._id);
        if (result.ok) {
          setRows((prev) => prev.filter((r) => r._id !== row._id));
          toast("Booking deleted", "success");
        } else {
          toast(result.error, "error");
        }
      },
    });
  };

  const filtered = statusFilter === "all" ? rows : rows.filter((r) => r.status === statusFilter);

  const columns: DataTableColumn<AdminBookingRow>[] = [
    {
      key: "name",
      header: "Client",
      render: (row) => (
        <div>
          <Link href={`/admin/bookings/${row._id}`} className="text-sm font-medium text-neutral-100 hover:text-red-400">
            {row.firstName} {row.lastName}
          </Link>
          <p className="text-xs text-neutral-500">{row.email}</p>
        </div>
      ),
    },
    { key: "service", header: "Service", render: (row) => <span className="text-neutral-400">{row.serviceName || "General inquiry"}</span> },
    {
      key: "date",
      header: "Preferred date",
      render: (row) => (
        <span className="text-neutral-400">
          {row.preferredDate ? format(new Date(row.preferredDate), "MMM d, yyyy") : "—"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <select
          value={row.status}
          onChange={(e) => handleStatusChange(row._id, e.target.value)}
          className="rounded-md border border-neutral-700 bg-neutral-900 px-2 py-1.5 text-xs text-neutral-200 focus:border-red-600 focus:outline-none"
        >
          {BOOKING_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      ),
    },
    {
      key: "badge",
      header: "",
      render: (row) => <BookingStatusBadge status={row.status} />,
    },
    {
      key: "received",
      header: "Received",
      render: (row) => <span className="text-xs text-neutral-500">{format(new Date(row.createdAt), "MMM d, yyyy")}</span>,
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <Link href={`/admin/bookings/${row._id}`} className="rounded-md p-2 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100" title="View">
            <Eye className="h-4 w-4" />
          </Link>
          <button type="button" onClick={() => handleDelete(row)} className="rounded-md p-2 text-neutral-400 hover:bg-red-950/40 hover:text-red-400" title="Delete">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <DataTable
        columns={columns}
        rows={filtered}
        getRowId={(row) => row._id}
        searchPlaceholder="Search bookings…"
        searchFilter={(row, q) =>
          `${row.firstName} ${row.lastName}`.toLowerCase().includes(q) ||
          row.email.toLowerCase().includes(q) ||
          row.serviceName.toLowerCase().includes(q)
        }
        toolbarExtra={
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-200 focus:border-red-600 focus:outline-none"
          >
            <option value="all">All statuses</option>
            {BOOKING_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        }
      />
      {dialog}
    </div>
  );
}
