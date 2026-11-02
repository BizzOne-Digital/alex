/**
 * Creates the default FAQs if they do not exist (matched by question).
 * Existing FAQs are never overwritten, so admin edits are safe.
 *
 * Usage: node --env-file=.env.local scripts/seed-faqs.mjs
 */
import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is required (.env.local)");
  process.exit(1);
}

const FAQS = [
  ["booking", "How do I book a consultation?", "Use the Book a Free Consultation button, choose the service you are interested in and tell us a little about your space. We will contact you to confirm a time for a visit or call."],
  ["booking", "Is the consultation really free?", "Yes. The first consultation, including measurements and ideas for your space, has no cost or obligation."],
  ["booking", "What should I prepare before the consultation?", "Photos of the space, any inspiration images you like, a rough budget range and your ideal timing. If you already have appliances or fixtures you want to keep, let us know."],
  ["services", "What services do you offer?", "We design, supply and install kitchens, bathrooms and closets, along with flooring and tile, countertops, appliance installation and cabinet storage solutions."],
  ["services", "Do you handle everything, or do I need to hire other trades?", "We coordinate the full project, including design, product supply and installation, so you have one point of contact. We will explain exactly what is included in your quote."],
  ["services", "Can you work with products I have already chosen?", "Often, yes. Share the product details with us and we will confirm that it suits your space and can be installed properly."],
  ["pricing", "How much will my renovation cost?", "Cost depends on the size of the space, the materials and the scope of work. After the consultation we give you a clear written quote so you know what to expect before work begins."],
  ["pricing", "Do you offer special offers or promotions?", "We run seasonal offers from time to time. Ask about current promotions when you book your consultation, and check our offers section on the website."],
  ["process", "How long does a project take?", "A closet can take days, a bathroom a few weeks and a full kitchen longer. We confirm the schedule with you before work starts and tell you early if anything changes."],
  ["process", "Will I need to move out during the work?", "Most projects can be done while you stay in your home. For kitchens and bathrooms we plan ahead so you have a clear idea of what will and will not be usable at each stage."],
  ["process", "What happens after the work is finished?", "We do a final walkthrough with you, fix any touch-ups and explain how to care for the new materials and fixtures."],
  ["materials", "How do I choose the right materials?", "We explain the options in plain language, show samples where possible and recommend what suits your space, daily use and budget."],
  ["materials", "Can I see examples of your work?", "Yes. Browse our gallery for completed kitchens, bathrooms and closets, and ask us during your consultation for more examples similar to your project."],
];

async function main() {
  await mongoose.connect(uri);
  const col = mongoose.connection.db.collection("faqs");
  const now = new Date();
  let created = 0;
  for (const [i, [category, question, answer]] of FAQS.entries()) {
    const res = await col.updateOne(
      { question },
      { $setOnInsert: { question, answer, category, order: i, published: true, createdAt: now, updatedAt: now } },
      { upsert: true },
    );
    if (res.upsertedCount) created++;
  }
  console.log(`FAQs created: ${created}, already existed: ${FAQS.length - created}`);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
