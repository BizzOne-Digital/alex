import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { contactSchema } from "@/lib/validations/contact";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { ContactInquiry } from "@/models/ContactInquiry";

const FORM_LIMIT = 8;
const FORM_WINDOW_MS = 15 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limited = rateLimit(`form:contact:${ip}`, FORM_LIMIT, FORM_WINDOW_MS);
    if (!limited.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const body = await request.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const data = parsed.data;

    if (data.website && data.website.trim() !== "") {
      return NextResponse.json({ ok: true });
    }

    await connectDB();

    const inquiry = await ContactInquiry.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
      status: "New",
    });

    return NextResponse.json(
      { ok: true, id: inquiry._id.toString() },
      { status: 201 },
    );
  } catch (error) {
    console.error("Contact create error:", error);
    return NextResponse.json(
      { error: "Unable to submit inquiry" },
      { status: 500 },
    );
  }
}
