import { requireAdmin, type SessionPayload } from "@/lib/auth";

export class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
    this.name = "UnauthorizedError";
  }
}

/** Throws if there is no valid admin session. Use inside server actions/route handlers. */
export async function assertAdmin(): Promise<SessionPayload> {
  const session = await requireAdmin();
  if (!session) {
    throw new UnauthorizedError();
  }
  return session;
}

export type ActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export function actionError(error: unknown, fallback = "Something went wrong"): ActionResult<never> {
  if (error instanceof UnauthorizedError) {
    return { ok: false, error: "Unauthorized" };
  }
  const message = error instanceof Error ? error.message : fallback;
  return { ok: false, error: message || fallback };
}
