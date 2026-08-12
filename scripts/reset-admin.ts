/**
 * Reset admin login to match ADMIN_EMAIL / ADMIN_PASSWORD in .env.local.
 * Uses sitesettings (key: admin-auth) when adminusers collection is unavailable.
 *
 * Usage: npm run reset-admin
 */
import { config as loadEnv } from "dotenv";
import { resolve } from "path";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { AdminUser } from "../src/models/AdminUser";
import { SiteSettings } from "../src/models/SiteSettings";

loadEnv({ path: resolve(process.cwd(), ".env.local") });
loadEnv({ path: resolve(process.cwd(), ".env") });

async function main() {
  const uri = process.env.MONGODB_URI;
  const email = (process.env.ADMIN_EMAIL || "").toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD || "";

  if (!uri) throw new Error("MONGODB_URI is not set");
  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local");
  }

  await mongoose.connect(uri);
  console.log("Connected to MongoDB:", mongoose.connection.name);

  const passwordHash = await bcrypt.hash(password, 12);

  // Prefer native adminusers collection when it exists
  const adminCol = mongoose.connection.db?.collection("adminusers");
  const hasAdminCol =
    adminCol &&
    (await mongoose.connection.db!.listCollections({ name: "adminusers" }).hasNext());

  if (hasAdminCol && adminCol) {
    const existing = await adminCol.findOne({ email });
    if (existing) {
      await adminCol.updateOne(
        { email },
        {
          $set: {
            passwordHash,
            isActive: true,
            role: "admin",
            updatedAt: new Date(),
          },
        },
      );
    } else {
      const anyAdmin = await adminCol.findOne({});
      if (anyAdmin) {
        await adminCol.updateOne(
          { _id: anyAdmin._id },
          {
            $set: {
              email,
              passwordHash,
              isActive: true,
              role: "admin",
              name: anyAdmin.name || "Ikasa Admin",
              updatedAt: new Date(),
            },
          },
        );
      } else {
        await adminCol.insertOne({
          name: "Ikasa Admin",
          email,
          passwordHash,
          role: "admin",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }
    console.log("Admin updated in adminusers collection");
  } else {
    await SiteSettings.findOneAndUpdate(
      { key: "admin-auth" },
      {
        $set: {
          key: "admin-auth",
          adminEmail: email,
          adminPasswordHash: passwordHash,
          adminName: "Ikasa Admin",
          adminIsActive: true,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    console.log("Admin stored in sitesettings (admin-auth fallback)");
  }

  // Also keep AdminUser model in sync when collection exists
  try {
    const modelUser = await AdminUser.findOne({ email });
    if (modelUser) {
      modelUser.passwordHash = passwordHash;
      modelUser.isActive = true;
      await modelUser.save();
    }
  } catch {
    // ignore when collection missing
  }

  const verify = await bcrypt.compare(
    password,
    (
      await SiteSettings.findOne({ key: "admin-auth" }).select(
        "+adminPasswordHash",
      )
    )?.adminPasswordHash ||
      (
        await AdminUser.findOne({ email }).select("+passwordHash")
      )?.passwordHash ||
      "",
  );

  console.log(verify ? "Password verified OK" : "Password verification FAILED");
  console.log("Sign in with:", email);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Reset admin failed:", err.message || err);
  process.exit(1);
});
