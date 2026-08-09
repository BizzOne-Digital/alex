"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = true,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 px-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-lg border border-neutral-800 bg-neutral-900 p-5 shadow-2xl"
          >
            <div className="flex items-start gap-3">
              <span
                className={cn(
                  "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                  danger ? "bg-red-500/10 text-red-500" : "bg-neutral-700/40 text-neutral-300",
                )}
              >
                <AlertTriangle className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <h3 className="font-heading text-base text-neutral-100">{title}</h3>
                {description ? (
                  <div className="mt-1 text-sm text-neutral-400">{description}</div>
                ) : null}
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="rounded-md border border-neutral-700 px-3.5 py-2 text-sm text-neutral-300 transition-colors hover:bg-neutral-800 disabled:opacity-50"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={loading}
                className={cn(
                  "inline-flex items-center gap-2 rounded-md px-3.5 py-2 text-sm font-medium text-white transition-colors disabled:opacity-60",
                  danger ? "bg-red-600 hover:bg-red-700" : "bg-neutral-700 hover:bg-neutral-600",
                )}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/** Hook-style helper for common "click delete -> confirm -> run action" flow. */
export function useConfirm() {
  const [state, setState] = useState<{
    open: boolean;
    title: string;
    description?: ReactNode;
    danger?: boolean;
    confirmLabel?: string;
    onConfirm: () => void | Promise<void>;
  }>({ open: false, title: "", onConfirm: () => {} });

  const confirm = (options: Omit<typeof state, "open">) => {
    setState({ ...options, open: true });
  };

  const close = () => setState((prev) => ({ ...prev, open: false }));

  const dialog = (
    <ConfirmDialog
      open={state.open}
      title={state.title}
      description={state.description}
      danger={state.danger}
      confirmLabel={state.confirmLabel}
      onConfirm={async () => {
        await state.onConfirm();
        close();
      }}
      onCancel={close}
    />
  );

  return { confirm, dialog };
}
