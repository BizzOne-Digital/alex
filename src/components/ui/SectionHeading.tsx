import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
  action?: ReactNode;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "dark",
  className,
  action,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <div className="space-y-4">
        {eyebrow ? (
          <p
            className={cn(
              "font-label text-[0.72rem] tracking-[0.22em]",
              tone === "dark" ? "text-ikasa-red" : "text-ikasa-red",
            )}
          >
            {eyebrow}
          </p>
        ) : null}
        <div className="relative inline-block max-w-3xl">
          <h2
            className={cn(
              "font-heading text-3xl leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl",
              tone === "dark" ? "text-ikasa-black" : "text-ikasa-warm-white",
            )}
          >
            {title}
          </h2>
          <span
            className="mt-4 block h-px w-16 bg-ikasa-red"
            aria-hidden
          />
        </div>
        {description ? (
          <p
            className={cn(
              "max-w-2xl text-base leading-relaxed sm:text-lg",
              tone === "dark" ? "text-ikasa-medium-grey" : "text-ikasa-light-grey",
              align === "center" && "mx-auto",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
