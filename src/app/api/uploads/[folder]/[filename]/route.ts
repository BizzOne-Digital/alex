import { connectDB } from "@/lib/db";
import { assertUploadFolder } from "@/lib/upload-urls";
import { StoredUpload } from "@/models/StoredUpload";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ folder: string; filename: string }>;
};

function sanitizeSegment(value: string): string | null {
  const decoded = decodeURIComponent(value);
  if (
    !decoded ||
    decoded.includes("..") ||
    decoded.includes("/") ||
    decoded.includes("\\")
  ) {
    return null;
  }
  return decoded;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { folder: rawFolder, filename: rawFilename } = await context.params;
    const folder = sanitizeSegment(rawFolder);
    const filename = sanitizeSegment(rawFilename);

    if (!folder || !filename) {
      return new Response("Invalid path", { status: 400 });
    }

    try {
      assertUploadFolder(folder);
    } catch {
      return new Response("Not found", { status: 404 });
    }

    await connectDB();
    const doc = await StoredUpload.findOne({ folder, filename })
      .select("+data mimeType size")
      .lean();

    if (!doc?.data) {
      return new Response("Not found", { status: 404 });
    }

    const body = Buffer.isBuffer(doc.data)
      ? doc.data
      : Buffer.from(doc.data as unknown as ArrayBuffer);

    return new Response(new Uint8Array(body), {
      status: 200,
      headers: {
        "Content-Type": doc.mimeType,
        "Content-Length": String(doc.size ?? body.length),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("[api:uploads:GET]", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
