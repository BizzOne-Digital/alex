"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

const STORAGE_KEY = "ikasa_intro_seen";
const INTRO_MS = 3800;

type CinematicIntroProps = {
  enabled?: boolean;
  tagline?: string;
};

function subscribeIntro() {
  return () => {};
}

function getIntroSeen() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return true;
  }
}

function getIntroSeenServer() {
  return true;
}

export function CinematicIntro({ enabled = true, tagline }: CinematicIntroProps) {
  const reduced = useReducedMotion();
  const seen = useSyncExternalStore(
    subscribeIntro,
    getIntroSeen,
    getIntroSeenServer,
  );
  const [dismissed, setDismissed] = useState(false);
  const [phase, setPhase] = useState(0);
  const visible = enabled && !seen && !dismissed;

  const dismiss = useCallback(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setDismissed(true);
    document.documentElement.classList.remove("overflow-hidden");
    document.body.classList.remove("overflow-hidden");
  }, []);

  useEffect(() => {
    if (!visible) return;

    document.documentElement.classList.add("overflow-hidden");
    document.body.classList.add("overflow-hidden");

    if (reduced) {
      const t = window.setTimeout(dismiss, 900);
      return () => {
        window.clearTimeout(t);
        document.documentElement.classList.remove("overflow-hidden");
        document.body.classList.remove("overflow-hidden");
      };
    }

    const timers = [
      window.setTimeout(() => setPhase(1), 200),
      window.setTimeout(() => setPhase(2), 700),
      window.setTimeout(() => setPhase(3), 1300),
      window.setTimeout(() => setPhase(4), 1900),
      window.setTimeout(() => setPhase(5), 2500),
      window.setTimeout(() => setPhase(6), 3000),
      window.setTimeout(dismiss, INTRO_MS),
    ];

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      document.documentElement.classList.remove("overflow-hidden");
      document.body.classList.remove("overflow-hidden");
    };
  }, [visible, reduced, dismiss]);

  const letters = "IKASA".split("");

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="ikasa-cinematic-intro"
          className="fixed inset-0 z-[100] flex items-center justify-center text-ikasa-white"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          role="dialog"
          aria-modal="true"
          aria-label="Ikasa Renovations introduction"
        >
          <motion.div
            className="pointer-events-none absolute inset-0 z-10 flex"
            aria-hidden
          >
            <motion.div
              className="h-full w-1/2 bg-[#090909]"
              animate={phase >= 6 ? { x: "-105%" } : { x: 0 }}
              transition={{ duration: 0.7, ease: [0.77, 0, 0.175, 1] }}
            />
            <motion.div
              className="h-full w-1/2 bg-[#090909]"
              animate={phase >= 6 ? { x: "105%" } : { x: 0 }}
              transition={{ duration: 0.7, ease: [0.77, 0, 0.175, 1] }}
            />
          </motion.div>

          <motion.div
            className="pointer-events-none absolute left-0 right-0 top-1/2 z-20 h-px bg-ikasa-red"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: phase >= 6 ? 0 : phase >= 1 ? 1 : 0 }}
            transition={{ duration: 0.35 }}
            aria-hidden
          />

          <button
            type="button"
            onClick={dismiss}
            className="absolute right-5 top-5 z-40 font-label text-[0.7rem] tracking-[0.22em] text-ikasa-medium-grey transition-colors hover:text-ikasa-white sm:right-8 sm:top-8"
          >
            Skip intro
          </button>

          <motion.div
            className="relative z-30 flex w-full max-w-3xl flex-col items-center px-6 text-center film-grain"
            animate={{
              opacity: phase >= 6 ? 0 : 1,
              scale: phase >= 6 ? 0.98 : 1,
            }}
            transition={{ duration: 0.35 }}
          >
            <div
              className="pointer-events-none absolute inset-x-0 -top-16 flex justify-between px-2 font-label text-[0.6rem] tracking-[0.25em] text-ikasa-medium-grey/50 sm:-top-20"
              aria-hidden
            >
              <span>00.00</span>
              <span className="hidden sm:inline">ELEV. A — ROOF LINE</span>
              <span>12.40</span>
            </div>

            <div className="relative mb-10 w-full max-w-md" aria-hidden>
              <svg
                viewBox="0 0 400 80"
                className="h-16 w-full overflow-visible sm:h-20"
                fill="none"
              >
                <motion.path
                  d="M20 60 L200 12 L380 60"
                  stroke="#D60000"
                  strokeWidth="2"
                  strokeLinecap="square"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: phase >= 1 || reduced ? 1 : 0 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                />
                <motion.rect
                  x="268"
                  y="8"
                  width="18"
                  height="28"
                  stroke="#D60000"
                  strokeWidth="1.5"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{
                    opacity: phase >= 1 || reduced ? 1 : 0,
                    y: phase >= 1 || reduced ? 0 : 8,
                  }}
                  transition={{ delay: 0.35, duration: 0.4 }}
                />
                <motion.line
                  x1="20"
                  y1="68"
                  x2="380"
                  y2="68"
                  stroke="#2A2A2A"
                  strokeWidth="1"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: phase >= 1 || reduced ? 1 : 0 }}
                  style={{ originX: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                />
              </svg>

              <div className="mt-1 flex justify-between px-1">
                {["A1", "A2", "A3", "A4"].map((label, i) => (
                  <motion.span
                    key={label}
                    className="font-label text-[0.55rem] tracking-[0.2em] text-ikasa-graphite"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: phase >= 2 || reduced ? 1 : 0 }}
                    transition={{ delay: 0.05 * i }}
                  >
                    {label}
                  </motion.span>
                ))}
              </div>
            </div>

            <div
              className="flex items-end justify-center gap-1 sm:gap-2"
              aria-label="IKASA"
            >
              {letters.map((letter, i) => (
                <motion.span
                  key={`ikasa-letter-${i}`}
                  className="font-heading text-5xl font-semibold tracking-[0.18em] text-ikasa-white sm:text-7xl"
                  initial={{ opacity: 0, y: 28 }}
                  animate={{
                    opacity: phase >= 2 || reduced ? 1 : 0,
                    y: phase >= 2 || reduced ? 0 : 28,
                  }}
                  transition={{
                    delay: reduced ? 0 : 0.08 * i,
                    duration: 0.45,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>

            <motion.div
              className="mt-4 overflow-hidden bg-ikasa-graphite px-5 py-2"
              initial={{ width: 0, opacity: 0 }}
              animate={{
                width: phase >= 3 || reduced ? "auto" : 0,
                opacity: phase >= 3 || reduced ? 1 : 0,
              }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="font-label whitespace-nowrap text-[0.75rem] tracking-[0.35em] text-ikasa-light-grey sm:text-sm">
                RENOVATIONS
              </span>
            </motion.div>

            <motion.p
              className="mt-8 max-w-md font-heading text-lg tracking-tight text-ikasa-warm-white sm:text-2xl"
              initial={{ opacity: 0, y: 16 }}
              animate={{
                opacity: phase >= 4 || reduced ? 1 : 0,
                y: phase >= 4 || reduced ? 0 : 16,
              }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {tagline || "From Outdated to Outstanding"}
            </motion.p>

            <motion.div
              className="mt-8 flex w-full max-w-sm items-stretch gap-0 overflow-hidden border border-ikasa-graphite"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{
                opacity: phase >= 5 || reduced ? 1 : 0,
                scale: phase >= 5 || reduced ? 1 : 0.96,
              }}
              transition={{ duration: 0.45 }}
              aria-hidden
            >
              <div className="flex flex-1 flex-col items-center justify-center bg-ikasa-charcoal py-4">
                <span className="font-label text-[0.6rem] tracking-[0.2em] text-ikasa-medium-grey">
                  Before
                </span>
                <span className="mt-1 text-xs text-ikasa-medium-grey/70">
                  Outdated
                </span>
              </div>
              <motion.div
                className="w-px self-stretch bg-ikasa-red"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: phase >= 5 || reduced ? 1 : 0 }}
                transition={{ duration: 0.35, delay: 0.1 }}
              />
              <div className="flex flex-1 flex-col items-center justify-center bg-ikasa-graphite/80 py-4">
                <span className="font-label text-[0.6rem] tracking-[0.2em] text-ikasa-red">
                  After
                </span>
                <span className="mt-1 text-xs text-ikasa-light-grey/80">
                  Outstanding
                </span>
              </div>
            </motion.div>

            <motion.div
              className="mt-10 h-px w-24 bg-ikasa-red"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: phase >= 4 || reduced ? 1 : 0 }}
              transition={{ duration: 0.5 }}
              aria-hidden
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
