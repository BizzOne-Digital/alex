"use client";

import {
  useRef,
  type MouseEvent,
  type ReactNode,
} from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type MagneticButtonProps = {
  children: ReactNode;
  className?: string;
  strength?: number;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
  "aria-label"?: string;
};

export function MagneticButton({
  children,
  className,
  strength = 0.35,
  type = "button",
  disabled,
  onClick,
  "aria-label": ariaLabel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 20, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 260, damping: 20, mass: 0.4 });

  const onMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      style={{ x: springX, y: springY }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn("magnetic-target inline-flex", className)}
    >
      {children}
    </motion.button>
  );
}
