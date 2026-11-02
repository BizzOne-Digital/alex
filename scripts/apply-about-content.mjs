/**
 * Writes the About page copy into the database. Images are left untouched
 * (apply-local-photos.mjs owns those). Safe to re-run; it overwrites the text
 * of the sections listed below.
 *
 * Usage: node --env-file=.env.local scripts/apply-about-content.mjs
 */
import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is required (.env.local)");
  process.exit(1);
}

const CONTENT = {
  hero: {
    eyebrow: "About Ikasa",
    heading: "Designed Around Your Life. Built Around Your Home.",
    subheading:
      "Ikasa Renovations designs, supplies and installs kitchens, bathrooms and closets for homeowners who want the work done properly, with one team in charge from the first visit to the final walkthrough.",
    imageAlt: "A finished Ikasa Renovations kitchen with a navy island and quartz countertop",
  },
  introduction: {
    heading: "A renovation team that stays with you from plan to finish",
    content:
      "Ikasa Renovations helps homeowners replace outdated kitchens, bathrooms and closets with spaces that look good and work every day. We handle design, product selection, supply and installation, so you are not chasing separate suppliers and trades.\n\nEvery project starts with a conversation about how you use the space. We measure, plan the layout, confirm materials and pricing in writing, and then build it. You always know what is happening next.",
    imageAlt: "Completed white kitchen with quartz counters",
  },
  philosophy: {
    eyebrow: "The Best Is the Least We Can Do",
    heading: "Good work is in the details you notice later",
    content:
      "Soft-close drawers that line up, tile lines that run straight, a corner cabinet you can actually reach into. We pay attention to the small things because they decide whether a renovation still feels right years after it is finished.",
  },
  one_stop: {
    heading: "One team for design, supply and installation",
    content:
      "Renovations go wrong when nobody owns the whole job. We coordinate every stage, so you deal with one point of contact and one plan.",
    lists: [
      "Free in-home consultation and measurements",
      "Layout and material recommendations",
      "Cabinets, countertops, tile and fixtures supplied",
      "Appliance and hardware guidance",
      "Professional installation",
      "Final walkthrough and touch-ups",
    ],
  },
  expertise: {
    heading: "What we specialise in",
    content: "Three areas where we do most of our work, each with finished projects you can see in our gallery.",
    items: [
      { title: "Kitchens", description: "Cabinetry, quartz counters, backsplash and storage planned together" },
      { title: "Bathrooms", description: "Vanities, tile, glass showers and fixtures built to last" },
      { title: "Closets", description: "Walk-in and reach-in systems made to your measurements" },
    ],
  },
  guidance: {
    heading: "Honest guidance on products and finishes",
    content:
      "Choosing cabinets, counters, sinks and appliances can be overwhelming. We explain the options in plain language, show you what works for your space and budget, and help you avoid choices you will regret. If something is not worth the money, we will tell you.",
    ctaLabel: "Explore Our Services",
    ctaLink: "/services",
  },
  process: {
    heading: "How a project works",
    subheading: "A clear path from first call to finished room.",
    lists: [
      "Book a free consultation and tell us what you need",
      "We visit, measure and discuss ideas and budget",
      "You receive a clear design and written quote",
      "We order materials and schedule the work",
      "Our team installs and keeps you updated",
      "Final walkthrough, touch-ups and handover",
    ],
  },
  timeline: {
    heading: "Realistic timelines, shared up front",
    content:
      "A closet can take days, a bathroom a few weeks and a full kitchen longer. We confirm the schedule before work starts and tell you early if anything changes, so you can plan around the work with confidence.",
  },
  mosaic: {
    heading: "Recent work",
    subheading: "A look at kitchens, bathrooms and closets we have completed.",
  },
  offers_preview: {
    heading: "Current offers",
    content: "Ask about seasonal promotions on kitchens, bathrooms and closets when you book your consultation.",
    ctaLabel: "View Offers",
    ctaLink: "/booking",
  },
  final_cta: {
    heading: "Let's Talk About Your Home",
    content: "Book a free consultation and we will walk through your space, your ideas and your budget.",
    ctaLabel: "Book a Free Consultation",
    ctaLink: "/booking",
    ctaSecondaryLabel: "Contact Us",
    ctaSecondaryLink: "/contact",
  },
};

async function main() {
  await mongoose.connect(uri);
  const col = mongoose.connection.db.collection("pages");
  const page = await col.findOne({ slug: "about" });
  if (!page) throw new Error("about page missing - run npm run seed first");

  for (const [key, patch] of Object.entries(CONTENT)) {
    const section = page.sections.find((s) => s.key === key);
    if (!section) {
      page.sections.push({ key, visible: true, order: page.sections.length, ...patch });
      continue;
    }
    if (patch.items) {
      // keep the images already set on the cards
      patch.items = patch.items.map((it, i) => ({ ...it, image: section.items?.[i]?.image ?? "" }));
    }
    Object.assign(section, patch);
    section.visible = true;
  }

  await col.updateOne(
    { _id: page._id },
    {
      $set: {
        sections: page.sections,
        seoTitle: "About Ikasa Renovations | Kitchens, Bathrooms and Closets",
        seoDescription:
          "Ikasa Renovations designs, supplies and installs custom kitchens, bathrooms and closets. Meet the team and see how we work.",
      },
    },
  );
  console.log("About page content applied");
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
