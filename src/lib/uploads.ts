import { randomBytes } from "crypto";
import { connectDB } from "@/lib/db";
import {
  assertUploadFolder,
  MAX_UPLOAD_BYTES,
  parseStoredUploadUrl,
  storedUploadPublicUrl,
  UPLOAD_FOLDERS,
  type UploadFolder,
} from "@/lib/upload-urls";
import { StoredUpload } from "@/models/StoredUpload";

export {
  MAX_UPLOAD_BYTES,
  UPLOAD_FOLDERS,
  type UploadFolder,
  assertUploadFolder,
  isStoredUploadUrl,
  isLegacyDiskUploadUrl,
  parseStoredUploadUrl,
  storedUploadPublicUrl,
  normalizeImageSrc,
} from "@/lib/upload-urls";

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const EXT_TO_MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

function detectImageMime(buffer: Buffer): string | null {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return "image/png";
  }
  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "image/webp";
  }
  if (buffer.length >= 6 && buffer.toString("ascii", 0, 3) === "GIF") {
    return "image/gif";
  }
  return null;
}

function validateImageFile(
  file: File,
  buffer: Buffer,
): { mime: string; ext: string } {
  if (file.size > MAX_UPLOAD_BYTES || buffer.length > MAX_UPLOAD_BYTES) {
    throw new Error("File exceeds maximum size of 8MB");
  }

  const magicMime = detectImageMime(buffer);
  if (!magicMime) {
    throw new Error("Unrecognized or unsupported image file");
  }

  const allowedMimes = Object.keys(MIME_TO_EXT);
  if (!allowedMimes.includes(magicMime)) {
    throw new Error("Unsupported image type. Allowed: JPEG, PNG, WebP, GIF");
  }

  const declaredMime = (file.type || "").toLowerCase();
  if (declaredMime) {
    const declaredNormalized =
      declaredMime === "image/jpg" ? "image/jpeg" : declaredMime;
    if (declaredNormalized !== magicMime) {
      throw new Error("File MIME type does not match file contents");
    }
  }

  const originalExt = file.name.includes(".")
    ? `.${file.name.split(".").pop()?.toLowerCase()}`
    : "";
  if (originalExt) {
    const expectedFromExt = EXT_TO_MIME[originalExt];
    if (!expectedFromExt) {
      throw new Error("Unsupported file extension");
    }
    if (expectedFromExt !== magicMime) {
      throw new Error("File extension does not match file contents");
    }
  }

  const ext = MIME_TO_EXT[magicMime];
  if (!ext) {
    throw new Error("Unsupported image type");
  }

  return { mime: magicMime, ext };
}

function uniqueFilename(ext: string): string {
  return `${Date.now()}-${randomBytes(8).toString("hex")}.${ext}`;
}

export type SaveUploadResult = {
  url: string;
  filename: string;
  folder: UploadFolder;
  mime: string;
  size: number;
};

export async function saveStoredUpload(
  folder: string,
  file: File,
): Promise<SaveUploadResult> {
  const safeFolder = assertUploadFolder(folder);
  const buffer = Buffer.from(await file.arrayBuffer());
  const { mime, ext } = validateImageFile(file, buffer);
  const filename = uniqueFilename(ext);

  await connectDB();
  await StoredUpload.create({
    folder: safeFolder,
    filename,
    mimeType: mime,
    size: buffer.length,
    data: buffer,
  });

  return {
    url: storedUploadPublicUrl(safeFolder, filename),
    filename,
    folder: safeFolder,
    mime,
    size: buffer.length,
  };
}

export async function deleteStoredUpload(url: string): Promise<void> {
  const parsed = parseStoredUploadUrl(url);
  if (!parsed) return;

  await connectDB();
  await StoredUpload.deleteOne({
    folder: parsed.folder,
    filename: parsed.filename,
  });
}

/** @deprecated Use saveStoredUpload. */
export async function saveFile(
  folder: string,
  file: File,
): Promise<{ url: string; mime: string; size: number }> {
  const result = await saveStoredUpload(folder, file);
  return { url: result.url, mime: result.mime, size: result.size };
}

/** @deprecated Use deleteStoredUpload. */
export async function deleteFile(relativeUrl: string): Promise<void> {
  if (parseStoredUploadUrl(relativeUrl)) {
    await deleteStoredUpload(relativeUrl);
  }
}
