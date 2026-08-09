"use client";

import Image from "next/image";
import {
  useCallback,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { cn } from "@/lib/utils";

type BeforeAfterSliderProps = {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt?: string;
  afterAlt?: string;
  className?: string;
  initialPosition?: number;
};

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt = "Before renovation",
  afterAlt = "After renovation",
  className,
  initialPosition = 50,
}: BeforeAfterSliderProps) {
  const id = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(initialPosition);
  const [dragging, setDragging] = useState(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, next)));
  }, []);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    updateFromClientX(e.clientX);
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    updateFromClientX(e.clientX);
  };

  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    setDragging(false);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setPosition((p) => Math.max(0, p - 2));
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setPosition((p) => Math.min(100, p + 2));
    }
    if (e.key === "Home") {
      e.preventDefault();
      setPosition(0);
    }
    if (e.key === "End") {
      e.preventDefault();
      setPosition(100);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative aspect-[16/10] w-full select-none overflow-hidden bg-ikasa-charcoal",
        className,
      )}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <Image
        src={afterSrc}
        alt={afterAlt}
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 960px"
        draggable={false}
      />

      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image
          src={beforeSrc}
          alt={beforeAlt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 960px"
          draggable={false}
        />
      </div>

      <div
        className="absolute inset-y-0 z-10 w-px bg-ikasa-white"
        style={{ left: `${position}%` }}
        aria-hidden
      >
        <div className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-ikasa-white/40 bg-ikasa-black/70 text-ikasa-white backdrop-blur-sm">
          <span className="font-label text-[0.65rem] tracking-[0.18em]">
            ||
          </span>
        </div>
      </div>

      <div
        role="slider"
        tabIndex={0}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        aria-labelledby={`${id}-label`}
        aria-orientation="horizontal"
        className="absolute inset-0 z-20 cursor-ew-resize outline-none"
        onKeyDown={onKeyDown}
      />

      <span id={`${id}-label`} className="sr-only">
        Compare before and after images
      </span>

      <span className="pointer-events-none absolute left-4 top-4 z-10 bg-ikasa-black/70 px-2.5 py-1 font-label text-[0.65rem] tracking-[0.18em] text-ikasa-white">
        Before
      </span>
      <span className="pointer-events-none absolute right-4 top-4 z-10 bg-ikasa-black/70 px-2.5 py-1 font-label text-[0.65rem] tracking-[0.18em] text-ikasa-white">
        After
      </span>
    </div>
  );
}
