import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

export const SESSION_COOKIE = "ikasa_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export type SessionPayload = {
  userId: string;
  email: string;
};

function getSecretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error(
      "Please define the AUTH_SECRET environment variable inside .env.local",
    );
  }
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}

export async function createSession(
  userId: string,
  email: string,
): Promise<void> {
  const token = await new SignJWT({ userId, email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecretKey());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    const userId = payload.userId;
    const email = payload.email;
    if (typeof userId !== "string" || typeof email !== "string") {
      return null;
    }
    return { userId, email };
  } catch {
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

/**
 * Returns the current admin session, or null if unauthenticated.
 * Callers that prefer exceptions can throw when the result is null.
 */
export async function requireAdmin(): Promise<SessionPayload | null> {
  return getSession();
}

/** Edge-safe JWT verification for middleware (no next/headers cookies()). */
export async function verifySessionToken(
  token: string,
): Promise<SessionPayload | null> {
  try {
    const secret = process.env.AUTH_SECRET;
    if (!secret) return null;
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret),
    );
    const userId = payload.userId;
    const email = payload.email;
    if (typeof userId !== "string" || typeof email !== "string") {
      return null;
    }
    return { userId, email };
  } catch {
    return null;
  }
}
