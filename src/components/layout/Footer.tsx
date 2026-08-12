import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type {
  PublicServiceNavItem,
  PublicSiteSettings,
} from "@/lib/defaults";
import { formatPhone } from "@/lib/utils";

const FOOTER_NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
  { href: "/booking", label: "Booking" },
];

type FooterProps = {
  settings: PublicSiteSettings;
  services: PublicServiceNavItem[];
};

function isValidSocialUrl(url: string | undefined | null): url is string {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function Footer({ settings, services }: FooterProps) {
  const year = new Date().getFullYear();
  const phoneHref = settings.phoneTel
    ? `tel:${settings.phoneTel}`
    : settings.primaryPhone
      ? `tel:${settings.primaryPhone.replace(/\D/g, "")}`
      : undefined;

  const socials = [
    { label: "Instagram", href: settings.instagramUrl },
    { label: "Facebook", href: settings.facebookUrl },
    { label: "TikTok", href: settings.tiktokUrl },
    { label: "YouTube", href: settings.youtubeUrl },
  ].filter((s) => isValidSocialUrl(s.href)) as { label: string; href: string }[];

  const logoSrc = settings.footerLogo || "/brand/ikasa-renovations-logo.png";

  return (
    <footer className="section-dark relative mt-auto shrink-0 overflow-x-clip bg-ikasa-black text-ikasa-white">
      <div className="roof-line" aria-hidden />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ikasa-red to-transparent opacity-80"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 top-24 h-64 w-64 rounded-full bg-ikasa-red/10 blur-3xl"
        aria-hidden
      />

      <Container className="relative py-14 pb-8 lg:py-16 lg:pb-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="space-y-6 lg:col-span-5">
            <Link href="/" aria-label={`${settings.companyName} home`}>
              <Image
                src={logoSrc}
                alt={settings.companyName}
                width={180}
                height={80}
                className="h-11 w-auto"
              />
            </Link>
            {settings.shortDescription ? (
              <p className="max-w-sm text-sm leading-relaxed text-ikasa-medium-grey">
                {settings.shortDescription}
              </p>
            ) : null}
            <div className="space-y-2 text-sm">
              {phoneHref && settings.primaryPhone ? (
                <a
                  href={phoneHref}
                  className="block font-label tracking-[0.14em] text-ikasa-warm-white transition-colors hover:text-ikasa-red"
                >
                  {formatPhone(settings.primaryPhone)}
                </a>
              ) : null}
              {settings.email ? (
                <a
                  href={`mailto:${settings.email}`}
                  className="block text-ikasa-medium-grey transition-colors hover:text-ikasa-white"
                >
                  {settings.email}
                </a>
              ) : null}
              {settings.serviceArea ? (
                <p className="pt-2 text-ikasa-medium-grey/80">
                  {settings.serviceArea}
                </p>
              ) : null}
            </div>
            <Button href={settings.footerCtaLink || "/booking"}>
              {settings.footerCtaLabel || "Book a Free Consultation"}
            </Button>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-7">
            <div>
              <p className="font-label text-[0.68rem] tracking-[0.2em] text-ikasa-red">
                Explore
              </p>
              <ul className="mt-4 space-y-2.5">
                {FOOTER_NAV.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-ikasa-light-grey/80 transition-colors hover:text-ikasa-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {socials.length > 0 ? (
                <div className="mt-8">
                  <p className="font-label text-[0.68rem] tracking-[0.2em] text-ikasa-red">
                    Follow
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-3">
                    {socials.map((social) => (
                      <li key={social.label}>
                        <a
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-ikasa-light-grey/80 transition-colors hover:text-ikasa-white"
                        >
                          {social.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <div>
              <p className="font-label text-[0.68rem] tracking-[0.2em] text-ikasa-red">
                Services
              </p>
              <ul className="mt-4 space-y-2.5">
                {services.slice(0, 10).map((service) => (
                  <li key={service.id}>
                    <Link
                      href={`/services/${service.slug}`}
                      className="text-sm text-ikasa-light-grey/80 transition-colors hover:text-ikasa-white"
                    >
                      {service.title}
                    </Link>
                  </li>
                ))}
                {!services.length ? (
                  <li className="text-sm text-ikasa-medium-grey">Coming soon</li>
                ) : null}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-ikasa-medium-grey sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <p>
              {settings.copyright ||
                `© ${year} ${settings.companyName}. All rights reserved.`}
            </p>
            <Link
              href="/privacy"
              className="inline-block transition-colors hover:text-ikasa-white"
            >
              Privacy
            </Link>
          </div>
          {settings.offerDisclaimer ? (
            <p className="max-w-xl leading-relaxed sm:text-right">
              {settings.offerDisclaimer}
            </p>
          ) : null}
        </div>
      </Container>
    </footer>
  );
}
