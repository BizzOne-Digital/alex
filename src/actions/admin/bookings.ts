"use server";

import { connectDB } from "@/lib/db";
import { Booking } from "@/models";
import { assertAdmin, actionError, type ActionResult } from "@/lib/admin/guard";
import { serializeDoc } from "@/lib/admin/serialize";
import { revalidateBookingsAdmin } from "@/lib/revalidate";
import { bookingUpdateSchema } from "@/lib/validations/admin";

function parseOptionalDate(value?: string | null): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function listBookings() {
  await assertAdmin();
  await connectDB();
  const bookings = await Booking.find({})
    .sort({ createdAt: -1 })
    .populate("service", "title slug")
    .lean();
  return serializeDoc(bookings);
}

export async function getBooking(id: string) {
  await assertAdmin();
  await connectDB();
  const booking = await Booking.findById(id).populate("service", "title slug").lean();
  return booking ? serializeDoc(booking) : null;
}

export async function updateBooking(id: string, input: unknown): Promise<ActionResult> {
  try {
    await assertAdmin();
    const parsed = bookingUpdateSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
    }

    await connectDB();
    const update: Record<string, unknown> = {};
    if (parsed.data.status !== undefined) update.status = parsed.data.status;
    if (parsed.data.internalNotes !== undefined) update.internalNotes = parsed.data.internalNotes;
    if (parsed.data.confirmedDate !== undefined) {
      update.confirmedDate = parseOptionalDate(parsed.data.confirmedDate);
    }
    if (parsed.data.confirmedTime !== undefined) update.confirmedTime = parsed.data.confirmedTime;

    const updated = await Booking.findByIdAndUpdate(id, { $set: update }, { new: true });
    if (!updated) return { ok: false, error: "Booking not found" };

    revalidateBookingsAdmin(id);
    return { ok: true, data: undefined };
  } catch (error) {
    return actionError(error, "Unable to update booking");
  }
}

export async function deleteBooking(id: string): Promise<ActionResult> {
  try {
    await assertAdmin();
    await connectDB();
    const deleted = await Booking.findByIdAndDelete(id);
    if (!deleted) return { ok: false, error: "Booking not found" };

    revalidateBookingsAdmin();
    return { ok: true, data: undefined };
  } catch (error) {
    return actionError(error, "Unable to delete booking");
  }
}
