/**
 * Copies all collections from a source MongoDB to Atlas.
 *
 * Usage:
 *   # Source from env MONGODB_URI, Atlas from MONGODB_ATLAS_URI or argv
 *   node --env-file=.env.local scripts/sync-to-atlas.mjs
 *
 *   # Explicit source + atlas (recommended when .env.local already points at Atlas)
 *   node scripts/sync-to-atlas.mjs --source "mongodb://127.0.0.1:27017/ikasa_renovations" --atlas "mongodb+srv://..."
 *
 * If Atlas is at the free-tier 500-collection limit, existing collections are
 * overwritten in place (no new collections are created).
 */
import { config } from "dotenv";
import { resolve } from "path";
import mongoose from "mongoose";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

function arg(name) {
  const idx = process.argv.indexOf(`--${name}`);
  if (idx >= 0 && process.argv[idx + 1]) return process.argv[idx + 1];
  return null;
}

const sourceUri =
  arg("source") || process.env.MONGODB_SYNC_SOURCE || process.env.MONGODB_URI;
const atlasUri =
  arg("atlas") ||
  process.argv.find((a) => a.startsWith("mongodb")) ||
  process.env.MONGODB_ATLAS_URI;

if (!sourceUri) {
  console.error("Source URI required (--source or MONGODB_URI)");
  process.exit(1);
}

if (!atlasUri) {
  console.error("Atlas URI required (--atlas or MONGODB_ATLAS_URI)");
  process.exit(1);
}

if (/127\.0\.0\.1|localhost/i.test(atlasUri)) {
  console.error("Destination must be Atlas, not localhost.");
  process.exit(1);
}

async function main() {
  console.log("Connecting source…");
  const source = await mongoose.createConnection(sourceUri).asPromise();
  console.log("Connecting Atlas…");
  const dest = await mongoose.createConnection(atlasUri).asPromise();

  const sourceDb = source.db;
  const destDb = dest.db;
  if (!sourceDb || !destDb) throw new Error("Missing database handles");

  const sourceCols = (await sourceDb.listCollections().toArray())
    .map((c) => c.name)
    .filter((n) => !n.startsWith("system."));

  const destCols = new Set(
    (await destDb.listCollections().toArray()).map((c) => c.name),
  );

  console.log(`Source collections: ${sourceCols.length}`);
  console.log(`Atlas existing: ${destCols.size}`);

  for (const name of sourceCols) {
    const docs = await sourceDb.collection(name).find({}).toArray();

    if (!destCols.has(name)) {
      try {
        if (docs.length) {
          await destDb.collection(name).insertMany(docs, { ordered: false });
        } else {
          await destDb.createCollection(name);
        }
        console.log(`  ${name}: created + ${docs.length} docs`);
      } catch (err) {
        console.warn(
          `  ${name}: SKIPPED create (${docs.length} docs) — ${err.message}`,
        );
      }
      continue;
    }

    await destDb.collection(name).deleteMany({});
    if (docs.length) {
      await destDb.collection(name).insertMany(docs, { ordered: false });
    }
    console.log(`  ${name}: synced ${docs.length} docs`);
  }

  await source.close();
  await dest.close();
  console.log("Atlas sync complete.");
}

main().catch((err) => {
  console.error("Atlas sync failed:", err.message || err);
  process.exit(1);
});
