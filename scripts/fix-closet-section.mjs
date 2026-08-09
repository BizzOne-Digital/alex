import mongoose from "mongoose";

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ikasa_renovations";

await mongoose.connect(uri);
const col = mongoose.connection.db.collection("pages");

const result = await col.updateOne(
  { slug: "home", "sections.key": "closet_feature" },
  {
    $set: {
      "sections.$.primaryImage":
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=80",
      "sections.$.imageAlt":
        "Custom walk-in closet organisation — design reference",
      "sections.$.content":
        "Reach-in closets, walk-in closets and wardrobes with shelving, hanging systems, drawers and organisation tailored to how you live.",
      "sections.$.lists": [
        "Reach-in closets",
        "Walk-in closets",
        "Wardrobes",
        "Shelving systems",
        "Hanging systems",
        "Drawer storage",
        "Shoe storage",
        "Organisation",
      ],
    },
  },
);

console.log(result.modifiedCount ? "closet_feature updated" : "unchanged");
await mongoose.disconnect();
