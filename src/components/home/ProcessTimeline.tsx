"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type ProcessTimelineProps = {
  steps: string[];
  className?: string;
  tone?: "light" | "dark";
};

export function ProcessTimeline({
  steps,
  className,
  tone = "light",
}: ProcessTimelineProps) {
  const reduced = useReducedMotion();

  if (!steps.length) return null;

  const textColor =
    tone === "light" ? "text-ikasa-warm-white" : "text-ikasa-black";
  const trackColor =
    tone === "light" ? "bg-ikasa-graphite" : "bg-ikasa-light-grey";
  const badgeBg =
    tone === "light" ? "bg-ikasa-black" : "bg-ikasa-warm-white";

  return (
    <div className={cn("relative", className)}>
      {/* Mobile / tablet: vertical list */}
      <div className="relative flex flex-col lg:hidden">
        <span
          className={cn("absolute bottom-2 left-[0.95rem] top-2 w-px", trackColor)}
          aria-hidden
        />
        <motion.span
          className="absolute left-[0.95rem] top-2 w-px origin-top bg-ikasa-red"
          style={{ height: "calc(100% - 1rem)" }}
          initial={reduced ? undefined : { scaleY: 0 }}
          whileInView={reduced ? undefined : { scaleY: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden
        />
        {steps.map((step, i) => (
          <div key={`step-m-${i}`} className="relative flex gap-5 py-4">
            <span
              className={cn(
                "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center border border-ikasa-red font-label text-[0.65rem] text-ikasa-red",
                badgeBg,
              )}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <p
              className={cn(
                "pt-1 font-heading text-base leading-snug tracking-tight sm:text-lg",
                textColor,
              )}
            >
              {step}
            </p>
          </div>
        ))}
      </div>

      {/* Desktop: spaced horizontal steps with wrapping labels */}
      <div className="relative hidden lg:block">
        <span
          className={cn(
            "absolute left-4 right-4 top-4 h-px",
            trackColor,
          )}
          aria-hidden
        />
        <motion.span
          className="absolute left-4 top-4 h-px origin-left bg-ikasa-red"
          style={{ width: "calc(100% - 2rem)" }}
          initial={reduced ? undefined : { scaleX: 0 }}
          whileInView={reduced ? undefined : { scaleX: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden
        />

        <ol
          className={cn(
            "relative grid gap-x-4 gap-y-10",
            steps.length <= 4
              ? "grid-cols-4"
              : steps.length === 5
                ? "grid-cols-5"
                : "grid-cols-3 xl:grid-cols-6",
          )}
        >
          {steps.map((step, i) => (
            <motion.li
              key={`step-d-${i}`}
              className="flex min-w-0 flex-col items-start gap-4"
              initial={reduced ? undefined : { opacity: 0, y: 16 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
            >
              <span
                className={cn(
                  "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center border border-ikasa-red font-label text-[0.65rem] text-ikasa-red",
                  badgeBg,
                )}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <p
                className={cn(
                  "w-full max-w-[9.5rem] font-heading text-sm leading-snug tracking-tight xl:text-[0.95rem]",
                  textColor,
                )}
              >
                {step}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </div>
  );
}
