"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type {
  PublicServiceNavItem,
  PublicSiteSettings,
} from "@/lib/defaults";
import { cn, formatPhone } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services", hasDropdown: true },
  { href: "/gallery", label: "Gallery" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
] as const;

type HeaderProps = {
  settings: PublicSiteSettings;
  services: PublicServiceNavItem[];
};

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header({ settings, services }: HeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const menuId = useId();
  const menuRef = useRef<HTMLDivElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const phoneHref = settings.phoneTel
    ? `tel:${settings.phoneTel}`
    : settings.primaryPhone
      ? `tel:${settings.primaryPhone.replace(/\D/g, "")}`
      : undefined;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenus = useCallback(() => {
    setMobileOpen(false);
    setServicesOpen(false);
    setMobileServicesOpen(false);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const focusableSelector =
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

  const trapFocus = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (!mobileOpen || !menuRef.current) return;
      if (e.key === "Escape") {
        setMobileOpen(false);
        openButtonRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      const focusable = Array.from(
        menuRef.current.querySelectorAll<HTMLElement>(focusableSelector),
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [mobileOpen],
  );

  useEffect(() => {
    if (!mobileOpen || !menuRef.current) return;
    const first = menuRef.current.querySelector<HTMLElement>(focusableSelector);
    first?.focus();
  }, [mobileOpen]);

  useEffect(() => {
    if (!servicesOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [servicesOpen]);

  const logoSrc = settings.headerLogo || "/brand/ikasa-renovations-logo.png";

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-500",
          scrolled || mobileOpen
            ? "border-b border-white/5 bg-ikasa-black/85 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <Container className="flex h-[var(--header-height)] items-center justify-between gap-4">
          <Link
            href="/"
            onClick={closeMenus}
            className="relative z-10 flex shrink-0 items-center"
            aria-label={`${settings.companyName} home`}
          >
            <Image
              src={logoSrc}
              alt={settings.companyName}
              width={90}
              height={56}
              className="h-12 w-auto sm:h-14"
              priority
            />
          </Link>

          <nav
            className="hidden items-center gap-1 xl:flex"
            aria-label="Primary"
          >
            {NAV_LINKS.map((link) => {
              const active = isActivePath(pathname, link.href);
              if ("hasDropdown" in link && link.hasDropdown) {
                return (
                  <div
                    key={link.href}
                    className="relative"
                    ref={dropdownRef}
                    onMouseEnter={() => setServicesOpen(true)}
                    onMouseLeave={() => setServicesOpen(false)}
                  >
                    <button
                      type="button"
                      className={cn(
                        "group relative flex items-center gap-1 px-3 py-2 font-label text-[0.68rem] tracking-[0.18em] text-ikasa-warm-white/85 transition-colors hover:text-ikasa-white",
                        active && "text-ikasa-white",
                      )}
                      aria-expanded={servicesOpen}
                      aria-haspopup="true"
                      onClick={() => setServicesOpen((v) => !v)}
                    >
                      {link.label}
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 transition-transform",
                          servicesOpen && "rotate-180",
                        )}
                      />
                      <span
                        className={cn(
                          "absolute inset-x-3 -bottom-0.5 h-px origin-left scale-x-0 bg-ikasa-red transition-transform duration-300",
                          (active || servicesOpen) && "scale-x-100",
                        )}
                      />
                    </button>
                    <div
                      className={cn(
                        "absolute left-1/2 top-full z-50 w-[22rem] -translate-x-1/2 pt-3 transition-all duration-300",
                        servicesOpen
                          ? "pointer-events-auto translate-y-0 opacity-100"
                          : "pointer-events-none translate-y-2 opacity-0",
                      )}
                    >
                      <div className="border border-white/10 bg-ikasa-black/95 p-3 shadow-2xl backdrop-blur-xl">
                        <Link
                          href="/services"
                          onClick={closeMenus}
                          className="mb-2 block border-b border-white/10 px-3 pb-3 pt-1 font-label text-[0.65rem] tracking-[0.18em] text-ikasa-red"
                        >
                          All services
                        </Link>
                        <ul
                          data-lenis-prevent
                          onWheel={(e) => e.stopPropagation()}
                          className="max-h-[min(22rem,60vh)] space-y-0.5 overflow-y-auto overscroll-contain [scrollbar-gutter:stable]"
                        >
                          {services.map((service) => (
                            <li key={service.id}>
                              <Link
                                href={`/services/${service.slug}`}
                                onClick={closeMenus}
                                className="group flex items-start gap-3 px-3 py-2.5 transition-colors hover:bg-white/5"
                              >
                                {service.serviceNumber ? (
                                  <span className="mt-0.5 font-label text-[0.6rem] tracking-[0.16em] text-ikasa-medium-grey">
                                    {service.serviceNumber}
                                  </span>
                                ) : null}
                                <span>
                                  <span className="block font-heading text-sm text-ikasa-warm-white group-hover:text-ikasa-white">
                                    {service.title}
                                  </span>
                                  {service.shortDescription ? (
                                    <span className="mt-0.5 line-clamp-1 block text-xs text-ikasa-medium-grey">
                                      {service.shortDescription}
                                    </span>
                                  ) : null}
                                </span>
                              </Link>
                            </li>
                          ))}
                          {!services.length ? (
                            <li className="px-3 py-2 text-sm text-ikasa-medium-grey">
                              Services coming soon
                            </li>
                          ) : null}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenus}
                  className={cn(
                    "relative px-3 py-2 font-label text-[0.68rem] tracking-[0.18em] text-ikasa-warm-white/85 transition-colors hover:text-ikasa-white",
                    active && "text-ikasa-white",
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute inset-x-3 -bottom-0.5 h-px origin-left scale-x-0 bg-ikasa-red transition-transform duration-300",
                      active && "scale-x-100",
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="relative z-10 flex items-center gap-2 sm:gap-3">
            {phoneHref && settings.primaryPhone ? (
              <a
                href={phoneHref}
                className="hidden font-label text-[0.68rem] tracking-[0.16em] text-ikasa-warm-white/90 transition-colors hover:text-ikasa-red lg:inline"
              >
                {formatPhone(settings.primaryPhone)}
              </a>
            ) : null}

            <Button
              href={settings.headerCtaLink || "/booking"}
              size="sm"
              className="hidden md:inline-flex"
            >
              {settings.headerCtaLabel || "Book"}
            </Button>

            <button
              ref={openButtonRef}
              type="button"
              className="flex h-10 w-10 items-center justify-center text-ikasa-warm-white xl:hidden"
              aria-expanded={mobileOpen}
              aria-controls={menuId}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </Container>
      </header>

      {/* Mobile full-screen menu */}
      <div
        id={menuId}
        ref={menuRef}
        className={cn(
          "fixed inset-0 z-40 bg-ikasa-black transition-opacity duration-300 xl:hidden",
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
        aria-hidden={!mobileOpen}
        onKeyDown={trapFocus}
      >
        <Container className="flex h-full flex-col pb-10 pt-[calc(var(--header-height)+1.5rem)]">
          <nav aria-label="Mobile" className="flex-1 overflow-y-auto">
            <ul className="space-y-1">
              {NAV_LINKS.map((link, index) => {
                const active = isActivePath(pathname, link.href);
                const number = String(index + 1).padStart(2, "0");

                if ("hasDropdown" in link && link.hasDropdown) {
                  return (
                    <li key={link.href}>
                      <button
                        type="button"
                        className="flex w-full items-center justify-between border-b border-white/10 py-4 text-left"
                        aria-expanded={mobileServicesOpen}
                        onClick={() => setMobileServicesOpen((v) => !v)}
                      >
                        <span className="flex items-baseline gap-4">
                          <span className="font-label text-[0.7rem] tracking-[0.2em] text-ikasa-red">
                            {number}
                          </span>
                          <span
                            className={cn(
                              "font-heading text-2xl tracking-tight text-ikasa-warm-white",
                              active && "text-ikasa-white",
                            )}
                          >
                            {link.label}
                          </span>
                        </span>
                        <ChevronDown
                          className={cn(
                            "h-5 w-5 text-ikasa-medium-grey transition-transform",
                            mobileServicesOpen && "rotate-180",
                          )}
                        />
                      </button>
                      <div
                        className={cn(
                          "overflow-hidden transition-[max-height,opacity] duration-300",
                          mobileServicesOpen
                            ? "max-h-[40rem] opacity-100"
                            : "max-h-0 opacity-0",
                        )}
                      >
                        <ul className="space-y-1 pb-4 pl-10">
                          <li>
                            <Link
                              href="/services"
                              onClick={closeMenus}
                              className="block py-2 font-label text-[0.7rem] tracking-[0.16em] text-ikasa-red"
                            >
                              View all services
                            </Link>
                          </li>
                          {services.map((service) => (
                            <li key={service.id}>
                              <Link
                                href={`/services/${service.slug}`}
                                onClick={closeMenus}
                                className="block py-2 text-ikasa-light-grey transition-colors hover:text-ikasa-white"
                              >
                                {service.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  );
                }

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={closeMenus}
                      className="flex items-baseline gap-4 border-b border-white/10 py-4"
                    >
                      <span className="font-label text-[0.7rem] tracking-[0.2em] text-ikasa-red">
                        {number}
                      </span>
                      <span
                        className={cn(
                          "font-heading text-2xl tracking-tight text-ikasa-warm-white",
                          active && "text-ikasa-white",
                        )}
                      >
                        {link.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mt-8 space-y-4 border-t border-white/10 pt-6">
            <Button href={settings.headerCtaLink || "/booking"} className="w-full">
              {settings.headerCtaLabel || "Book a Free Consultation"}
            </Button>
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-ikasa-medium-grey">
              {phoneHref && settings.primaryPhone ? (
                <a
                  href={phoneHref}
                  className="font-label tracking-[0.14em] text-ikasa-warm-white hover:text-ikasa-red"
                >
                  {formatPhone(settings.primaryPhone)}
                </a>
              ) : null}
              {settings.email ? (
                <a
                  href={`mailto:${settings.email}`}
                  className="hover:text-ikasa-white"
                >
                  {settings.email}
                </a>
              ) : null}
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
