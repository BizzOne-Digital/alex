/**
 * Adds UNPUBLISHED draft testimonials so the client can open Admin >
 * Testimonials, replace each name and quote with a real client's words, and
 * then switch Published on. Nothing here is visible on the public site.
 *
 * Usage: node --env-file=.env.local scripts/seed-testimonial-drafts.mjs
 */
import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is required (.env.local)");
  process.exit(1);
}

const DRAFTS = [
  ["Client Name", "Kitchen Renovation", "Replace with the client's own words about their kitchen renovation."],
  ["Client Name", "Bathroom Renovation", "Replace with the client's own words about their bathroom renovation."],
  ["Client Name", "Walk-in Closet", "Replace with the client's own words about their closet."],
  ["Client Name", "Kitchen Storage and Cabinets", "Replace with the client's own words about their cabinets and storage."],
];

async function main() {
  await mongoose.connect(uri);
  const col = mongoose.connection.db.collection("testimonials");
  if ((await col.countDocuments({})) > 0) {
    console.log("Testimonials already exist - nothing added.");
  } else {
    const now = new Date();
    await col.insertMany(
      DRAFTS.map(([name, projectType, quote], order) => ({
        name, projectType, role: "Homeowner", location: "", quote,
        rating: 5, image: "", service: null, featured: order < 3,
        published: false, order, createdAt: now, updatedAt: now,
      })),
    );
    console.log(`Added ${DRAFTS.length} unpublished drafts.`);
  }
  await mongoose.disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
