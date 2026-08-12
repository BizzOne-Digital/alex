import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAdminProfile } from "@/lib/admin/admin-auth";
import { Sidebar } from "@/components/admin/Sidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const user = await getAdminProfile(session.userId);

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
