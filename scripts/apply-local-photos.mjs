/**
 * Maps the real project photos in public/images/site across pages, services,
 * gallery categories, gallery projects and offers. Replaces the Unsplash
 * placeholders from apply-images.mjs. Safe to re-run.
 *
 * Usage: node --env-file=.env.local scripts/apply-local-photos.mjs
 *
 * File names are <group>-<IMG number>.jpg, e.g. bath-3009.jpg = IMG_3009.
 * No real before/after pairs exist in the photo set, so every before/after
 * field is cleared (the site hides those sliders when an image is missing).
 */
import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is required (.env.local)");
  process.exit(1);
}

const p = (name) => `/images/site/${name}.jpg`;
const k = (n) => p(`kitchen-${n}`);
const b = (n) => p(`bath-${n}`);
const c = (n) => p(`closet-${n}`);
const s = (n) => p(`storage-${n}`);
const f = (n) => p(`fixture-${n}`);

const IMG = {
  // Kitchens
  navy: k("navy-island-1"),
  navyWide: k("navy-island-wide"),
  navy2: k("navy-island-2"),
  navy4: k("navy-island-4"),
  woodSlat: k(3600),
  woodSlat2: k(3601),
  greyKitchen: k(3882),
  hexWhite: k(1382),
  shaker: k(4576),
  shaker2: k(4577),
  patternTile: k(5538),
  blackOak: k(5584),
  marble: k(5841),
  marble2: k(5839),
  brightWhite: k(6133),
  brightWhite2: k(6180),
  gasRange: k(7949),
  island: k(6329),

  // Bathrooms
  bathGreen: b(3009),
  bathGreen2: b(3010),
  bathGreenShower: b(2943),
  bathPurple: b(3501),
  bathPurpleTub: b(3502),
  bathSmall: b(5560),
  bathShower: b(6147),
  bathShower2: b(6150),
  bathPebble: b(2989),

  // Closets
  walkIn: c(4653),
  walkIn2: c(4640),
  walkIn3: c(4657),
  reachIn: c("0903"),
  reachIn2: c(6074),
  closetDrawers: c(9820),

  // Storage / cabinet accessories
  cornerCarousel: s(3204),
  cornerCarousel2: s(7942),
  pantryPullout: s(6342),
  spicePullout: s(4587),
  binPullout: s(6339),

  // Fixtures / countertops / appliances
  sink: f(5589),
  sink2: f(6190),
  quartz: f(3772),
  builtInMicrowave: f(6350),
  range: f(4586),
  range2: f(3207),
};

function setSection(page, key, patch) {
  const section = page.sections.find((x) => x.key === key);
  if (!section) {
    page.sections.push({ key, visible: true, order: page.sections.length, ...patch });
    return;
  }
  Object.assign(section, patch);
}

const NO_BEFORE_AFTER = { beforeImage: "", afterImage: "" };

