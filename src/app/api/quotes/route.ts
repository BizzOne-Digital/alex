import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { quoteSchema } from "@/lib/validations/quote";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { ProductQuoteRequest } from "@/models/ProductQuoteRequest";

const FORM_LIMIT = 8;
const FORM_WINDOW_MS = 15 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limited = rateLimit(`form:quotes:${ip}`, FORM_LIMIT, FORM_WINDOW_MS);
    if (!limited.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const body = await request.json();
    const parsed = quoteSchema.safeParse(body);
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

    const quote = await ProductQuoteRequest.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      product: data.product,
      productTitle: data.productTitle,
      quantity: data.quantity,
      message: data.message,
      status: "New",
    });

    return NextResponse.json(
      { ok: true, id: quote._id.toString() },
      { status: 201 },
    );
  } catch (error) {
    console.error("Quote create error:", error);
    return NextResponse.json(
      { error: "Unable to submit quote request" },
      { status: 500 },
    );
  }
}
