import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export const UPLOAD_FOLDERS = [
  "pages",
  "services",
  "gallery",
  "testimonials",
  "products",
  "offers",
  "bookings",
  "settings",
  "inquiries",
] as const;

export type UploadFolder = (typeof UPLOAD_FOLDERS)[number];

const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
  "image/svg+xml": ".svg",
};

const EXT_TO_MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
};

function isUploadFolder(value: string): value is UploadFolder {
  return (UPLOAD_FOLDERS as readonly string[]).includes(value);
}

export function assertUploadFolder(folder: string): UploadFolder {
  if (!isUploadFolder(folder)) {
    throw new Error(
      `Invalid upload folder. Allowed: ${UPLOAD_FOLDERS.join(", ")}`,
    );
  }
  return folder;
}

function getUploadsRoot(): string {
  return path.join(process.cwd(), "public", "uploads");
}

export function getAbsolutePath(relativeUrl: string): string {
  if (!relativeUrl.startsWith("/uploads/")) {
    throw new Error("Invalid upload path");
  }

  const relative = relativeUrl.replace(/^\/+/, "");
  const absolute = path.resolve(process.cwd(), "public", relative);
  const root = path.resolve(getUploadsRoot());

  if (!absolute.startsWith(root + path.sep) && absolute !== root) {
    throw new Error("Path traversal detected");
  }

  return absolute;
}

function sanitizeFilename(name: string): string {
  const base = path.basename(name).replace(/[^a-zA-Z0-9._-]/g, "_");
  return base.slice(0, 120) || "file";
}

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
  // AVIF / HEIF brand in ftyp box
  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 4, 8) === "ftyp"
  ) {
    const brand = buffer.toString("ascii", 8, 12);
    if (brand === "avif" || brand === "avis" || brand === "mif1") {
      return "image/avif";
    }
  }
  // Basic SVG check (text-based)
  const head = buffer.subarray(0, Math.min(buffer.length, 256)).toString("utf8").trimStart();
  if (head.startsWith("<svg") || head.startsWith("<?xml")) {
    if (/<svg[\s>]/i.test(head) || buffer.toString("utf8").includes("<svg")) {
      return "image/svg+xml";
    }
  }
  return null;
}

function validateFile(
  folder: UploadFolder,
  file: File,
  buffer: Buffer,
): { mime: string; ext: string } {
  if (file.size > MAX_FILE_SIZE || buffer.length > MAX_FILE_SIZE) {
    throw new Error("File exceeds maximum size of 8MB");
  }

  const declaredMime = (file.type || "").toLowerCase();
  const originalExt = path.extname(file.name || "").toLowerCase();
  const magicMime = detectImageMime(buffer);

  if (!magicMime) {
    throw new Error("Unrecognized or unsupported image file");
  }

  const allowSvg = folder === "settings";
  if (magicMime === "image/svg+xml" && !allowSvg) {
    throw new Error("SVG uploads are only allowed for settings/brand assets");
  }

  const allowedMimes = allowSvg
    ? Object.keys(MIME_TO_EXT)
    : Object.keys(MIME_TO_EXT).filter((m) => m !== "image/svg+xml");

  if (!allowedMimes.includes(magicMime)) {
    throw new Error("Unsupported image type");
  }

  if (declaredMime && declaredMime !== magicMime) {
    // Allow jpeg/jpg alias mismatch; otherwise reject MIME spoofing
    const declaredNormalized =
      declaredMime === "image/jpg" ? "image/jpeg" : declaredMime;
    if (declaredNormalized !== magicMime) {
      throw new Error("File MIME type does not match file contents");
    }
  }

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

export async function saveFile(
  folder: string,
  file: File,
): Promise<{ url: string; mime: string; size: number }> {
  const safeFolder = assertUploadFolder(folder);
  const buffer = Buffer.from(await file.arrayBuffer());
  const { mime, ext } = validateFile(safeFolder, file, buffer);

  const stem = sanitizeFilename(
    path.parse(file.name || "upload").name,
  ).slice(0, 40);
  const uniqueName = `${stem}-${uuidv4()}${ext}`;

  const dir = path.join(getUploadsRoot(), safeFolder);
  await fs.mkdir(dir, { recursive: true });

  const absolute = path.join(dir, uniqueName);
  const root = path.resolve(getUploadsRoot());
  if (!absolute.startsWith(root + path.sep)) {
    throw new Error("Path traversal detected");
  }

  await fs.writeFile(absolute, buffer);

  return {
    url: `/uploads/${safeFolder}/${uniqueName}`,
    mime,
    size: buffer.length,
  };
}

export async function deleteFile(relativeUrl: string): Promise<void> {
  const absolute = getAbsolutePath(relativeUrl);
  try {
    await fs.unlink(absolute);
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === "ENOENT") {
      return;
    }
    throw error;
  }
}
