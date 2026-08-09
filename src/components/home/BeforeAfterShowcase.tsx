"use client";

import { useState } from "react";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

export type BeforeAfterTab = {
  key: string;
  label: string;
  before: string;
  after: string;
};

type BeforeAfterShowcaseProps = {
  eyebrow?: string;
  heading: string;
  subheading?: string;
  tabs: BeforeAfterTab[];
};

export function BeforeAfterShowcase({
  eyebrow = "Transformations",
  heading,
  subheading,
  tabs,
}: BeforeAfterShowcaseProps) {
  const [active, setActive] = useState(0);
  const current = tabs[active];
  if (!current) return null;

  return (
    <section className="section-dark relative bg-ikasa-black py-24 text-ikasa-white lg:py-32">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow={eyebrow}
            title={heading}
            description={subheading}
            tone="light"
          />
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab, i) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActive(i)}
                className={cn(
                  "border px-5 py-2.5 font-label text-[0.68rem] tracking-[0.18em] transition-colors",
                  i === active
                    ? "border-ikasa-red bg-ikasa-red text-ikasa-white"
                    : "border-white/15 text-ikasa-medium-grey hover:border-white/40 hover:text-ikasa-white",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <BeforeAfterSlider
            key={current.key}
            beforeSrc={current.before}
            afterSrc={current.after}
            beforeAlt={`${current.label} — before, illustrative reference`}
            afterAlt={`${current.label} — after, illustrative reference`}
            className="border border-white/10"
          />
          <p className="mt-4 max-w-2xl font-label text-[0.62rem] tracking-[0.14em] text-ikasa-medium-grey">
            Illustrative design reference — drag the divider to compare. Not a
            claimed completed Ikasa Renovations project.
          </p>
        </div>
      </Container>
    </section>
  );
}
