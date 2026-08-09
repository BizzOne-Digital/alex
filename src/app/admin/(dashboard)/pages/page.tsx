import Link from "next/link";
import { ArrowRight, LayoutTemplate } from "lucide-react";
import { listPagesStatus } from "@/actions/admin/pages";
import { PublishedBadge } from "@/components/admin/StatusBadge";

export default async function AdminPagesListPage() {
  const pages = await listPagesStatus();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-heading text-xl text-neutral-100">Pages</h2>
        <p className="text-sm text-neutral-500">
          Edit the content of every public page, section by section.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pages.map((page) => (
          <Link
            key={page.slug}
            href={`/admin/pages/${page.slug}`}
            className="group flex flex-col gap-3 rounded-lg border border-neutral-800 bg-neutral-900/50 p-5 transition-colors hover:border-neutral-700 hover:bg-neutral-900"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-red-600/10 text-red-500">
                <LayoutTemplate className="h-4 w-4" />
              </span>
              <ArrowRight className="h-4 w-4 text-neutral-600 transition-transform group-hover:translate-x-0.5 group-hover:text-neutral-300" />
            </div>
            <div>
              <p className="font-heading text-base text-neutral-100">{page.title}</p>
              <p className="text-xs text-neutral-500">/{page.slug === "home" ? "" : page.slug}</p>
            </div>
            <div className="flex items-center gap-2">
              {page.exists ? (
                <PublishedBadge published={page.published} />
              ) : (
                <span className="text-xs text-neutral-500">Not created yet — click to initialize</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
