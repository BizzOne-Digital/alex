"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type RevealDirection = "up" | "left" | "right";

type RevealProps = {
  children: ReactNode;
  direction?: RevealDirection;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  amount?: number;
};

const offsets: Record<RevealDirection, { x: number; y: number }> = {
  up: { x: 0, y: 28 },
  left: { x: -24, y: 0 },
  right: { x: 24, y: 0 },
};

export function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.75,
  className,
  once = true,
  amount = 0.25,
}: RevealProps) {
  const reduced = useReducedMotion();
  const offset = offsets[direction];

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