const PAGE_IMAGES = {
  home: {
    hero: { primaryImage: IMG.navy, ...NO_BEFORE_AFTER },
    brand_positioning: {
      primaryImage: IMG.woodSlat,
      secondaryImage: IMG.bathGreen,
      backgroundImage: IMG.walkIn,
    },
    before_after: {
      primaryImage: "",
      secondaryImage: "",
      ...NO_BEFORE_AFTER,
      items: [
        { title: "Kitchen transformation", image: IMG.navy4, description: "" },
        { title: "Bathroom transformation", image: IMG.bathGreen2, description: "" },
        { title: "Closet transformation", image: IMG.walkIn2, description: "" },
      ],
    },
    one_stop: { primaryImage: IMG.brightWhite },
    kitchen_feature: { primaryImage: IMG.navy2 },
    bathroom_feature: { primaryImage: IMG.bathGreen },
    closet_feature: { primaryImage: IMG.walkIn },
    timeline: { primaryImage: IMG.shaker },
    selected_projects: { primaryImage: IMG.woodSlat2 },
    final_cta: { backgroundImage: IMG.navyWide },
  },
  about: {
    hero: { primaryImage: IMG.navyWide },
    introduction: { primaryImage: IMG.brightWhite2 },
    philosophy: { secondaryImage: IMG.bathPurple, primaryImage: IMG.shaker2 },
    one_stop: { primaryImage: IMG.gasRange },
    expertise: {
      items: [
        { title: "Kitchens", description: "Design-led kitchen renovations", image: IMG.navy },
        { title: "Bathrooms", description: "Spa-inspired bathroom makeovers", image: IMG.bathGreen },
        { title: "Closets", description: "Organised storage that fits your life", image: IMG.walkIn },
      ],
    },
    guidance: { primaryImage: IMG.cornerCarousel2, secondaryImage: IMG.builtInMicrowave },
    process: { primaryImage: IMG.brightWhite },
    timeline: { primaryImage: IMG.bathPebble },
    mosaic: {
      items: [
        { title: "Kitchen light", image: IMG.marble, description: "" },
        { title: "Bathroom calm", image: IMG.bathPurple, description: "" },
        { title: "Closet order", image: IMG.walkIn3, description: "" },
        { title: "Surface detail", image: IMG.quartz, description: "" },
        { title: "Fixture focus", image: IMG.sink, description: "" },
      ],
    },
    final_cta: { backgroundImage: IMG.blackOak },
  },
  services: {
    hero: { primaryImage: IMG.navy },
    overview: { primaryImage: IMG.brightWhite },
    kitchen_expertise: { primaryImage: IMG.woodSlat },
    bathroom_expertise: { primaryImage: IMG.bathGreen },
    closet_expertise: { primaryImage: IMG.walkIn },
    product_guidance: { primaryImage: IMG.cornerCarousel },
    collage: {
      items: [
        { title: "Cabinetry", image: IMG.shaker, description: "" },
        { title: "Vanities", image: IMG.bathSmall, description: "" },
        { title: "Closets", image: IMG.reachIn2, description: "" },
        { title: "Tile", image: IMG.bathPebble, description: "" },
        { title: "Storage", image: IMG.binPullout, description: "" },
      ],
    },
    final_cta: { backgroundImage: IMG.bathPurple },
  },
  gallery: {
    hero: { primaryImage: IMG.woodSlat },
    featured: { ...NO_BEFORE_AFTER },
    before_after: { primaryImage: "", secondaryImage: "" },
    final_cta: { backgroundImage: IMG.walkIn },
  },
  testimonials: {
    hero: { primaryImage: IMG.navy },
    image_strip: {
      items: [
        { title: "Kitchen", image: IMG.navy2, description: "" },
        { title: "Bathroom", image: IMG.bathGreenShower, description: "" },
        { title: "Closet", image: IMG.walkIn2, description: "" },
        { title: "Flooring", image: IMG.marble2, description: "" },
        { title: "Fixtures", image: IMG.sink2, description: "" },
      ],
    },
    final_cta: { backgroundImage: IMG.brightWhite2 },
  },
  booking: {
    hero: { primaryImage: IMG.brightWhite },
    final_cta: { backgroundImage: IMG.navy, primaryImage: IMG.navy },
  },
  faq: {
    hero: { primaryImage: IMG.woodSlat2 },
    final_cta: { backgroundImage: IMG.bathGreen },
  },
  contact: {
    hero: { primaryImage: IMG.shaker },
    final_cta: { backgroundImage: IMG.patternTile },
  },
};

