/** Client-safe upload URL helpers (no MongoDB / Node imports). */

export const UPLOAD_FOLDERS = [
  "products",
  "gallery",
  "pages",
  "misc",
] as const;

export type UploadFolder = (typeof UPLOAD_FOLDERS)[number];

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

export function isStoredUploadUrl(url: string): boolean {
  return url.startsWith("/api/uploads/");
}

export function isLegacyDiskUploadUrl(url: string): boolean {
  return url.startsWith("/uploads/");
}

export function parseStoredUploadUrl(
  url: string,
): { folder: string; filename: string } | null {
  const match = url.match(/^\/api\/uploads\/([^/]+)\/([^/]+)$/);
  if (!match) return null;

  const folder = match[1];
  const filename = match[2];

  if (
    !folder ||
    !filename ||
    filename.includes("..") ||
    filename.includes("/") ||
    folder.includes("..") ||
    folder.includes("/")
  ) {
    return null;
  }

  if (!(UPLOAD_FOLDERS as readonly string[]).includes(folder)) {
    return null;
  }

  return { folder, filename };
}

export function assertUploadFolder(folder: string): UploadFolder {
  if (!(UPLOAD_FOLDERS as readonly string[]).includes(folder)) {
    throw new Error(
      `Invalid upload folder. Allowed: ${UPLOAD_FOLDERS.join(", ")}`,
    );
  }
  return folder as UploadFolder;
}

export function storedUploadPublicUrl(folder: string, filename: string): string {
  return `/api/uploads/${folder}/${filename}`;
}

/** Legacy disk paths become undefined so UI shows placeholder. */
export function normalizeImageSrc(src?: string | null): string | undefined {
  if (!src?.trim()) return undefined;
  if (isLegacyDiskUploadUrl(src)) return undefined;
  return src;
}
