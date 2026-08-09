import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Page Not Found",
  description: "The page you're looking for could not be found.",
};

export default function NotFound() {
  return (
    <div className="film-grain relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-ikasa-black px-6 text-center text-ikasa-warm-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
      >
        <div className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-ikasa-red/10 blur-[130px]" />
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ikasa-red to-transparent"
        aria-hidden
      />

      <p className="relative font-label text-[0.72rem] tracking-[0.32em] text-ikasa-red">
        Error 404
      </p>
      <h1 className="relative mt-6 font-heading text-[clamp(4rem,14vw,10rem)] font-semibold leading-none tracking-tight">
        404
      </h1>
      <span className="relative mt-4 block h-px w-24 bg-ikasa-red" aria-hidden />
      <h2 className="relative mt-8 font-heading text-2xl tracking-tight sm:text-3xl">
        This Space Hasn&rsquo;t Been Renovated Yet
      </h2>
      <p className="relative mt-4 max-w-md text-sm leading-relaxed text-ikasa-light-grey/80 sm:text-base">
        The page you&rsquo;re looking for doesn&rsquo;t exist or may have
        moved. Let&rsquo;s get you back to something outstanding.
      </p>

      <div className="relative mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="inline-flex h-14 items-center justify-center gap-2 bg-ikasa-red px-8 font-label text-sm uppercase tracking-[0.14em] text-ikasa-white transition-colors hover:bg-ikasa-deep-red"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
        <Link
          href="/contact"
          className="inline-flex h-14 items-center justify-center border border-white/20 px-8 font-label text-sm uppercase tracking-[0.14em] text-ikasa-white transition-colors hover:border-ikasa-red hover:text-ikasa-red"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}
