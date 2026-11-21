/**
 * Applies client feedback to the booking page content stored in MongoDB:
 * - hero heading -> "Book Your Free In Home Consultation"
 * - "Request an Appointment" -> "Book an Appointment"
 * - "What to Expect" now explains what is covered in the consultation
 * Safe to re-run.
 *
 * Usage: node --env-file=.env.local scripts/apply-booking-feedback.mjs
 */
import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is required (.env.local)");
  process.exit(1);
}

const INTRO = {
  heading: "What We Will Cover in Your In Home Consultation",
  content:
    "We visit your home, look at the space with you and talk through your plans. There is no cost and no obligation. Here is what we will go over together:",
  lists: [
    "Your goals, style ideas and how you use the space",
    "On-site measurements and a look at the current layout",
    "Materials, finishes and fixtures that suit your budget",
    "A realistic budget range and project timeline",
    "Next steps and a clear written quote after the visit",
    "Answers to any questions you have about the process",
  ],
};

const fix = (v) =>
  typeof v === "string"
    ? v
        .replace(/Book Your Free Renovation Consultation/g, "Book Your Free In Home Consultation")
        .replace(/Request an Appointment/g, "Book an Appointment")
    : v;

await mongoose.connect(uri);
const db = mongoose.connection.db;
const page = await db.collection("pages").findOne({ slug: "booking" });
if (!page) {
  console.log("booking page not found");
} else {
  for (const section of page.sections) {
    for (const key of ["heading", "subheading", "content", "eyebrow"]) {
      if (section[key]) section[key] = fix(section[key]);
    }
    if (section.key === "intro") Object.assign(section, INTRO);
  }
  if (!page.sections.some((x) => x.key === "intro")) {
    page.sections.push({ key: "intro", visible: true, order: page.sections.length, ...INTRO });
  }
  await db.collection("pages").updateOne({ _id: page._id }, { $set: { sections: page.sections } });
  console.log("updated booking page");
}
await mongoose.disconnect();
