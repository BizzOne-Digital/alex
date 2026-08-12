import { NextResponse } from "next/server";
import { createSession, verifyPassword } from "@/lib/auth";
import {
  findAdminCredentials,
  touchAdminLogin,
} from "@/lib/admin/admin-auth";
import { loginSchema } from "@/lib/validations/auth";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

const LOGIN_LIMIT = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limited = rateLimit(`auth:login:${ip}`, LOGIN_LIMIT, LOGIN_WINDOW_MS);
    if (!limited.success) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(
              Math.ceil((limited.resetAt - Date.now()) / 1000),
            ),
          },
        },
      );
    }

    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid credentials", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { email, password } = parsed.data;
    const admin = await findAdminCredentials(email);

    if (!admin?.passwordHash) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    const valid = await verifyPassword(password, admin.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    await touchAdminLogin(admin.id);
    await createSession(admin.id, admin.email);

    return NextResponse.json({
      ok: true,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: "admin",
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Unable to sign in" },
      { status: 500 },
    );
  }
}