const SERVICE_SETS = {
  kitchen: {
    listingImage: IMG.navy,
    heroImage: IMG.navyWide,
    overviewImage: IMG.marble,
    processImage: IMG.brightWhite2,
    featureImage: IMG.woodSlat,
    galleryImages: [IMG.navy2, IMG.woodSlat2, IMG.shaker, IMG.patternTile, IMG.brightWhite, IMG.gasRange],
  },
  bathroom: {
    listingImage: IMG.bathGreen,
    heroImage: IMG.bathGreen2,
    overviewImage: IMG.bathPurple,
    processImage: IMG.bathShower2,
    featureImage: IMG.bathGreenShower,
    galleryImages: [IMG.bathGreen, b(2986), IMG.bathPurpleTub, IMG.bathSmall, IMG.bathShower, b(3014)],
  },
  closet: {
    listingImage: IMG.walkIn,
    heroImage: IMG.walkIn2,
    overviewImage: IMG.walkIn3,
    processImage: IMG.reachIn,
    featureImage: IMG.closetDrawers,
    galleryImages: [IMG.walkIn, IMG.walkIn2, IMG.walkIn3, c(4659), IMG.reachIn, c(6126)],
  },
  flooring: {
    listingImage: IMG.marble,
    heroImage: IMG.marble2,
    overviewImage: IMG.bathPebble,
    processImage: k(5547),
    featureImage: b(6153),
    galleryImages: [IMG.marble, IMG.marble2, k(5547), IMG.bathPebble, b(2987), IMG.greyKitchen],
  },
  appliance: {
    listingImage: IMG.builtInMicrowave,
    heroImage: k(7786),
    overviewImage: k(4585),
    processImage: IMG.range,
    featureImage: IMG.range2,
    galleryImages: [IMG.builtInMicrowave, k(7786), k(4585), IMG.range, IMG.range2, f(3208)],
  },
  storage: {
    listingImage: IMG.cornerCarousel,
    heroImage: IMG.cornerCarousel2,
    overviewImage: IMG.pantryPullout,
    processImage: IMG.spicePullout,
    featureImage: IMG.binPullout,
    galleryImages: [IMG.cornerCarousel, s(3205), IMG.cornerCarousel2, s(7944), IMG.binPullout, s(4772)],
  },
  countertop: {
    listingImage: IMG.quartz,
    heroImage: IMG.sink,
    overviewImage: IMG.sink2,
    processImage: f(3202),
    featureImage: f(6191),
    galleryImages: [IMG.quartz, IMG.sink, IMG.sink2, f(3202), f(6191), f(7940)],
  },
};

function serviceSetFor(slug) {
  if (slug.includes("appliance")) return SERVICE_SETS.appliance;
  if (slug.includes("counter") || slug.includes("quartz") || slug.includes("granite")) {
    return SERVICE_SETS.countertop;
  }
  if (slug.includes("kitchen") || slug.includes("cabinet")) return SERVICE_SETS.kitchen;
  if (slug.includes("bath") || slug.includes("vanit") || slug.includes("shower")) {
    return SERVICE_SETS.bathroom;
  }
  if (slug.includes("closet") || slug.includes("wardrobe") || slug.includes("reach")) {
    return SERVICE_SETS.closet;
  }
  if (slug.includes("floor") || slug.includes("tile")) return SERVICE_SETS.flooring;
  if (slug.includes("storage") || slug.includes("organi") || slug.includes("pantry")) {
    return SERVICE_SETS.storage;
  }
  return null;
}

