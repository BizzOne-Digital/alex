"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Plus, Save, Trash2 } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/admin/DataTable";
import { PublishedBadge } from "@/components/admin/StatusBadge";
import { Input, Textarea, Toggle } from "@/components/admin/FormField";
import { Modal } from "@/components/admin/Modal";
import { useConfirm } from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { createFaq, deleteFaq, reorderFaq, toggleFaqPublished, updateFaq } from "@/actions/admin/faqs";

export type AdminFaqRow = {
  _id: string;
  question: string;
  answer: string;
  category: string;
  published: boolean;
};

type FormState = Omit<AdminFaqRow, "_id">;
const EMPTY: FormState = { question: "", answer: "", category: "general", published: true };

export function FaqsManager({ initialRows }: { initialRows: AdminFaqRow[] }) {
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

  const openEdit = (row: AdminFaqRow) => {
    setEditingId(row._id);
    setForm({ question: row.question, answer: row.answer, category: row.category, published: row.published });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.question.trim() || !form.answer.trim()) {
      toast("Question and answer are required", "error");
      return;
    }
    setSaving(true);
    try {
      const result = editingId ? await updateFaq(editingId, form) : await createFaq(form);
      if (result.ok) {
        toast(editingId ? "FAQ updated" : "FAQ created", "success");
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
    setRows((prev) => prev.map((r) => (r._id === id ? { ...r, published: value } : r)));
    const result = await toggleFaqPublished(id, value);
    if (!result.ok) {
      toast(result.error, "error");
      setRows((prev) => prev.map((r) => (r._id === id ? { ...r, published: !value } : r)));
    }
  };

  const handleReorder = async (id: string, direction: "up" | "down") => {
    const result = await reorderFaq(id, direction);
    if (result.ok) router.refresh();
    else toast(result.error, "error");
  };

  const handleDelete = (row: AdminFaqRow) => {
    confirm({
      title: "Delete this FAQ?",
      description: row.question,
      confirmLabel: "Delete",
      onConfirm: async () => {
        const result = await deleteFaq(row._id);
        if (result.ok) {
          setRows((prev) => prev.filter((r) => r._id !== row._id));
          toast("FAQ deleted", "success");
        } else {
          toast(result.error, "error");
        }
      },
    });
  };

  const columns: DataTableColumn<AdminFaqRow>[] = [
    {
      key: "question",
      header: "Question",
      render: (row) => (
        <div className="max-w-md">
          <button onClick={() => openEdit(row)} className="text-sm font-medium text-neutral-100 hover:text-red-400">
            {row.question}
          </button>
          <p className="truncate text-xs text-neutral-500">{row.answer}</p>
        </div>
      ),
    },
    { key: "category", header: "Category", render: (row) => <span className="text-neutral-400">{row.category}</span> },
    { key: "status", header: "Status", render: (row) => <PublishedBadge published={row.published} /> },
    {
      key: "published",
      header: "Published",
      render: (row) => <Toggle label="" checked={row.published} onChange={(v) => handleToggle(row._id, v)} className="w-auto border-none bg-transparent p-0" />,
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
          New FAQ
        </button>
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        getRowId={(row) => row._id}
        searchPlaceholder="Search FAQs…"
        searchFilter={(row, q) => row.question.toLowerCase().includes(q) || row.answer.toLowerCase().includes(q)}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit FAQ" : "New FAQ"}>
        <div className="flex flex-col gap-4">
          <Input label="Question" required value={form.question} onChange={(e) => patch({ question: e.target.value })} />
          <Textarea label="Answer" required value={form.answer} onChange={(e) => patch({ answer: e.target.value })} rows={4} />
          <Input label="Category" value={form.category} onChange={(e) => patch({ category: e.target.value })} placeholder="general" />
          <Toggle label="Published" checked={form.published} onChange={(published) => patch({ published })} />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {editingId ? "Save changes" : "Create FAQ"}
            </button>
          </div>
        </div>
      </Modal>
      {dialog}
    </div>
  );
}
