"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { CinematicIntro } from "@/components/intro/CinematicIntro";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageTransition } from "@/components/motion/PageTransition";
import type {
  PublicServiceNavItem,
  PublicSiteSettings,
} from "@/lib/defaults";

type SiteShellProps = {
  children: ReactNode;
  settings: PublicSiteSettings;
  services: PublicServiceNavItem[];
};

export function SiteShell({
  children,
  settings,
  services,
}: SiteShellProps) {
  const pathname = usePathname();
  const showIntro = pathname === "/";

  return (
    <div className="flex min-h-dvh w-full max-w-[100vw] flex-1 flex-col overflow-x-clip">
      {showIntro ? <CinematicIntro enabled /> : null}
      <Header settings={settings} services={services} />
      <PageTransition />
      <main id="main-content" className="w-full min-w-0 flex-1 overflow-x-clip">
        {children}
      </main>
      <Footer settings={settings} services={services} />
    </div>
  );
}
