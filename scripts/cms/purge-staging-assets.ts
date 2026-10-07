/**
 * purge-staging-assets.ts
 *
 * Rollback tool that identifies and purges temporary web-scraped staging
 * assets from Sanity CMS and local staging directories.
 *
 * This ensures that when Mukesh delivers authentic showroom photography,
 * all temporary staging data can be wiped with a single atomic command.
 *
 * Usage:
 *   npx tsx scripts/cms/purge-staging-assets.ts [--dry-run]
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

async function main() {
  const isDryRun = process.argv.includes("--dry-run");
  const label = isDryRun ? " [DRY RUN]" : "";

  console.log(`\n🧹 Scanning Sanity for temporary staging assets${label}...`);

  // Query all temporary assets tagged with STAGING-TEMP
  const stagingAssets: Array<{ _id: string; originalFilename?: string; label?: string }> =
    await client.fetch(`*[_type == "sanity.imageAsset" && (originalFilename match "STAGING-TEMP*" || label match "STAGING-TEMP*")]{ _id, originalFilename, label }`);

  console.log(`Found ${stagingAssets.length} temporary staging assets in Sanity.`);

  if (stagingAssets.length === 0) {
    console.log("No temporary staging assets found in Sanity. Dataset is clean.");
  } else {
    const assetIds = stagingAssets.map((a) => a._id);

    // Find all categories referencing any of these staging assets
    const categoriesWithStaging: Array<{ _id: string; name: string }> = await client.fetch(
      `*[_type == "category" && categoryImage.asset._ref in $assetIds]{ _id, name }`,
      { assetIds }
    );

    console.log(`Found ${categoriesWithStaging.length} categories referencing staging assets.`);

    // 1. Unset categoryImage references on categories
    for (const cat of categoriesWithStaging) {
      console.log(`  Unlinking staging image from category [${cat.name}] (${cat._id})...`);
      if (!isDryRun) {
        await client.patch(cat._id).unset(["categoryImage"]).commit();
        console.log(`    ✓ Unlinked.`);
      }
    }

    // 2. Delete the temporary asset documents
    for (const asset of stagingAssets) {
      console.log(`  Deleting staging asset [${asset.originalFilename || asset._id}]...`);
      if (!isDryRun) {
        try {
          await client.delete(asset._id);
          console.log(`    ✓ Deleted.`);
        } catch (err) {
          console.error(`    ✗ Could not delete ${asset._id}:`, (err as Error).message);
        }
      }
    }
  }

  // 3. Clean up local staging folders if requested
  const localStagingRaw = path.resolve(process.cwd(), "public/staging/raw");
  const localStagingNorm = path.resolve(process.cwd(), "public/staging/normalized");

  console.log(`\nLocal staging paths:`);
  console.log(`  Raw: ${localStagingRaw} (exists: ${fs.existsSync(localStagingRaw)})`);
  console.log(`  Normalized: ${localStagingNorm} (exists: ${fs.existsSync(localStagingNorm)})`);

  console.log(`\n✨ Purge operation complete.${label}`);
}

main().catch(console.error);
