/**
 * Applies curated Unsplash design-reference images across pages, services,
 * gallery, and offers. Safe to re-run.
 *
 * Usage: node --env-file=.env.local scripts/apply-images.mjs
 */
import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is required (.env.local)");
  process.exit(1);
}

const u = (id, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const IMG = {
  // Kitchens
  kitchenHero: u("photo-1556912173-46c336c7fd55"),
  kitchenModern: u("photo-1600585154340-be6161a56a0c"),
  kitchenIsland: u("photo-1556909114-f6e7ad7d3136"),
  kitchenBright: u("photo-1600210492486-724fe5c67fb0"),
  kitchenWork: u("photo-1556911220-bff31c812d84"),
  kitchenCabinets: u("photo-1565538810643-b5bdb714032a"),
  kitchenWarm: u("photo-1600607687644-c7171b42498b"),
  kitchenBefore: u("photo-1484154218962-a197022b5858"),
  kitchenDetail: u("photo-1556909114-f6e7ad7d3136", 1200),

  // Bathrooms
  bathHero: u("photo-1620626011761-996317b8d101"),
  bathCalm: u("photo-1552321554-5fefe8c9ef14"),
  bathVanity: u("photo-1600566752355-35792bedcfea"),
  bathGlass: u("photo-1584622650111-993a426fbf0a"),
  bathBefore: u("photo-1507652313519-d4e9174996dd"),
  bathAfter: u("photo-1600607687939-ce8a6c25118c"),
  bathTile: u("photo-1615874959474-d609969a20d0"),
  bathFixture: u("photo-1584622781564-1d987f7333c1"),

  // Closets / storage
  closetWalkin: u("photo-1616486338812-3dadae4b4ace"),
  closetOrder: u("photo-1595428774223-ef52624120d2"),
  closetWardrobe: u("photo-1558997519-83ea9252edf8"),
  closetReach: u("photo-1631889993959-41b4e9c6e3c5"),

  // Process / construction / materials
  processPlan: u("photo-1503387762-592deb58ef4e"),
  processBuild: u("photo-1504307651254-35680f356dfd"),
  flooring: u("photo-1581858726788-75bc0f6a952d"),
  living: u("photo-1600607687939-ce8a6c25118c"),
  livingWarm: u("photo-1600607687644-c7171b42498b"),
  appliance: u("photo-1556911220-bff31c812d84"),
  lighting: u("photo-1565538810643-b5bdb714032a"),
};

function setSection(page, key, patch) {
  const section = page.sections.find((s) => s.key === key);
  if (!section) {
    page.sections.push({ key, visible: true, order: page.sections.length, ...patch });
    return;
  }
  Object.assign(section, patch);
}

const PAGE_IMAGES = {
  home: {
    hero: {
      primaryImage: IMG.kitchenHero,
      beforeImage: IMG.kitchenBefore,
      afterImage: IMG.kitchenBright,
    },
    brand_positioning: {
      primaryImage: IMG.kitchenModern,
      secondaryImage: IMG.bathHero,
      backgroundImage: IMG.closetWardrobe,
    },
    before_after: {
      primaryImage: IMG.bathBefore,
      secondaryImage: IMG.bathAfter,
      beforeImage: IMG.kitchenBefore,
      afterImage: IMG.kitchenBright,
      items: [
        { title: "Kitchen transformation", image: IMG.kitchenBright, description: "" },
        { title: "Bathroom transformation", image: IMG.bathAfter, description: "" },
        { title: "Closet transformation", image: IMG.closetOrder, description: "" },
      ],
    },
    one_stop: { primaryImage: IMG.processPlan },
    kitchen_feature: { primaryImage: IMG.kitchenWork },
    bathroom_feature: { primaryImage: IMG.bathHero },
    closet_feature: { primaryImage: IMG.closetWalkin },
    timeline: { primaryImage: IMG.processBuild },
    selected_projects: { primaryImage: IMG.kitchenWarm },
    final_cta: { backgroundImage: IMG.kitchenModern },
  },
  about: {
    hero: { primaryImage: IMG.kitchenIsland },
    introduction: { primaryImage: IMG.processPlan },
    philosophy: { secondaryImage: IMG.livingWarm, primaryImage: IMG.kitchenWarm },
    one_stop: { primaryImage: IMG.processBuild },
    expertise: {
      items: [
        { title: "Kitchens", description: "Design-led kitchen renovations", image: IMG.kitchenIsland },
        { title: "Bathrooms", description: "Resort-inspired bathroom makeovers", image: IMG.bathHero },
        { title: "Closets", description: "Organised storage that fits your life", image: IMG.closetOrder },
      ],
    },
    guidance: { primaryImage: IMG.kitchenWork, secondaryImage: IMG.appliance },
    process: { primaryImage: IMG.processPlan },
    timeline: { primaryImage: IMG.bathTile },
    mosaic: {
      items: [
        { title: "Kitchen light", image: IMG.kitchenModern, description: "" },
        { title: "Bathroom calm", image: IMG.bathCalm, description: "" },
        { title: "Closet order", image: IMG.closetWardrobe, description: "" },
        { title: "Surface detail", image: IMG.flooring, description: "" },
        { title: "Fixture focus", image: IMG.bathFixture, description: "" },
      ],
    },
    final_cta: { backgroundImage: IMG.kitchenCabinets },
  },
  services: {
    hero: { primaryImage: IMG.kitchenIsland },
    overview: { primaryImage: IMG.processPlan },
    kitchen_expertise: { primaryImage: IMG.kitchenModern },
    bathroom_expertise: { primaryImage: IMG.bathVanity },
    closet_expertise: { primaryImage: IMG.closetWalkin },
    product_guidance: { primaryImage: IMG.kitchenWork },
    collage: {
      items: [
        { title: "Cabinetry", image: IMG.kitchenCabinets, description: "" },
        { title: "Vanities", image: IMG.bathGlass, description: "" },
        { title: "Closets", image: IMG.closetReach, description: "" },
        { title: "Tile", image: IMG.bathTile, description: "" },
        { title: "Lighting", image: IMG.lighting, description: "" },
      ],
    },
    final_cta: { backgroundImage: IMG.bathHero },
  },
  gallery: {
    hero: { primaryImage: IMG.kitchenWarm },
    featured: { beforeImage: IMG.kitchenBefore, afterImage: IMG.kitchenBright },
    before_after: { primaryImage: IMG.bathBefore, secondaryImage: IMG.bathAfter },
    final_cta: { backgroundImage: IMG.closetWalkin },
  },
  testimonials: {
    hero: { primaryImage: IMG.kitchenModern },
    image_strip: {
      items: [
        { title: "Kitchen", image: IMG.kitchenIsland, description: "" },
        { title: "Bathroom", image: IMG.bathCalm, description: "" },
        { title: "Closet", image: IMG.closetWardrobe, description: "" },
        { title: "Flooring", image: IMG.flooring, description: "" },
        { title: "Fixtures", image: IMG.bathFixture, description: "" },
      ],
    },
    final_cta: { backgroundImage: IMG.kitchenBright },
  },
  booking: {
    hero: { primaryImage: IMG.processPlan },
    final_cta: { backgroundImage: IMG.kitchenHero, primaryImage: IMG.kitchenHero },
  },
  faq: {
    hero: { primaryImage: IMG.kitchenWarm },
    final_cta: { backgroundImage: IMG.bathVanity },
  },
  contact: {
    hero: { primaryImage: IMG.processPlan },
    final_cta: { backgroundImage: IMG.kitchenCabinets },
  },
};

const SERVICE_SETS = {
  kitchen: {
    listingImage: IMG.kitchenIsland,
    heroImage: IMG.kitchenBright,
    overviewImage: IMG.kitchenModern,
    processImage: IMG.processPlan,
    featureImage: IMG.kitchenWork,
    beforeImage: IMG.kitchenBefore,
    afterImage: IMG.kitchenBright,
    galleryImages: [
      IMG.kitchenHero,
      IMG.kitchenModern,
      IMG.kitchenCabinets,
      IMG.kitchenWork,
      IMG.kitchenWarm,
    ],
  },
  bathroom: {
    listingImage: IMG.bathHero,
    heroImage: IMG.bathAfter,
    overviewImage: IMG.bathCalm,
    processImage: IMG.processBuild,
    featureImage: IMG.bathVanity,
    beforeImage: IMG.bathBefore,
    afterImage: IMG.bathAfter,
    galleryImages: [
      IMG.bathHero,
      IMG.bathCalm,
      IMG.bathGlass,
      IMG.bathTile,
      IMG.bathFixture,
    ],
  },
  closet: {
    listingImage: IMG.closetWalkin,
    heroImage: IMG.closetOrder,
    overviewImage: IMG.closetWardrobe,
    processImage: IMG.processPlan,
    featureImage: IMG.closetReach,
    beforeImage: IMG.closetReach,
    afterImage: IMG.closetWalkin,
    galleryImages: [
      IMG.closetWalkin,
      IMG.closetOrder,
      IMG.closetWardrobe,
      IMG.closetReach,
      IMG.kitchenWarm,
    ],
  },
  flooring: {
    listingImage: IMG.flooring,
    heroImage: IMG.bathTile,
    overviewImage: IMG.flooring,
    processImage: IMG.processBuild,
    featureImage: IMG.lighting,
    beforeImage: IMG.bathBefore,
    afterImage: IMG.bathTile,
    galleryImages: [IMG.flooring, IMG.bathTile, IMG.lighting, IMG.kitchenCabinets, IMG.bathFixture],
  },
  appliance: {
    listingImage: IMG.appliance,
    heroImage: IMG.kitchenWork,
    overviewImage: IMG.kitchenIsland,
    processImage: IMG.processPlan,
    featureImage: IMG.appliance,
    beforeImage: IMG.kitchenBefore,
    afterImage: IMG.kitchenWork,
    galleryImages: [IMG.appliance, IMG.kitchenWork, IMG.kitchenIsland, IMG.kitchenCabinets, IMG.kitchenModern],
  },
  storage: {
    listingImage: IMG.closetOrder,
    heroImage: IMG.closetWardrobe,
    overviewImage: IMG.closetWalkin,
    processImage: IMG.processPlan,
    featureImage: IMG.closetReach,
    beforeImage: IMG.closetReach,
    afterImage: IMG.closetOrder,
    galleryImages: [IMG.closetOrder, IMG.closetWalkin, IMG.closetWardrobe, IMG.closetReach, IMG.kitchenWarm],
  },
};

function serviceSetFor(slug) {
  if (slug.includes("kitchen") || slug.includes("appliance")) {
    return slug.includes("appliance") ? SERVICE_SETS.appliance : SERVICE_SETS.kitchen;
  }
  if (slug.includes("bath") || slug.includes("vanit") || slug.includes("shower")) {
    return SERVICE_SETS.bathroom;
  }
  if (slug.includes("closet") || slug.includes("wardrobe") || slug.includes("reach")) {
    return SERVICE_SETS.closet;
  }
  if (slug.includes("floor") || slug.includes("tile") || slug.includes("light")) {
    return SERVICE_SETS.flooring;
  }
  if (slug.includes("storage") || slug.includes("organisation") || slug.includes("organization")) {
    return SERVICE_SETS.storage;
  }
  return SERVICE_SETS.kitchen;
}

const GALLERY_MAINS = [
  IMG.kitchenHero,
  IMG.kitchenModern,
  IMG.bathCalm,
  IMG.bathVanity,
  IMG.closetWardrobe,
  IMG.closetOrder,
  IMG.flooring,
  IMG.bathFixture,
  IMG.kitchenBright,
];

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
    for (const [key, patch] of Object.entries(sections)) {
      setSection(page, key, patch);
    }
    await db.collection("pages").updateOne(
      { _id: page._id },
      { $set: { sections: page.sections } },
    );
    console.log(`updated page: ${slug}`);
  }

  // Services
  const services = await db.collection("services").find({}).toArray();
  for (const service of services) {
    const set = serviceSetFor(service.slug);
    const designOptions = (service.designOptions || []).map((opt, i) => ({
      ...opt,
      image: set.galleryImages[i % set.galleryImages.length],
    }));
    const materials = (service.materials || []).map((mat, i) => ({
      ...mat,
      image: set.galleryImages[(i + 1) % set.galleryImages.length],
    }));
    const processSteps = (service.processSteps || []).map((step, i) => ({
      ...step,
      image: [set.processImage, set.overviewImage, set.featureImage, set.heroImage][i % 4],
    }));

    await db.collection("services").updateOne(
      { _id: service._id },
      {
        $set: {
          ...set,
          designOptions,
          materials,
          processSteps,
          imageAlt:
            service.imageAlt ||
            `${service.title} — illustrative design reference`,
        },
      },
    );
    console.log(`updated service: ${service.slug}`);
  }

  // Gallery projects
  const projects = await db
    .collection("galleryprojects")
    .find({})
    .sort({ order: 1 })
    .toArray();
  for (let i = 0; i < projects.length; i++) {
    const project = projects[i];
    const main = GALLERY_MAINS[i % GALLERY_MAINS.length];
    const images = Array.from(
      new Set([main, ...(project.images || []).filter(Boolean), ...GALLERY_MAINS.slice(0, 3)]),
    ).slice(0, 4);

    // Replace known-broken lighting URL if present
    const cleaned = images.map((img) =>
      img.includes("photo-1524484482452") ? IMG.lighting : img,
    );

    const patch = {
      mainImage: main,
      images: cleaned,
    };

    const title = (project.title || "").toLowerCase();
    if (title.includes("before") || title.includes("kitchen inspiration")) {
      patch.beforeImage = IMG.kitchenBefore;
      patch.afterImage = IMG.kitchenBright;
    } else if (title.includes("bath")) {
      patch.beforeImage = project.beforeImage || IMG.bathBefore;
      patch.afterImage = project.afterImage || IMG.bathAfter;
    } else if (title.includes("closet") || title.includes("walk")) {
      patch.beforeImage = project.beforeImage || IMG.closetReach;
      patch.afterImage = project.afterImage || IMG.closetWalkin;
    }

    await db.collection("galleryprojects").updateOne({ _id: project._id }, { $set: patch });
    console.log(`updated gallery: ${project.title}`);
  }

  // Gallery categories
  const catImages = {
    "all-projects": IMG.kitchenWarm,
    kitchens: IMG.kitchenHero,
    bathrooms: IMG.bathCalm,
    "closets-and-wardrobes": IMG.closetWardrobe,
    "flooring-and-tile": IMG.flooring,
    "before-and-after": IMG.kitchenBright,
    "fixtures-and-finishes": IMG.bathFixture,
  };
  const cats = await db.collection("gallerycategories").find({}).toArray();
  for (const cat of cats) {
    const image = catImages[cat.slug] || IMG.kitchenModern;
    await db.collection("gallerycategories").updateOne(
      { _id: cat._id },
      { $set: { image } },
    );
    console.log(`updated category: ${cat.slug}`);
  }

  // Offers
  const offers = await db.collection("offers").find({}).toArray();
  for (const offer of offers) {
    const title = (offer.title || "").toLowerCase();
    const image = title.includes("bath") ? IMG.bathVanity : IMG.kitchenIsland;
    await db.collection("offers").updateOne({ _id: offer._id }, { $set: { image } });
    console.log(`updated offer: ${offer.title}`);
  }

  // Sweep any remaining broken lighting photo across collections
  const broken = "photo-1524484482452";
  for (const col of ["pages", "services", "galleryprojects", "gallerycategories", "offers"]) {
    const docs = await db.collection(col).find({}).toArray();
    for (const doc of docs) {
      const json = JSON.stringify(doc);
      if (!json.includes(broken)) continue;
      const replaced = JSON.parse(json.split(broken).join("photo-1565538810643-b5bdb714032a"));
      delete replaced._id;
      await db.collection(col).replaceOne({ _id: doc._id }, { ...replaced, _id: doc._id });
      console.log(`fixed broken urls in ${col}/${doc._id}`);
    }
  }

  console.log("Done — all section images applied.");
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
