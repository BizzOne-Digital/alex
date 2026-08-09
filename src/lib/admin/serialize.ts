import { Types } from "mongoose";

/** Type-level mirror of what `serializeDoc` does at runtime. */
export type Serialized<T> = T extends Types.ObjectId
  ? string
  : T extends Date
    ? string
    : T extends (infer U)[]
      ? Serialized<U>[]
      : T extends object
        ? { [K in keyof T]: Serialized<T[K]> }
        : T;

/**
 * Deep-converts Mongoose lean() output into plain, client-serializable data:
 * ObjectId -> string, Date -> ISO string. Recurses through arrays/objects.
 */
export function serializeDoc<T>(value: T): Serialized<T> {
  if (value === null || value === undefined) {
    return value as Serialized<T>;
  }

  if (value instanceof Types.ObjectId) {
    return value.toString() as unknown as Serialized<T>;
  }

  if (value instanceof Date) {
    return value.toISOString() as unknown as Serialized<T>;
  }

  if (Array.isArray(value)) {
    return value.map((item) => serializeDoc(item)) as unknown as Serialized<T>;
  }

  if (typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      out[key] = serializeDoc(val);
    }
    return out as unknown as Serialized<T>;
  }

  return value as unknown as Serialized<T>;
}
