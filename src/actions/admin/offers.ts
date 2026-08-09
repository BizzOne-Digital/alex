"use server";

import { connectDB } from "@/lib/db";
import { Offer } from "@/models";
import { assertAdmin, actionError, type ActionResult } from "@/lib/admin/guard";
import { serializeDoc } from "@/lib/admin/serialize";
import { revalidateOffers } from "@/lib/revalidate";
import { offerSchema } from "@/lib/validations/admin";

function parseOptionalDate(value?: string | null): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function listOffers() {
  await assertAdmin();
  await connectDB();
  const offers = await Offer.find({}).sort({ order: 1, createdAt: -1 }).lean();
  return serializeDoc(offers);
}

export async function getOffer(id: string) {
  await assertAdmin();
  await connectDB();
  const offer = await Offer.findById(id).lean();
  return offer ? serializeDoc(offer) : null;
}

export async function createOffer(input: unknown): Promise<ActionResult<{ id: string }>> {
  try {
    await assertAdmin();
    const parsed = offerSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
    }

    await connectDB();
    const maxOrder = await Offer.findOne({}).sort({ order: -1 }).select("order").lean();

    const created = await Offer.create({
      ...parsed.data,
      relatedService: parsed.data.relatedService || null,
      startDate: parseOptionalDate(parsed.data.startDate),
      endDate: parseOptionalDate(parsed.data.endDate),
      order: (maxOrder?.order ?? -1) + 1,
    });

    revalidateOffers();
    return { ok: true, data: { id: created._id.toString() } };
  } catch (error) {
    return actionError(error, "Unable to create offer");
  }
}

export async function updateOffer(id: string, input: unknown): Promise<ActionResult> {
  try {
    await assertAdmin();
    const parsed = offerSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
    }

    await connectDB();
    const updated = await Offer.findByIdAndUpdate(
      id,
      {
        $set: {
          ...parsed.data,
          relatedService: parsed.data.relatedService || null,
          startDate: parseOptionalDate(parsed.data.startDate),
          endDate: parseOptionalDate(parsed.data.endDate),
        },
      },
      { new: true },
    );
    if (!updated) return { ok: false, error: "Offer not found" };

    revalidateOffers();
    return { ok: true, data: undefined };
  } catch (error) {
    return actionError(error, "Unable to update offer");
  }
}

export async function deleteOffer(id: string): Promise<ActionResult> {
  try {
    await assertAdmin();
    await connectDB();
    const deleted = await Offer.findByIdAndDelete(id);
    if (!deleted) return { ok: false, error: "Offer not found" };

    revalidateOffers();
    return { ok: true, data: undefined };
  } catch (error) {
    return actionError(error, "Unable to delete offer");
  }
}

export async function toggleOfferActive(id: string, value: boolean): Promise<ActionResult> {
  try {
    await assertAdmin();
    await connectDB();
    const updated = await Offer.findByIdAndUpdate(id, { $set: { active: value } }, { new: true });
    if (!updated) return { ok: false, error: "Offer not found" };

    revalidateOffers();
    return { ok: true, data: undefined };
  } catch (error) {
    return actionError(error, "Unable to update offer");
  }
}

export async function reorderOffer(id: string, direction: "up" | "down"): Promise<ActionResult> {
  try {
    await assertAdmin();
    await connectDB();

    const items = await Offer.find({}).sort({ order: 1, createdAt: -1 });
    const index = items.findIndex((s) => s._id.toString() === id);
    if (index < 0) return { ok: false, error: "Offer not found" };

    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= items.length) {
      return { ok: true, data: undefined };
    }

    const a = items[index];
    const b = items[swapIndex];
    const aOrder = a.order;
    a.order = b.order;
    b.order = aOrder;
    await Promise.all([a.save(), b.save()]);

    revalidateOffers();
    return { ok: true, data: undefined };
  } catch (error) {
    return actionError(error, "Unable to reorder offers");
  }
}
