import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { AdminUser } from "@/models";
import { Sidebar } from "@/components/admin/Sidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  await connectDB();
  const user = await AdminUser.findOne({ _id: session.userId, isActive: true })
    .select("name email")
    .lean();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-neutral-950 text-neutral-100">
      <Sidebar userName={user.name} userEmail={user.email} />
      <div className="flex min-h-screen flex-1 flex-col">
        <AdminHeader />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
