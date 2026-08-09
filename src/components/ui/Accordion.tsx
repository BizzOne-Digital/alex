"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type AccordionItem = {
  id: string;
  title: string;
  content: ReactNode;
};

type AccordionProps = {
  items: AccordionItem[];
  className?: string;
  allowMultiple?: boolean;
};

export function Accordion({
  items,
  className,
  allowMultiple = false,
}: AccordionProps) {
  const baseId = useId();
  const reduced = useReducedMotion();
  const [open, setOpen] = useState<string[]>([]);

  const toggle = (id: string) => {
    setOpen((prev) => {
      const isOpen = prev.includes(id);
      if (allowMultiple) {
        return isOpen ? prev.filter((x) => x !== id) : [...prev, id];
      }
      return isOpen ? [] : [id];
    });
  };

  return (
    <div className={cn("divide-y divide-ikasa-light-grey/70 border-y border-ikasa-light-grey/70", className)}>
      {items.map((item, index) => {
        const isOpen = open.includes(item.id);
        const panelId = `${baseId}-panel-${item.id}`;
        const buttonId = `${baseId}-button-${item.id}`;

        return (
          <div key={item.id}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className="flex w-full items-center justify-between gap-6 py-5 text-left transition-colors hover:text-ikasa-red"
              >
                <span className="flex items-baseline gap-4">
                  <span className="font-label text-[0.7rem] tracking-[0.2em] text-ikasa-medium-grey">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-heading text-lg tracking-tight sm:text-xl">
                    {item.title}
                  </span>
                </span>
                <span
                  className={cn(
                    "relative h-4 w-4 shrink-0 text-ikasa-red transition-transform duration-300",
                    isOpen && "rotate-45",
                  )}
                  aria-hidden
                >
                  <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
                  <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current" />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={reduced ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduced ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pb-6 pl-10 pr-8 text-ikasa-medium-grey leading-relaxed sm:pl-12">
                    {item.content}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
