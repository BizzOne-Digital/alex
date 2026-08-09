"use server";

import { connectDB } from "@/lib/db";
import { SiteSettings } from "@/models";
import { assertAdmin, actionError, type ActionResult } from "@/lib/admin/guard";
import { serializeDoc } from "@/lib/admin/serialize";
import { revalidateSettings } from "@/lib/revalidate";
import { settingsSchema } from "@/lib/validations/admin";
import { DEFAULT_SITE_SETTINGS } from "@/lib/defaults";

export async function getSiteSettings() {
  await assertAdmin();
  await connectDB();
  let settings = await SiteSettings.findOne({ key: "site" });
  if (!settings) {
    settings = await SiteSettings.create({ ...DEFAULT_SITE_SETTINGS });
  }
  return serializeDoc(settings.toObject());
}

export async function updateSiteSettings(input: unknown): Promise<ActionResult> {
  try {
    await assertAdmin();
    const parsed = settingsSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
    }

    await connectDB();
    await SiteSettings.findOneAndUpdate(
      { key: "site" },
      { $set: parsed.data },
      { new: true, upsert: true },
    );

    revalidateSettings();
    return { ok: true, data: undefined };
  } catch (error) {
    return actionError(error, "Unable to update settings");
  }
}
