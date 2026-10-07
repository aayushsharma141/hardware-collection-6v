/**
 * seed-staging-hero-images.ts
 *
 * Staging seeder that uploads normalized web-extracted temporary imagery
 * into Sanity CMS, setting `categoryImage` for taxonomy categories under review.
 *
 * Every asset is tagged with `STAGING-TEMP` so it can be audited, isolated,
 * or purged cleanly with `purge-staging-assets.ts`.
 *
 * Usage:
 *   npx tsx scripts/cms/seed-staging-hero-images.ts [--dry-run] [--force]
 */

import { createClient } from "next-sanity";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !dataset || !token) {
  console.error("Missing Sanity environment variables in .env.local.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-02-12",
  useCdn: false,
  token,
});

interface StagingAsset {
  categorySlug: string;
  categoryName: string;
  familySlug: string;
  normalizedPath: string;
  publicUrl: string;
  width: number;
  height: number;
  format: string;
  sizeBytes: number;
}

async function main() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes("--dry-run");
  const force = args.includes("--force");
  const label = isDryRun ? " [DRY RUN]" : "";

  const catalogPath = path.resolve(process.cwd(), "public/staging/staging-catalog.json");
  if (!fs.existsSync(catalogPath)) {
    console.error("No staging catalog found at:", catalogPath);
    console.log("Run extract-web-assets.ts and normalize-assets.ts first.");
    process.exit(1);
  }

  const stagingAssets: StagingAsset[] = JSON.parse(fs.readFileSync(catalogPath, "utf-8"));
  console.log(`\n🚀 Seeding ${stagingAssets.length} staging hero assets to Sanity${label}...`);

  const seededCategories = new Set<string>();

  for (const item of stagingAssets) {
    if (seededCategories.has(item.categorySlug)) continue;

    if (!fs.existsSync(item.normalizedPath)) {
      console.warn(`  ⚠️ File missing: ${item.normalizedPath}`);
      continue;
    }

    // Try primary slug or singular variation
    const candidateSlugs = [
      item.categorySlug,
      item.categorySlug.replace(/s$/, ""),
      item.categorySlug.replace(/es$/, ""),
    ];

    let doc = null;
    for (const slug of candidateSlugs) {
      const query = `*[_type == "category" && slug.current == $slug][0]{ _id, name, categoryImage }`;
      doc = await client.fetch(query, { slug });
      if (doc) break;
    }

    if (!doc) {
      console.log(`  ⏩ Category [${item.categorySlug}] not found in Sanity. Skipping.`);
      continue;
    }

    if (doc.categoryImage?.asset && !force) {
      console.log(`  🔒 Category [${item.categorySlug}] already has categoryImage. Skipping (use --force to overwrite).`);
      continue;
    }

    console.log(`  Uploading staging asset for [${doc.name || item.categorySlug}]...`);
    if (isDryRun) {
      console.log(`    (Dry run) Would upload ${item.normalizedPath} and patch ${doc._id}`);
      continue;
    }

    try {
      const stream = fs.createReadStream(item.normalizedPath);
      const filename = `STAGING-TEMP-${item.categorySlug}.webp`;
      const uploadedAsset = await client.assets.upload("image", stream, {
        filename,
        label: `STAGING-TEMP: ${item.categoryName}`,
      });

      console.log(`    Asset uploaded -> ${uploadedAsset._id}`);

      // Patch category with temporary asset reference
      await client
        .patch(doc._id)
        .set({
          categoryImage: {
            _type: "image",
            asset: {
              _type: "reference",
              _ref: uploadedAsset._id,
            },
          },
        })
        .commit();

      console.log(`    ✓ Patched category [${doc.name}] with staging asset.`);
      seededCategories.add(item.categorySlug);
    } catch (err) {
      console.error(`    ✗ Error seeding [${item.categorySlug}]:`, (err as Error).message);
    }
  }

  console.log(`\n✨ Staging asset seeding completed.${label}`);
}

main().catch(console.error);
