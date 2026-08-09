import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { bookingSchema } from "@/lib/validations/booking";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { saveFile } from "@/lib/uploads";
import { Booking } from "@/models/Booking";

const FORM_LIMIT = 8;
const FORM_WINDOW_MS = 15 * 60 * 1000;
const MAX_PHOTOS = 6;

function parseOptionalDate(value?: string | null): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Extracts booking fields from multipart form data, saving any attached photos to disk. */
async function readMultipartBody(
  formData: FormData,
): Promise<{ body: Record<string, unknown>; uploadedImages: string[] }> {
  const body: Record<string, unknown> = {};
  const stringFields = [
    "firstName",
    "lastName",
    "email",
    "phone",
    "address",
    "city",
    "province",
    "postalCode",
    "service",
    "serviceName",
    "preferredDate",
    "preferredTime",
    "alternateDate",
    "alternateTime",
    "propertyType",
    "projectDetails",
    "message",
    "website",
  ];

  for (const field of stringFields) {
    const value = formData.get(field);
    if (typeof value === "string") body[field] = value;
  }

  const existingImages = formData.getAll("uploadedImages");
  const preUploaded = existingImages.filter(
    (v): v is string => typeof v === "string" && v.length > 0,
  );

  const files = formData
    .getAll("photos")
    .filter((f): f is File => f instanceof File && f.size > 0)
    .slice(0, MAX_PHOTOS);

  const uploadedImages: string[] = [...preUploaded];
  for (const file of files) {
    const saved = await saveFile("bookings", file);
    uploadedImages.push(saved.url);
  }

  return { body, uploadedImages };
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limited = rateLimit(`form:bookings:${ip}`, FORM_LIMIT, FORM_WINDOW_MS);
    if (!limited.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const contentType = request.headers.get("content-type") || "";
    let body: Record<string, unknown>;
    let uploadedImages: string[] = [];

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const result = await readMultipartBody(formData);
      body = result.body;
      uploadedImages = result.uploadedImages;
    } else {
      body = await request.json();
    }

    const parsed = bookingSchema.safeParse({
      ...body,
      uploadedImages: uploadedImages.length
        ? uploadedImages
        : (body.uploadedImages as string[] | undefined),
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const data = parsed.data;

    // Honeypot: pretend success for bots
    if (data.website && data.website.trim() !== "") {
      return NextResponse.json({ ok: true });
    }

    await connectDB();

    const booking = await Booking.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      province: data.province,
      postalCode: data.postalCode,
      service: data.service || null,
      serviceName: data.serviceName,
      preferredDate: parseOptionalDate(data.preferredDate),
      preferredTime: data.preferredTime,
      alternateDate: parseOptionalDate(data.alternateDate),
      alternateTime: data.alternateTime,
      propertyType: data.propertyType,
      projectDetails: data.projectDetails,
      message: data.message,
      uploadedImages: data.uploadedImages,
      status: "New",
    });

    return NextResponse.json(
      { ok: true, id: booking._id.toString() },
      { status: 201 },
    );
  } catch (error) {
    console.error("Booking create error:", error);
    const message =
      error instanceof Error ? error.message : "Unable to create booking";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
