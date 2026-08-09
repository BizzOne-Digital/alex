"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

function subscribeReducedMotion(onStoreChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

export function PageTransition() {
  const pathname = usePathname();
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
  const [phase, setPhase] = useState<"idle" | "cover" | "reveal">("idle");
  const previousPath = useRef(pathname);

  useEffect(() => {
    if (pathname === previousPath.current) return;

    if (reduced) {
      previousPath.current = pathname;
      return;
    }

    let coverTimer = 0;
    let idleTimer = 0;
    const startTimer = window.setTimeout(() => {
      setPhase("cover");
      coverTimer = window.setTimeout(() => {
        previousPath.current = pathname;
        setPhase("reveal");
        idleTimer = window.setTimeout(() => setPhase("idle"), 480);
      }, 420);
    }, 0);

    return () => {
      window.clearTimeout(startTimer);
      window.clearTimeout(coverTimer);
      window.clearTimeout(idleTimer);
    };
  }, [pathname, reduced]);

  return (
    <AnimatePresence>
      {phase !== "idle" && (
        <motion.div
          key={`${pathname}-${phase}`}
          className="pointer-events-none fixed inset-0 z-[90]"
          initial={false}
          aria-hidden
        >
          <motion.div
            className="absolute inset-0 bg-ikasa-black"
            initial={{ scaleY: phase === "cover" ? 0 : 1 }}
            animate={{ scaleY: phase === "cover" ? 1 : 0 }}
            transition={{ duration: 0.45, ease: [0.77, 0, 0.175, 1] }}
            style={{ originY: phase === "cover" ? 0 : 1 }}
          />
          <motion.div
            className="absolute left-0 right-0 top-1/2 h-px bg-ikasa-red"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{
              scaleX: phase === "cover" ? 1 : 0,
              opacity: phase === "cover" ? 1 : 0,
            }}
            transition={{ duration: 0.35, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            style={{ originX: 0 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
