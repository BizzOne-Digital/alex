import mongoose from "mongoose";

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ikasa_renovations";

const updates = {
  kitchen_feature:
    "https://images.unsplash.com/photo-1556911220-bff31c812d84?auto=format&fit=crop&w=1600&q=80",
  bathroom_feature:
    "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1600&q=80",
  closet_feature:
    "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1600&q=80",
};

await mongoose.connect(uri);
const col = mongoose.connection.db.collection("pages");

for (const [key, primaryImage] of Object.entries(updates)) {
  const result = await col.updateOne(
    { slug: "home", "sections.key": key },
    { $set: { "sections.$.primaryImage": primaryImage } },
  );
  console.log(key, result.modifiedCount ? "updated" : "unchanged");
}

await mongoose.disconnect();
