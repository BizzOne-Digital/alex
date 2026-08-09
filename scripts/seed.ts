/**
 * Bootstraps the database with the initial admin user (from env vars) and a
 * placeholder Page document for every page defined in the admin CMS config,
 * so the /admin/pages editor always has something to load.
 *
 * Usage: npm run seed
 */
import { config as loadEnv } from "dotenv";
import { resolve } from "path";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { AdminUser } from "../src/models/AdminUser";
import { Page } from "../src/models/Page";
import { PAGE_DEFINITIONS } from "../src/lib/admin/page-sections";

loadEnv({ path: resolve(process.cwd(), ".env.local") });
loadEnv({ path: resolve(process.cwd(), ".env") });

async function main() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not set in .env.local");
  }

  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  const email = (process.env.ADMIN_EMAIL || "").toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD || "";

  if (email && password) {
    const existing = await AdminUser.findOne({ email });
    if (existing) {
      console.log(`Admin user already exists: ${email}`);
    } else {
      const passwordHash = await bcrypt.hash(password, 12);
      await AdminUser.create({
        name: "Ikasa Admin",
        email,
        passwordHash,
        role: "admin",
        isActive: true,
      });
      console.log(`Created admin user: ${email}`);
    }
  } else {
    console.warn(
      "ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin user creation.",
    );
  }

  for (const def of PAGE_DEFINITIONS) {
    const existing = await Page.findOne({ slug: def.slug });
    if (existing) {
      const existingKeys = new Set(existing.sections.map((s) => s.key));
      let changed = false;
      def.sections.forEach((s, index) => {
        if (!existingKeys.has(s.key)) {
          existing.sections.push({
            key: s.key,
            visible: true,
            order: index,
          } as never);
          changed = true;
        }
      });
      if (changed) {
        await existing.save();
        console.log(`Updated page sections: ${def.slug}`);
      } else {
        console.log(`Page already exists: ${def.slug}`);
      }
      continue;
    }
    await Page.create({
      slug: def.slug,
      title: def.title,
      published: true,
      sections: def.sections.map((s, index) => ({
        key: s.key,
        visible: true,
        order: index,
      })),
    });
    console.log(`Created page: ${def.slug}`);
  }

  console.log("Seed complete.");
  await mongoose.disconnect();
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
