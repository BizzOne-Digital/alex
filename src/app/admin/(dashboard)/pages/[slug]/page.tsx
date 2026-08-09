import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ensurePage } from "@/actions/admin/pages";
import { getPageDefinition, isKnownPageSlug } from "@/lib/admin/page-sections";
import { PageMetaForm } from "@/components/admin/PageMetaForm";
import { SectionEditor } from "@/components/admin/SectionEditor";

export default async function AdminPageEditorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!isKnownPageSlug(slug)) {
    notFound();
  }

  const [page, definition] = await Promise.all([
    ensurePage(slug),
    Promise.resolve(getPageDefinition(slug)),
  ]);

  if (!page || !definition) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/admin/pages"
          className="mb-2 inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-300"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Pages
        </Link>
        <h2 className="font-heading text-xl text-neutral-100">{definition.title} Page</h2>
        <p className="text-sm text-neutral-500">
          Update each section independently. Toggle visibility without deleting content.
        </p>
      </div>

      <PageMetaForm
        slug={slug}
        title={page.title}
        seoTitle={page.seoTitle}
        seoDescription={page.seoDescription}
        published={page.published}
      />

      <SectionEditor pageSlug={slug} definitions={definition.sections} sections={page.sections} />
    </div>
  );
}
