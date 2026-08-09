import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { deleteFile } from "@/lib/uploads";

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
      return NextResponse.json(
        { error: "Missing url" },
        { status: 400 },
      );
    }

    await deleteFile(url);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Delete failed";
    const status =
      message.includes("Invalid") || message.includes("traversal")
        ? 400
        : 500;
    console.error("Upload delete error:", error);
    return NextResponse.json({ error: message }, { status });
  }
}
