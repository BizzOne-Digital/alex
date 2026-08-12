import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { deleteStoredUpload, isStoredUploadUrl } from "@/lib/uploads";

export const runtime = "nodejs";

export async function DELETE(request: Request) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json().catch(() => null)) as {
      url?: string;
    } | null;

    const { searchParams } = new URL(request.url);
    const url = body?.url || searchParams.get("url");

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Missing url" }, { status: 400 });
    }

    if (!isStoredUploadUrl(url)) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    await deleteStoredUpload(url);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Delete failed";
    console.error("Upload delete error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
