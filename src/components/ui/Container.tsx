import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  narrow?: boolean;
};

export function Container({
  children,
  className,
  as: Tag = "div",
  narrow = false,
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full min-w-0 px-5 sm:px-6 lg:px-8",
        narrow ? "max-w-4xl" : "max-w-[var(--container-max)]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
