import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { saveFile, UPLOAD_FOLDERS } from "@/lib/uploads";

export async function POST(request: Request) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const folder = searchParams.get("folder");
    if (!folder) {
      return NextResponse.json(
        {
          error: "Missing folder query param",
          allowed: UPLOAD_FOLDERS,
        },
        { status: 400 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Missing file field in multipart form data" },
        { status: 400 },
      );
    }

    const result = await saveFile(folder, file);
    return NextResponse.json({ url: result.url });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Upload failed";
    const status =
      message.includes("Invalid") ||
      message.includes("Unsupported") ||
      message.includes("exceeds") ||
      message.includes("MIME") ||
      message.includes("extension") ||
      message.includes("SVG") ||
      message.includes("Unrecognized")
        ? 400
        : 500;
    console.error("Upload error:", error);
    return NextResponse.json({ error: message }, { status });
  }
}
