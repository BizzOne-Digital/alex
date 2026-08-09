"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { ToastProvider } from "@/components/ui/Toast";

export function Providers({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  return (
    <ToastProvider>
      {!isAdmin && <SmoothScroll />}
      {children}
    </ToastProvider>
  );
}
