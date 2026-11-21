/**
 * Appliance Installation updates from client feedback:
 * - new description (appliance guidance, Appliances Agent, brand new stock)
 * - "Custom hood covers" -> "Covers, Boxes"
 * - no timeline text; no "coordinate trades" in the process
 * - adds the installation video
 * Run apply-local-photos.mjs afterwards (or before) for the photos. Safe to re-run.
 *
 * Usage: node --env-file=.env.local scripts/apply-appliance-update.mjs
 */
import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is required (.env.local)");
  process.exit(1);
}

await mongoose.connect(uri);
const db = mongoose.connection.db;
const svc = await db.collection("services").findOne({ slug: "appliance-installation" });
if (!svc) {
  console.log("appliance-installation service not found");
} else {
  const materials = (svc.materials || []).map((m) =>
    /hood covers/i.test(m.name) ? { ...m, name: "Covers, Boxes" } : m,
  );
  const processSteps = (svc.processSteps || []).map((st) => ({
    ...st,
    description: String(st.description || "").replace(/coordinate trades and install/i, "install"),
  }));
  await db.collection("services").updateOne(
    { _id: svc._id },
    {
      $set: {
        description:
          "We suggest the best appliance options that fit your needs and refer you to our Appliances Agent for the best price and service on the market. All appliances are brand new, not discontinued or dented. We install more than just ranges: built-in microwaves, wall ovens, cooktops, range hoods, dishwashers and refrigerators.",
        materials,
        processSteps,
        timeline: "",
        videos: ["/videos/appliance-installation.mp4"],
      },
    },
  );
  console.log("updated appliance-installation");
}
await mongoose.disconnect();
