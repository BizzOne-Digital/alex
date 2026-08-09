"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect } from "react";

export type LightboxImage = {
  src: string;
  alt: string;
  title?: string;
  caption?: string;
};

type GalleryLightboxProps = {
  images: LightboxImage[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

export function GalleryLightbox({
  images,
  index,
  onClose,
  onNavigate,
}: GalleryLightboxProps) {
  const isOpen = index !== null && index >= 0 && index < images.length;

  const goPrev = useCallback(() => {
    if (index === null) return;
    onNavigate((index - 1 + images.length) % images.length);
  }, [index, images.length, onNavigate]);

  const goNext = useCallback(() => {
    if (index === null) return;
    onNavigate((index + 1) % images.length);
  }, [index, images.length, onNavigate]);

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose, goPrev, goNext]);

  const current = isOpen && index !== null ? images[index] : null;

  return (
    <AnimatePresence>
      {isOpen && current ? (
        <motion.div
          key="lightbox"
          className="fixed inset-0 z-[95] flex items-center justify-center bg-ikasa-black/95 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-modal="true"
          aria-label={current.title || current.alt}
          onClick={onClose}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center border border-white/15 text-ikasa-white transition-colors hover:border-ikasa-red hover:text-ikasa-red sm:right-8 sm:top-8"
            aria-label="Close lightbox"
          >
            <X className="h-5 w-5" />
          </button>

          {images.length > 1 ? (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                className="absolute left-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-white/15 text-ikasa-white transition-colors hover:border-ikasa-red hover:text-ikasa-red sm:left-6"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                className="absolute right-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-white/15 text-ikasa-white transition-colors hover:border-ikasa-red hover:text-ikasa-red sm:right-6"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          ) : null}

          <motion.div
            key={current.src}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-4 flex max-h-[85vh] w-full max-w-5xl flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden border border-white/10 sm:aspect-[16/10]">
              <Image
                src={current.src}
                alt={current.alt}
                fill
                className="object-contain bg-ikasa-charcoal"
                sizes="(max-width: 1024px) 100vw, 960px"
              />
            </div>
            {(current.title || current.caption) && (
              <div className="mt-4 flex w-full flex-col items-center gap-1 text-center">
                {current.title ? (
                  <p className="font-heading text-lg text-ikasa-white">
                    {current.title}
                  </p>
                ) : null}
                {current.caption ? (
                  <p className="max-w-xl text-sm text-ikasa-medium-grey">
                    {current.caption}
                  </p>
                ) : null}
              </div>
            )}
            {images.length > 1 ? (
              <p className="mt-3 font-label text-[0.65rem] tracking-[0.2em] text-ikasa-medium-grey">
                {String(index! + 1).padStart(2, "0")} /{" "}
                {String(images.length).padStart(2, "0")}
              </p>
            ) : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}