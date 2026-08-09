"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import type { PublicServiceSummary } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

/** Higher = more vertical scroll needed for the same horizontal travel. */
const SLOW_FACTOR = 2.6;

type ServicesHorizontalProps = {
  eyebrow?: string;
  heading: string;
  subheading?: string;
  services: PublicServiceSummary[];
};

export function ServicesHorizontal({
  eyebrow = "Our Services",
  heading,
  subheading,
  services,
}: ServicesHorizontalProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByCard = useCallback((direction: 1 | -1) => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const scroller = scrollerRef.current;
    if (!section || !track || !scroller) return;

    const desktop = window.matchMedia("(min-width: 1024px)").matches;
    const card = track.querySelector<HTMLElement>("[data-service-card]");
    const step = (card?.offsetWidth ?? 320) + 20;

    if (!desktop) {
      scroller.scrollBy({ left: direction * step, behavior: "smooth" });
      return;
    }

    const maxX = Math.max(0, track.scrollWidth - window.innerWidth + 64);
    if (maxX <= 0) return;

    const scrollable = section.offsetHeight - window.innerHeight;
    if (scrollable <= 0) return;

    const rect = section.getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, -rect.top / scrollable));
    const delta = (step / maxX) * direction;
    const next = Math.min(1, Math.max(0, progress + delta));
    const targetTop = window.scrollY + rect.top + next * scrollable;

    window.scrollTo({ top: targetTop, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    const track = trackRef.current;
    if (!section || !sticky || !track || services.length === 0) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktopMq = window.matchMedia("(min-width: 1024px)");

    let ctx: gsap.Context | null = null;

    const teardown = () => {
      ctx?.revert();
      ctx = null;
      gsap.set(track, { clearProps: "transform" });
      section.style.height = "";
    };

    const setup = () => {
      teardown();

      if (reduced.matches || !desktopMq.matches) return;

      const travel = () =>
        Math.max(0, track.scrollWidth - window.innerWidth + 72);

      const distance = travel();
      if (distance <= 0) return;

      // Content-height sticky panel + long runway = slow swipe while scrolling down
      section.style.height = `${sticky.offsetHeight + distance * SLOW_FACTOR}px`;

      ctx = gsap.context(() => {
        gsap.to(track, {
          x: () => -travel(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.25,
            invalidateOnRefresh: true,
          },
        });
      }, section);

      ScrollTrigger.refresh();
    };

    setup();

    const onResize = () => setup();
    window.addEventListener("resize", onResize);
    desktopMq.addEventListener("change", onResize);
    reduced.addEventListener("change", onResize);

    const refreshTimer = window.setTimeout(() => {
      setup();
      ScrollTrigger.refresh();
    }, 500);

    return () => {
      window.clearTimeout(refreshTimer);
      window.removeEventListener("resize", onResize);
      desktopMq.removeEventListener("change", onResize);
      reduced.removeEventListener("change", onResize);
      teardown();
    };
  }, [services.length]);

  if (!services.length) return null;

  return (
    <section
      ref={sectionRef}
      className="section-dark relative bg-ikasa-black text-ikasa-white"
    >
      <div
        ref={stickyRef}
        className="relative flex flex-col gap-8 overflow-hidden py-16 sm:py-20 lg:sticky lg:top-0 lg:gap-9 lg:py-20"
      >
        <Container className="shrink-0">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
            <div className="max-w-2xl">
              <p className="font-label text-[0.7rem] tracking-[0.28em] text-ikasa-red">
                {eyebrow}
              </p>
              <h2 className="mt-3 font-heading text-[clamp(1.85rem,3.8vw,3.25rem)] font-semibold leading-[1.05] tracking-tight text-ikasa-white text-balance">
                {heading}
              </h2>
              {subheading ? (
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-ikasa-light-grey sm:text-base lg:line-clamp-2">
                  {subheading}
                </p>
              ) : null}
            </div>

            <div className="flex shrink-0 flex-col items-start gap-3 lg:items-end">
              <p className="font-label text-[0.62rem] tracking-[0.2em] text-ikasa-light-grey/80">
                Scroll down to explore —{" "}
                {String(services.length).padStart(2, "0")} services
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollByCard(-1)}
                  className="inline-flex h-10 w-10 items-center justify-center border border-white/25 text-ikasa-white transition-colors hover:border-ikasa-red hover:text-ikasa-red"
                  aria-label="Previous services"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollByCard(1)}
                  className="inline-flex h-10 w-10 items-center justify-center border border-white/25 text-ikasa-white transition-colors hover:border-ikasa-red hover:text-ikasa-red"
                  aria-label="Next services"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </Container>

        <div
          ref={scrollerRef}
          data-lenis-prevent
          className="horizontal-swipe min-h-0 overflow-x-auto overflow-y-hidden px-5 sm:px-6 lg:overflow-hidden lg:px-8"
        >
          <div
            ref={trackRef}
            className="flex w-max snap-x snap-mandatory items-stretch gap-4 will-change-transform sm:gap-5 lg:snap-none"
          >
            {services.map((service, i) => (
              <Link
                key={service._id}
                data-service-card
                href={`/services/${service.slug}`}
                className="group relative flex h-[22rem] w-[min(82vw,18.5rem)] shrink-0 snap-start flex-col justify-end overflow-hidden border border-white/15 bg-ikasa-charcoal sm:h-[24rem] sm:w-[20rem] lg:h-[26rem] lg:w-[21rem]"
              >
                <ImageWithFallback
                  src={service.listingImage}
                  alt={service.title}
                  fill
                  className="object-cover opacity-75 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:opacity-95"
                  sizes="340px"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ikasa-black via-ikasa-black/55 to-transparent" />
                <div className="relative z-10 flex items-center justify-between px-5 pt-5">
                  <span className="font-label text-[0.68rem] tracking-[0.2em] text-ikasa-red">
                    {service.serviceNumber || String(i + 1).padStart(2, "0")}
                  </span>
                  <ArrowUpRight className="h-5 w-5 text-ikasa-white/80 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-ikasa-red" />
                </div>
                <div className="relative z-10 px-5 pb-6">
                  <h3 className="font-heading text-lg tracking-tight text-ikasa-white sm:text-xl">
                    {service.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ikasa-light-grey">
                    {service.shortDescription}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-2 font-label text-[0.62rem] tracking-[0.18em] text-ikasa-white">
                    View Service
                    <span className="block h-px w-8 bg-ikasa-red transition-all duration-500 group-hover:w-12" />
                  </span>
                </div>
              </Link>
            ))}

            <div
              data-service-card
              className="flex h-[22rem] w-[min(82vw,18.5rem)] shrink-0 snap-start flex-col items-start justify-center gap-5 border border-white/10 bg-ikasa-charcoal/80 px-7 sm:h-[24rem] sm:w-[20rem] lg:h-[26rem] lg:w-[21rem]"
            >
              <p className="max-w-[14rem] font-heading text-xl leading-tight tracking-tight text-ikasa-white sm:text-2xl">
                Ready to explore every service?
              </p>
              <Button
                href="/services"
                variant="outline"
                className="border-white/30 text-ikasa-white hover:border-ikasa-red hover:text-ikasa-red"
              >
                View All Services
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
