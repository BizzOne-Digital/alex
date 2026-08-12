import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { persistPageSection } from "@/lib/admin/persist-page-section";
import { revalidatePageSlug } from "@/lib/revalidate";
import { isKnownPageSlug } from "@/lib/admin/page-sections";

type RouteContext = {
  params: Promise<{ slug: string; sectionKey: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const { slug, sectionKey } = await context.params;
    if (!isKnownPageSlug(slug)) {
      return NextResponse.json({ ok: false, error: "Unknown page" }, { status: 404 });
    }

    const body = await request.json();
    const result = await persistPageSection(slug, sectionKey, body);

    if (!result.ok) {
      return NextResponse.json(result, { status: 400 });
    }

    revalidatePageSlug(slug);
    console.log("[api:save-section] saved", slug, sectionKey);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api:save-section]", error);
    return NextResponse.json(
      { ok: false, error: "Unable to save section" },
      { status: 500 },
    );
  }
}
