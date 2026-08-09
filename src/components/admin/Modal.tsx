"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = "max-w-lg",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: string;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[85] flex items-start justify-center overflow-y-auto bg-black/70 px-4 py-8"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
            className={`w-full ${maxWidth} rounded-lg border border-neutral-800 bg-neutral-900 shadow-2xl`}
          >
            <div className="flex items-center justify-between border-b border-neutral-800 px-5 py-4">
              <h3 className="font-heading text-base text-neutral-100">{title}</h3>
              <button
                type="button"
                onClick={onClose}
                className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-800 hover:text-neutral-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[75vh] overflow-y-auto px-5 py-5">{children}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
