import { config as loadEnv } from "dotenv";
import { resolve } from "path";
import mongoose from "mongoose";

loadEnv({ path: resolve(process.cwd(), ".env.local") });

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is not set");

await mongoose.connect(uri);
const result = await mongoose.connection.db.collection("sitesettings").updateOne(
  { key: "site" },
  {
    $set: {
      headerLogo: "/brand/ikasa-renovations-logo.png",
      footerLogo: "/brand/ikasa-renovations-logo.png",
      favicon: "/brand/ikasa-favicon.png",
    },
  },
);
console.log("Logo paths updated:", result.modifiedCount, "doc(s)");
await mongoose.disconnect();
