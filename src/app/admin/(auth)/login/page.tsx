import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Admin Login | Ikasa Renovations",
  robots: { index: false, follow: false },
};

type LoginPageProps = {
  searchParams: Promise<{ from?: string }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const redirectTo = params.from && params.from.startsWith("/admin") ? params.from : "/admin";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-red-600/20 blur-[120px]"
      />

      <div className="relative z-10 w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-600 font-heading text-lg font-bold text-white shadow-lg shadow-red-600/30">
            IK
          </span>
          <div>
            <p className="font-label text-[0.7rem] tracking-[0.22em] text-red-500">
              Ikasa Renovations
            </p>
            <h1 className="font-heading text-2xl text-white">Admin Portal</h1>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900/70 p-6 shadow-2xl backdrop-blur-sm">
          <LoginForm redirectTo={redirectTo} />
        </div>

        <p className="mt-6 text-center text-xs text-neutral-500">
          Authorized personnel only. All access is logged.
        </p>
      </div>
    </div>
  );
}
