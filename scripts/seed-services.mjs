/**
 * Creates the gallery categories and the default services if they do not exist.
 * Existing records are never overwritten, so admin edits are safe.
 * Run apply-local-photos.mjs afterwards to attach the project photos.
 *
 * Usage: node --env-file=.env.local scripts/seed-services.mjs
 */
import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is required (.env.local)");
  process.exit(1);
}

const CATEGORIES = [
  { name: "Kitchens", slug: "kitchens", description: "Custom kitchen renovations, cabinetry and islands." },
  { name: "Bathrooms", slug: "bathrooms", description: "Vanities, showers and complete bathroom makeovers." },
  { name: "Closets & Wardrobes", slug: "closets-and-wardrobes", description: "Walk-in and reach-in closets built around how you live." },
  { name: "Flooring & Tile", slug: "flooring-and-tile", description: "Tile, flooring and surface details." },
  { name: "Fixtures & Finishes", slug: "fixtures-and-finishes", description: "Sinks, faucets, hardware and smart cabinet accessories." },
];

const STEPS = [
  ["Consultation", "We visit, measure and listen to what you need from the space."],
  ["Design and Selection", "Layouts, materials and finishes are chosen with you and confirmed in writing."],
  ["Supply and Installation", "We order, coordinate trades and install everything to the agreed plan."],
  ["Final Walkthrough", "We review the finished work with you and fix any last details."],
];

const SERVICES = [
  {
    title: "Kitchen Renovation",
    slug: "kitchen-renovation",
    short: "Custom cabinetry, countertops and layouts designed around how you cook and live.",
    long: "From a simple cabinet refresh to a full kitchen rebuild, we design, supply and install kitchens that look great and work hard every day. Cabinets, quartz counters, backsplash, sinks and storage are planned together so nothing is left to chance.",
    project: "Full kitchen or cabinet and counter upgrade",
    inclusions: ["Layout and cabinet design", "Quartz or stone countertops", "Backsplash and lighting", "Sink, faucet and hardware", "Installation and cleanup"],
    problems: ["Outdated or damaged cabinets", "Not enough counter or storage space", "Poor layout and workflow"],
    options: ["Shaker cabinetry", "Flat-panel modern", "Island with waterfall edge", "Two-tone finishes"],
    materials: ["Quartz countertops", "Hexagon and marble-look backsplash", "Soft-close hardware", "Under-cabinet lighting"],
    timeline: "Typically 3 to 8 weeks depending on scope",
  },
  {
    title: "Bathroom Renovation",
    slug: "bathroom-renovation",
    short: "Vanities, showers and tile that turn a tired bathroom into a calm, practical space.",
    long: "We handle the full bathroom: demolition, tile, glass, vanity, fixtures and finishing. Smart storage, quality waterproofing and clean detailing keep the result looking good for years.",
    project: "Full bathroom or vanity and shower upgrade",
    inclusions: ["Vanity and countertop", "Tile and shower work", "Glass shower doors", "Fixtures and lighting", "Installation and cleanup"],
    problems: ["Dated tile and fixtures", "Leaks or poor ventilation", "Limited storage"],
    options: ["Floating vanity", "Walk-in glass shower", "Soaker tub surround", "Feature accent wall"],
    materials: ["Large-format porcelain tile", "Pebble shower floor", "Matte black fixtures", "Quartz vanity tops"],
    timeline: "Typically 2 to 5 weeks depending on scope",
  },
  {
    title: "Closet and Wardrobe Design",
    slug: "closet-and-wardrobe-design",
    short: "Walk-in and reach-in closets with shelving, drawers and hanging space made to fit.",
    long: "Custom closet systems built to your measurements and your wardrobe. We plan hanging heights, shelves and drawers so every item has a place and the space feels open and organised.",
    project: "Walk-in or reach-in closet",
    inclusions: ["Measured design", "Shelving, drawers and hanging rods", "Custom fit to the room", "Installation"],
    problems: ["Cluttered, overflowing closets", "Wasted vertical space", "Hard-to-reach storage"],
    options: ["Walk-in layout", "Reach-in wardrobe", "Drawer and shoe towers", "Built-in lighting"],
    materials: ["White melamine", "Soft-close drawers", "Brushed metal rods", "Integrated lighting"],
    timeline: "Typically 1 to 3 weeks",
  },
  {
    title: "Flooring and Tile",
    slug: "flooring-and-tile",
    short: "Tile and flooring installed cleanly, from kitchen floors to feature showers.",
    long: "We supply and install floor tile, wall tile and flooring with careful prep and layout so lines are straight and finishes last. Marble-look, patterned and pebble options are available.",
    project: "Kitchen, bathroom or whole-floor tile and flooring",
    inclusions: ["Surface preparation", "Layout planning", "Tile or flooring supply", "Grout and finishing"],
    problems: ["Cracked or worn flooring", "Uneven or outdated tile", "Water-prone areas"],
    options: ["Marble-look porcelain", "Patterned cement-style tile", "Pebble shower floors", "Wood-look flooring"],
    materials: ["Porcelain tile", "Vinyl plank", "Natural stone", "Waterproofing membranes"],
    timeline: "Typically 3 days to 2 weeks",
  },
  {
    title: "Appliance Installation",
    slug: "appliance-installation",
    short: "Built-in microwaves, ovens, ranges and hoods fitted properly into your kitchen.",
    long: "We help you choose and install appliances so they sit flush, vent correctly and are connected safely. Built-in microwaves, wall ovens, ranges and range hoods are all part of the plan.",
    project: "Appliance supply and installation",
    inclusions: ["Appliance guidance", "Cabinet modifications", "Installation and connection", "Testing"],
    problems: ["Appliances that do not fit the cabinetry", "Poor ventilation", "Mismatched finishes"],
    options: ["Built-in microwave", "Double wall oven", "Range with hood", "Integrated dishwasher"],
    materials: ["Stainless steel", "Custom hood covers", "Trim kits"],
    timeline: "Typically 1 to 3 days after cabinets are ready",
  },
  {
    title: "Storage and Organization",
    slug: "storage-and-organization",
    short: "Corner carousels, pull-outs and drawer systems that make every inch usable.",
    long: "Smart cabinet accessories turn dead corners and deep cabinets into easy-access storage. We install pull-out pantries, waste bins, spice racks, drawer organisers and corner units.",
    project: "Cabinet accessories and pantry storage",
    inclusions: ["Needs assessment", "Accessory selection", "Installation in new or existing cabinets"],
    problems: ["Hard-to-reach corner cabinets", "Cluttered drawers", "No room for waste and recycling"],
    options: ["Corner carousel", "Pull-out pantry", "Double waste bin", "Spice pull-out"],
    materials: ["Soft-close slides", "Metal and wood organisers", "Dovetail drawers"],
    timeline: "Typically 1 to 3 days",
  },
  {
    title: "Countertops and Surfaces",
    slug: "countertops-and-surfaces",
    short: "Quartz and stone countertops with clean edges, sinks and backsplashes.",
    long: "We template, supply and install countertops with the sink, faucet and backsplash matched to your design. Quartz and stone options suit busy family kitchens and bathrooms.",
    project: "Countertop replacement",
    inclusions: ["Templating", "Fabrication and installation", "Sink and faucet fitting", "Backsplash coordination"],
    problems: ["Stained or chipped counters", "Outdated colours", "Poor sink fit"],
    options: ["Waterfall edge", "Undermount sink", "Full-height backsplash", "Pop-up outlets"],
    materials: ["Quartz", "Granite", "Stainless steel sinks"],
    timeline: "Typically 1 to 2 weeks from template to install",
  },
];