// Gallery projects: one per real job/shoot. Upserted by title.
const PROJECTS = [
  { title: "Navy Island Kitchen", cat: "kitchens", featured: true, images: [k("navy-island-1"), k("navy-island-2"), k("navy-island-3"), k("navy-island-4"), k("navy-island-wide")] },
  { title: "Warm Wood Slat Kitchen", cat: "kitchens", featured: true, images: [k(3600), k(3601), k(3602), k(3605), k(3599)] },
  { title: "Grey Shaker Kitchen", cat: "kitchens", images: [k(3882), k(3884), k(3889), k(3888)] },
  { title: "Hexagon Backsplash Kitchen", cat: "kitchens", images: [k(1382), k(1921), k(1922), k(1923), k(3990)] },
  { title: "Classic White Shaker Kitchen", cat: "kitchens", images: [k(4576), k(4577), k(4578), k(4494), k(4585)] },
  { title: "Patterned Tile Kitchen", cat: "kitchens", images: [k(5538), k(5540), k(5545), k(5546), k(5547)] },
  { title: "Black and Oak Kitchen", cat: "kitchens", featured: true, images: [k(5584), f(5589), s(5592), s(5595)] },
  { title: "Bright White Kitchen", cat: "kitchens", images: [k(6133), k(6134), k(6135), k(6136), k(6180)] },
  { title: "Gas Range Kitchen", cat: "kitchens", images: [k(7949), k(7939), k(7980), k(7981)] },
  { title: "Emerald Green Bathroom", cat: "bathrooms", featured: true, images: [b(3009), b(3010), b(2943), b(2986), b(2992), b(3014)] },
  { title: "Lavender Spa Bathroom", cat: "bathrooms", featured: true, images: [b(3501), b(3502), b(3504), b(3505), b(3506), b(3507)] },
  { title: "Compact Wood Vanity Bathroom", cat: "bathrooms", images: [b(5560), b(5564), b(5567), b(5565), b(4788)] },
  { title: "Marble Shower Bathroom", cat: "bathrooms", images: [b(6147), b(6150), b(6151), b(6152), b(6153)] },
  { title: "Walk-in Closet", cat: "closets-and-wardrobes", featured: true, images: [c(4653), c(4640), c(4657), c(4659), c(9820)] },
  { title: "Reach-in Closet and Wardrobe", cat: "closets-and-wardrobes", images: [c("0903"), c(2171), c(6074), c(6126), c(9824)] },
  { title: "Marble Floor Family Kitchen", cat: "flooring-and-tile", images: [k(5841), k(5839), k(5844)] },
  { title: "Pebble Shower Floor and Tile", cat: "flooring-and-tile", images: [b(2989), b(2987), k(5547), b(6153)] },
  { title: "Cabinet Organisers and Pull-outs", cat: "fixtures-and-finishes", images: [s(3204), s(3205), s(7942), s(7944), s(6339), s(4772)] },
  { title: "Sinks, Faucets and Hardware", cat: "fixtures-and-finishes", images: [f(5589), f(5542), f(7940), f(3202), f(6190), f(6349)] },
];

const CATEGORY_IMAGES = {
  "all-projects": IMG.woodSlat,
  kitchens: IMG.navy,
  bathrooms: IMG.bathGreen,
  "closets-and-wardrobes": IMG.walkIn,
  "flooring-and-tile": IMG.marble,
  "fixtures-and-finishes": IMG.sink,
};

// Fallback pools for pre-existing projects that are not in PROJECTS.
const CATEGORY_POOLS = {
  kitchens: PROJECTS.filter((x) => x.cat === "kitchens").flatMap((x) => x.images),
  bathrooms: PROJECTS.filter((x) => x.cat === "bathrooms").flatMap((x) => x.images),
  "closets-and-wardrobes": PROJECTS.filter((x) => x.cat === "closets-and-wardrobes").flatMap((x) => x.images),
  "flooring-and-tile": PROJECTS.filter((x) => x.cat === "flooring-and-tile").flatMap((x) => x.images),
  "fixtures-and-finishes": PROJECTS.filter((x) => x.cat === "fixtures-and-finishes").flatMap((x) => x.images),
};

