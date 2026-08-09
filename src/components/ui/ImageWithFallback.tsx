"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

type ImageWithFallbackProps = Omit<ImageProps, "src" | "alt"> & {
  src?: string | null;
  alt: string;
  fallbackSrc?: string;
  fallbackClassName?: string;
};

export function ImageWithFallback({
  src,
  alt,
  fallbackSrc,
  className,
  fallbackClassName,
  ...rest
}: ImageWithFallbackProps) {
  const [failed, setFailed] = useState(false);
  const hasSrc = Boolean(src && !failed);

  if (!hasSrc && !fallbackSrc) {
    return (
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center bg-ikasa-charcoal",
          className,
          fallbackClassName,
        )}
        role="img"
        aria-label={alt}
      >
        <div className="flex flex-col items-center gap-3 px-6 text-center">
          <svg
            viewBox="0 0 120 80"
            className="h-14 w-20 text-ikasa-red"
            aria-hidden
          >
            <path
              fill="currentColor"
              d="M8 62 L60 12 L104 52 L104 62 L94 62 L94 36 L80 36 L80 44 L60 22 L18 62 Z"
            />
          </svg>
          <span className="font-label text-[0.6rem] tracking-[0.2em] text-ikasa-light-grey/70">
            Image coming soon
          </span>
        </div>
      </div>
    );
  }

  const resolved = hasSrc ? (src as string) : (fallbackSrc as string);

  return (
    <Image
      src={resolved}
      alt={alt}
      className={cn(className, !hasSrc && fallbackClassName)}
      onError={() => setFailed(true)}
      {...rest}
    />
  );
}
