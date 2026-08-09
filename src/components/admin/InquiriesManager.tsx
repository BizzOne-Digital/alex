"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Eye } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/admin/DataTable";
import { InquiryStatusBadge } from "@/components/admin/StatusBadge";
import { Textarea, Select } from "@/components/admin/FormField";
import { Modal } from "@/components/admin/Modal";
import { useConfirm } from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { deleteInquiry, updateInquiry } from "@/actions/admin/inquiries";
import { CONTACT_STATUSES } from "@/lib/admin/constants";

export type AdminInquiryRow = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  internalNotes: string;
  createdAt: string;
};

function DetailModal({
  row,
  onClose,
  onSave,
  onDelete,
}: {
  row: AdminInquiryRow | null;
  onClose: () => void;
  onSave: (id: string, status: string, notes: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [status, setStatus] = useState(row?.status ?? "");
  const [notes, setNotes] = useState(row?.internalNotes ?? "");
  const [saving, setSaving] = useState(false);
  const { confirm, dialog } = useConfirm();

  if (!row) return null;

  return (
    <Modal open={Boolean(row)} onClose={onClose} title={row.name}>
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-xs text-neutral-500">Email</p>
          <p className="text-sm text-neutral-200">{row.email}</p>
        </div>
        {row.phone ? (
          <div>
            <p className="text-xs text-neutral-500">Phone</p>
            <p className="text-sm text-neutral-200">{row.phone}</p>
          </div>
        ) : null}
        {row.subject ? (
          <div>
            <p className="text-xs text-neutral-500">Subject</p>
            <p className="text-sm text-neutral-200">{row.subject}</p>
          </div>
        ) : null}
        <div>
          <p className="text-xs text-neutral-500">Message</p>
          <p className="whitespace-pre-wrap text-sm text-neutral-300">{row.message}</p>
        </div>
        <Select
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={CONTACT_STATUSES.map((s) => ({ value: s, label: s }))}
        />
        <Textarea
          label="Internal notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
        <div className="flex flex-wrap justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() =>
              confirm({
                title: "Delete message?",
                description: "This cannot be undone.",
                confirmLabel: "Delete",
                danger: true,
                onConfirm: async () => {
                  await onDelete(row._id);
                  onClose();
                },
              })
            }
            className="rounded-md border border-neutral-700 px-3 py-2 text-sm text-red-400 hover:bg-neutral-900"
          >
            Delete
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={async () => {
              setSaving(true);
              try {
                await onSave(row._id, status, notes);
                onClose();
              } finally {
                setSaving(false);
              }
            }}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
          >
            Save
          </button>
        </div>
      </div>
      {dialog}
    </Modal>
  );
}

export function InquiriesManager({ contactRows }: { contactRows: AdminInquiryRow[] }) {
  const [contacts, setContacts] = useState(contactRows);
  const [activeContact, setActiveContact] = useState<AdminInquiryRow | null>(null);
  const { toast } = useToast();

  const contactColumns: DataTableColumn<AdminInquiryRow>[] = [
    {
      key: "name",
      header: "From",
      render: (row) => (
        <button type="button" onClick={() => setActiveContact(row)} className="text-left">
          <p className="text-sm font-medium text-neutral-100 hover:text-red-400">{row.name}</p>
          <p className="text-xs text-neutral-500">{row.email}</p>
        </button>
      ),
    },
    {
      key: "subject",
      header: "Subject",
      render: (row) => <span className="text-neutral-400">{row.subject || "—"}</span>,
    },
    {
      key: "message",
      header: "Message",
      render: (row) => (
        <span className="line-clamp-1 max-w-xs text-neutral-500">{row.message}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <InquiryStatusBadge status={row.status} />,
    },
    {
      key: "date",
      header: "Received",
      render: (row) => (
        <span className="text-xs text-neutral-500">
          {format(new Date(row.createdAt), "MMM d, yyyy")}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (row) => (
        <button
          type="button"
          onClick={() => setActiveContact(row)}
          className="rounded-md p-2 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100"
        >
          <Eye className="h-4 w-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <DataTable
        columns={contactColumns}
        rows={contacts}
        getRowId={(row) => row._id}
        searchPlaceholder="Search messages…"
        searchFilter={(row, q) =>
          row.name.toLowerCase().includes(q) ||
          row.email.toLowerCase().includes(q) ||
          row.message.toLowerCase().includes(q)
        }
      />

      <DetailModal
        key={activeContact?._id ?? "contact-empty"}
        row={activeContact}
        onClose={() => setActiveContact(null)}
        onSave={async (id, status, notes) => {
          const result = await updateInquiry(id, {
            status: status as never,
            internalNotes: notes,
          });
          if (result.ok) {
            setContacts((prev) =>
              prev.map((r) => (r._id === id ? { ...r, status, internalNotes: notes } : r)),
            );
            toast("Message updated", "success");
          } else {
            toast(result.error, "error");
          }
        }}
        onDelete={async (id) => {
          const result = await deleteInquiry(id);
          if (result.ok) {
            setContacts((prev) => prev.filter((r) => r._id !== id));
            toast("Message deleted", "success");
          } else {
            toast(result.error, "error");
          }
        }}
      />
    </div>
  );
}
