import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/forms/ContactForm";
import { Reveal } from "@/components/motion/Reveal";
import { FinalCta } from "@/components/sections/FinalCta";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { formatPhone } from "@/lib/utils";
import { findSection, getPageBySlug, getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([
    getPageBySlug("contact"),
    getSettings(),
  ]);
  return {
    title: page?.seoTitle || `Contact | ${settings.companyName}`,
    description: page?.seoDescription || settings.shortDescription,
  };
}

function isValidUrl(url: string | undefined | null): url is string {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export default async function ContactPage() {
  const [page, settings] = await Promise.all([
    getPageBySlug("contact"),
    getSettings(),
  ]);

  const hero = findSection(page, "hero");
  const details = findSection(page, "details");
  const form = findSection(page, "form");
  const hours = findSection(page, "hours");
  const finalCta = findSection(page, "final_cta");

  const socials = [
    { label: "Instagram", href: settings.instagramUrl },
    { label: "Facebook", href: settings.facebookUrl },
    { label: "TikTok", href: settings.tiktokUrl },
    { label: "YouTube", href: settings.youtubeUrl },
  ].filter((s) => isValidUrl(s.href)) as { label: string; href: string }[];

  const phoneHref = settings.phoneTel
    ? `tel:${settings.phoneTel}`
    : settings.primaryPhone
      ? `tel:${settings.primaryPhone.replace(/\D/g, "")}`
      : undefined;

  return (
    <>
      <PageHero
        eyebrow={hero?.eyebrow || "Contact"}
        title={hero?.heading || "Let's Start the Conversation"}
        subheading={hero?.subheading}
        image={hero?.primaryImage || hero?.backgroundImage}
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />

      <section className="bg-ikasa-warm-white py-20 lg:py-28">
        <Container>
          <div className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            <div>
              <p className="font-label text-[0.68rem] tracking-[0.22em] text-ikasa-red">
                {details?.heading || "Direct Contact"}
              </p>
              <div className="mt-8 space-y-6">
                {settings.primaryPhone ? (
                  <Reveal>
                    <a
                      href={phoneHref}
                      className="group flex items-start gap-4 text-ikasa-black"
                    >
                      <Phone className="mt-1 h-5 w-5 text-ikasa-red" />
                      <span>
                        <span className="block font-label text-[0.62rem] tracking-[0.16em] text-ikasa-medium-grey">
                          Phone
                        </span>
                        <span className="mt-1 block font-heading text-lg group-hover:text-ikasa-red">
                          {formatPhone(settings.primaryPhone)}
                        </span>
                      </span>
                    </a>
                  </Reveal>
                ) : null}
                {settings.email ? (
                  <Reveal delay={0.06}>
                    <a
                      href={`mailto:${settings.email}`}
                      className="group flex items-start gap-4 text-ikasa-black"
                    >
                      <Mail className="mt-1 h-5 w-5 text-ikasa-red" />
                      <span>
                        <span className="block font-label text-[0.62rem] tracking-[0.16em] text-ikasa-medium-grey">
                          Email
                        </span>
                        <span className="mt-1 block font-heading text-lg group-hover:text-ikasa-red">
                          {settings.email}
                        </span>
                      </span>
                    </a>
                  </Reveal>
                ) : null}
                {settings.serviceArea ? (
                  <Reveal delay={0.12}>
                    <div className="flex items-start gap-4 text-ikasa-black">
                      <MapPin className="mt-1 h-5 w-5 text-ikasa-red" />
                      <span>
                        <span className="block font-label text-[0.62rem] tracking-[0.16em] text-ikasa-medium-grey">
                          Service Area
                        </span>
                        <span className="mt-1 block max-w-xs text-sm leading-relaxed text-ikasa-medium-grey">
                          {settings.serviceArea}
                        </span>
                      </span>
                    </div>
                  </Reveal>
                ) : null}
                {settings.businessHours ? (
                  <Reveal delay={0.18}>
                    <div className="flex items-start gap-4 text-ikasa-black">
                      <Clock className="mt-1 h-5 w-5 text-ikasa-red" />
                      <span>
                        <span className="block font-label text-[0.62rem] tracking-[0.16em] text-ikasa-medium-grey">
                          {hours?.heading || "Hours & Availability"}
                        </span>
                        <span className="mt-1 block max-w-xs text-sm leading-relaxed text-ikasa-medium-grey">
                          {hours?.content || settings.businessHours}
                        </span>
                      </span>
                    </div>
                  </Reveal>
                ) : null}
              </div>

              {socials.length ? (
                <div className="mt-10 border-t border-ikasa-light-grey pt-8">
                  <p className="font-label text-[0.62rem] tracking-[0.16em] text-ikasa-medium-grey">
                    Follow
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-4">
                    {socials.map((social) => (
                      <li key={social.label}>
                        <a
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-ikasa-charcoal hover:text-ikasa-red"
                        >
                          {social.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <div className="border border-ikasa-light-grey bg-white p-6 sm:p-10">
              <p className="font-label text-[0.65rem] tracking-[0.18em] text-ikasa-red">
                {form?.heading || "Send a Message"}
              </p>
              {form?.content ? (
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-ikasa-medium-grey">
                  {form.content}
                </p>
              ) : null}
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <FinalCta
        heading={finalCta?.heading || "Prefer a Structured Booking?"}
        ctaLabel={finalCta?.ctaLabel || "Book a Free Consultation"}
        ctaLink={finalCta?.ctaLink || "/booking"}
        backgroundImage={finalCta?.backgroundImage}
      />
    </>
  );
}
