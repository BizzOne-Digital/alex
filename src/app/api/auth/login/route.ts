import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { createSession, verifyPassword } from "@/lib/auth";
import { loginSchema } from "@/lib/validations/auth";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { AdminUser } from "@/models/AdminUser";

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
    await connectDB();

    const user = await AdminUser.findOne({ email, isActive: true }).select(
      "+passwordHash",
    );

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    user.lastLoginAt = new Date();
    await user.save();

    await createSession(user._id.toString(), user.email);

    return NextResponse.json({
      ok: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
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
