import { connectDB } from "@/lib/db";
import { AdminUser, SiteSettings } from "@/models";

export type AdminProfile = {
  id: string;
  name: string;
  email: string;
};

/** Resolve admin profile from sitesettings fallback or AdminUser. */
export async function getAdminProfile(
  userId: string,
): Promise<AdminProfile | null> {
  await connectDB();

  const auth = await SiteSettings.findOne({
    _id: userId,
    key: "admin-auth",
    adminIsActive: true,
  })
    .select("adminName adminEmail")
    .lean();

  if (auth?.adminEmail) {
    return {
      id: String(auth._id),
      name: auth.adminName || "Ikasa Admin",
      email: auth.adminEmail,
    };
  }

  const user = await AdminUser.findOne({ _id: userId, isActive: true })
    .select("name email")
    .lean();
  if (user) {
    return {
      id: String(user._id),
      name: user.name,
      email: user.email,
    };
  }

  return null;
}

export type AdminCredentialRecord = {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
};

/** Find admin credentials — sitesettings fallback first (Atlas-safe). */
export async function findAdminCredentials(
  email: string,
): Promise<AdminCredentialRecord | null> {
  await connectDB();

  const auth = await SiteSettings.findOne({
    key: "admin-auth",
    adminEmail: email,
    adminIsActive: true,
  }).select("+adminPasswordHash adminName adminEmail");

  if (auth?.adminPasswordHash && auth.adminEmail) {
    return {
      id: auth._id.toString(),
      email: auth.adminEmail,
      name: auth.adminName || "Ikasa Admin",
      passwordHash: auth.adminPasswordHash,
    };
  }

  try {
    const user = await AdminUser.findOne({ email, isActive: true }).select(
      "+passwordHash name email",
    );
    if (user?.passwordHash) {
      return {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        passwordHash: user.passwordHash,
      };
    }
  } catch {
    // adminusers collection may not exist on Atlas free tier
  }

  return null;
}

/** Touch last-login on whichever store holds the admin account. */
export async function touchAdminLogin(userId: string): Promise<void> {
  await connectDB();

  const authUpdated = await SiteSettings.updateOne(
    { _id: userId, key: "admin-auth" },
    { $set: { updatedAt: new Date() } },
  );
  if (authUpdated.matchedCount > 0) return;

  const user = await AdminUser.findById(userId);
  if (user) {
    user.lastLoginAt = new Date();
    await user.save();
  }
}