async function main() {
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  console.log("Connected");

  // Pages
  for (const [slug, sections] of Object.entries(PAGE_IMAGES)) {
    const page = await db.collection("pages").findOne({ slug });
    if (!page) {
      console.log(`skip page ${slug} (missing)`);
      continue;
    }
    for (const [key, patch] of Object.entries(sections)) setSection(page, key, patch);
    await db.collection("pages").updateOne({ _id: page._id }, { $set: { sections: page.sections } });
    console.log(`updated page: ${slug}`);
  }

  // Services
  const services = await db.collection("services").find({}).toArray();
  for (const service of services) {
    const set = serviceSetFor(service.slug || "");
    if (!set) {
      console.log(`!! no photo set matches service slug "${service.slug}" - set its images in the admin`);
      continue;
    }
    const pool = set.galleryImages;
    const designOptions = (service.designOptions || []).map((opt, i) => ({ ...opt, image: pool[i % pool.length] }));
    const materials = (service.materials || []).map((mat, i) => ({ ...mat, image: pool[(i + 1) % pool.length] }));
    const processSteps = (service.processSteps || []).map((step, i) => ({
      ...step,
      image: [set.processImage, set.overviewImage, set.featureImage, set.heroImage][i % 4],
    }));
    await db.collection("services").updateOne(
      { _id: service._id },
      {
        $set: {
          ...set,
          ...NO_BEFORE_AFTER,
          designOptions,
          materials,
          processSteps,
          imageAlt: `${service.title} - completed project photo`,
        },
      },
    );
    console.log(`updated service: ${service.slug}`);
  }

  // Gallery categories
  const cats = await db.collection("gallerycategories").find({}).toArray();
  const catBySlug = new Map(cats.map((x) => [x.slug, x]));
  const catById = new Map(cats.map((x) => [String(x._id), x]));
  for (const cat of cats) {
    const image = CATEGORY_IMAGES[cat.slug];
    if (!image) {
      console.log(`category without photo mapping (left as is): ${cat.slug}`);
      continue;
    }
    await db.collection("gallerycategories").updateOne({ _id: cat._id }, { $set: { image } });
    console.log(`updated category: ${cat.slug}`);
  }

  // Gallery projects: upsert the real ones
  let order = 0;
  const realTitles = new Set();
  for (const proj of PROJECTS) {
    const cat = catBySlug.get(proj.cat);
    if (!cat) {
      console.log(`!! missing category "${proj.cat}" - skipped project "${proj.title}"`);
      continue;
    }
    realTitles.add(proj.title);
    await db.collection("galleryprojects").updateOne(
      { title: proj.title },
      {
        $set: {
          category: cat._id,
          mainImage: proj.images[0],
          images: proj.images,
          ...NO_BEFORE_AFTER,
          alt: `${proj.title} - completed project`,
          featured: Boolean(proj.featured),
          published: true,
          order: order++,
        },
        $setOnInsert: { location: "", description: "", createdAt: new Date() },
        $currentDate: { updatedAt: true },
      },
      { upsert: true },
    );
    console.log(`upserted project: ${proj.title}`);
  }

  // Older projects: keep them, but swap their images for photos from their category
  const leftovers = await db.collection("galleryprojects").find({ title: { $nin: [...realTitles] } }).toArray();
  const used = {};
  for (const project of leftovers) {
    const slug = catById.get(String(project.category))?.slug;
    const pool = CATEGORY_POOLS[slug] || CATEGORY_POOLS.kitchens;
    const n = (used[slug] = (used[slug] ?? -1) + 1);
    const main = pool[(n * 3) % pool.length];
    const images = [...new Set([main, pool[(n * 3 + 1) % pool.length], pool[(n * 3 + 2) % pool.length]])];
    await db.collection("galleryprojects").updateOne(
      { _id: project._id },
      { $set: { mainImage: main, images, ...NO_BEFORE_AFTER } },
    );
    console.log(`remapped older project (consider unpublishing): ${project.title}`);
  }

  // Offers
  const offers = await db.collection("offers").find({}).toArray();
  for (const offer of offers) {
    const title = (offer.title || "").toLowerCase();
    const image = title.includes("bath") ? IMG.bathGreen : title.includes("closet") ? IMG.walkIn : IMG.navy;
    await db.collection("offers").updateOne({ _id: offer._id }, { $set: { image } });
    console.log(`updated offer: ${offer.title}`);
  }

  console.log("Done - local photos applied.");
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
