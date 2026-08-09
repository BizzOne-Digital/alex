"use client";

import { usePathname } from "next/navigation";
import { ADMIN_PAGE_TITLES } from "@/lib/admin/nav";

function resolveTitle(pathname: string): string {
  if (ADMIN_PAGE_TITLES[pathname]) return ADMIN_PAGE_TITLES[pathname];

  const segments = pathname.split("/").filter(Boolean);
  if (segments.length >= 2) {
    const base = `/${segments[0]}/${segments[1]}`;
    if (ADMIN_PAGE_TITLES[base]) {
      const last = segments[segments.length - 1];
      if (last === "new") return `New ${ADMIN_PAGE_TITLES[base].replace(/s$/, "")}`;
      return `${ADMIN_PAGE_TITLES[base]} · Edit`;
    }
  }
  return "Admin";
}

export function AdminHeader() {
  const pathname = usePathname();
  const title = resolveTitle(pathname || "/admin");

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-neutral-800 bg-neutral-950/95 px-6 backdrop-blur">
      <h1 className="font-heading text-lg text-neutral-100">{title}</h1>
      <div className="flex items-center gap-2 text-xs text-neutral-500">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Connected to MongoDB
      </div>
    </header>
  );
}
