"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { LogOut, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { ADMIN_NAV_ITEMS } from "@/lib/admin/nav";

type SidebarProps = {
  userName?: string;
  userEmail?: string;
};

export function Sidebar({ userName, userEmail }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.push("/admin/login");
      router.refresh();
    }
  };

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-neutral-800 bg-neutral-950">
      <div className="flex items-center gap-2.5 border-b border-neutral-800 px-5 py-5">
        <span className="flex h-8 w-8 items-center justify-center rounded bg-red-600 font-heading text-sm font-bold text-white">
          IK
        </span>
        <div>
          <p className="font-heading text-sm leading-none text-white">Ikasa Admin</p>
          <p className="text-[0.68rem] text-neutral-500">Renovations CMS</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="flex flex-col gap-1">
          {ADMIN_NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
                    active
                      ? "bg-red-600/15 text-red-400 ring-1 ring-inset ring-red-600/30"
                      : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-100",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-neutral-800 px-3 py-4">
        <Link
          href="/"
          target="_blank"
          className="mb-2 flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-neutral-400 transition-colors hover:bg-neutral-900 hover:text-neutral-100"
        >
          <ExternalLink className="h-4 w-4 shrink-0" />
          View website
        </Link>

        {(userName || userEmail) && (
          <div className="mb-2 px-3 py-1.5">
            <p className="truncate text-sm text-neutral-200">{userName}</p>
            <p className="truncate text-xs text-neutral-500">{userEmail}</p>
          </div>
        )}

        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-neutral-400 transition-colors hover:bg-red-950/40 hover:text-red-400 disabled:opacity-50"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {loggingOut ? "Signing out…" : "Logout"}
        </button>
      </div>
    </aside>
  );
}
