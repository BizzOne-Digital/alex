"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

export function LoginForm({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Unable to sign in");
        setLoading(false);
        return;
      }
      router.push(redirectTo);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error ? (
        <div className="rounded-md border border-red-900/60 bg-red-950/40 px-3.5 py-2.5 text-sm text-red-300">
          {error}
        </div>
      ) : null}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="font-label text-[0.68rem] tracking-[0.16em] text-neutral-400">
          Email
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@ikasarenovations.ca"
            className="w-full rounded-md border border-neutral-700 bg-neutral-900 py-2.5 pl-10 pr-3 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600/40"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="font-label text-[0.68rem] tracking-[0.16em] text-neutral-400">
          Password
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-md border border-neutral-700 bg-neutral-900 py-2.5 pl-10 pr-3 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600/40"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={cn(
          "mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-red-600 py-3 text-sm font-medium uppercase tracking-wide text-white transition-colors hover:bg-red-700 disabled:opacity-60",
        )}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
