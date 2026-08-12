import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  saveStoredUpload,
  UPLOAD_FOLDERS,
} from "@/lib/uploads";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const folder = formData.get("folder");

    if (typeof folder !== "string" || !folder.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing folder field",
          allowed: UPLOAD_FOLDERS,
        },
        { status: 400 },
      );
    }

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: "Missing file field in multipart form data" },
        { status: 400 },
      );
    }

    const result = await saveStoredUpload(folder.trim(), file);

    return NextResponse.json({
      success: true,
      url: result.url,
      filename: result.filename,
      size: result.size,
      folder: result.folder,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Upload failed";
    const status =
      message.includes("Invalid") ||
      message.includes("Unsupported") ||
      message.includes("exceeds") ||
      message.includes("MIME") ||
      message.includes("extension") ||
      message.includes("Unrecognized")
        ? 400
        : 500;
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