async function main() {
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  const now = new Date();

  for (const [i, cat] of CATEGORIES.entries()) {
    const res = await db.collection("gallerycategories").updateOne(
      { slug: cat.slug },
      { $setOnInsert: { ...cat, image: "", order: i, published: true, createdAt: now, updatedAt: now } },
      { upsert: true },
    );
    console.log(res.upsertedCount ? `created category: ${cat.slug}` : `category exists: ${cat.slug}`);
  }

  for (const [i, s] of SERVICES.entries()) {
    const doc = {
      title: s.title,
      slug: s.slug,
      serviceNumber: String(i + 1).padStart(2, "0"),
      shortDescription: s.short,
      description: s.long,
      typicalProjectType: s.project,
      inclusions: s.inclusions,
      problems: s.problems,
      designOptions: s.options.map((title) => ({ title, description: "", image: "" })),
      materials: s.materials.map((name) => ({ name, description: "", image: "" })),
      processSteps: STEPS.map(([title, description], n) => ({ title, description, image: "", order: n })),
      timeline: s.timeline,
      ctaLabel: "Book a Free Consultation",
      ctaLink: "/booking",
      galleryImages: [],
      listingImage: "",
      heroImage: "",
      overviewImage: "",
      processImage: "",
      featureImage: "",
      beforeImage: "",
      afterImage: "",
      imageAlt: `${s.title} - completed project photo`,
      relatedServices: [],
      relatedOffer: null,
      seoTitle: `${s.title} | Ikasa Renovations`,
      seoDescription: s.short,
      published: true,
      featured: i < 3,
      order: i,
      createdAt: now,
      updatedAt: now,
    };
    const res = await db.collection("services").updateOne({ slug: s.slug }, { $setOnInsert: doc }, { upsert: true });
    console.log(res.upsertedCount ? `created service: ${s.slug}` : `service exists: ${s.slug}`);
  }

  await mongoose.disconnect();
  console.log("Done. Now run scripts/apply-local-photos.mjs");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
