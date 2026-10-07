/**
 * map-and-normalize-pool.ts
 *
 * Takes the harvested pool of 46 unique high-resolution architectural images,
 * maps each unphotographed showroom category in Sanity to a unique distinct image,
 * and normalizes them all into 1376x768 WebP with sharp.
 */

import { createClient } from "next-sanity";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";
import sharp from "sharp";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2024-02-12",
  useCdn: false,
});

const TARGET_WIDTH = 1376;
const TARGET_HEIGHT = 768;

interface PoolImage {
  url: string;
  alt: string;
  localPath: string;
}

interface NormalizedAsset {
  categorySlug: string;
  categoryName: string;
  familySlug: string;
  sourceUrl: string;
  normalizedPath: string;
  publicUrl: string;
  width: number;
  height: number;
  format: string;
  sizeBytes: number;
}

async function main() {
  const poolManifestPath = path.resolve(process.cwd(), "public/staging/pool/pool-manifest.json");
  if (!fs.existsSync(poolManifestPath)) {
    console.error("Pool manifest not found at:", poolManifestPath);
    process.exit(1);
  }

  const pool: PoolImage[] = JSON.parse(fs.readFileSync(poolManifestPath, "utf-8"));
  console.log(`Pool contains ${pool.length} images.`);

  // Fetch all categories from Sanity
  const allCats: Array<{ _id: string; name: string; slug: { current: string }; primaryRail?: string; categoryImage?: any }> =
    await client.fetch(`*[_type == "category"]{ _id, name, slug, primaryRail, categoryImage } | order(name asc)`);

  const missingHeroCats = allCats.filter((c) => !c.categoryImage);
  console.log(`Found ${missingHeroCats.length} categories without categoryImage in Sanity.`);

  const outputDir = path.resolve(process.cwd(), "public/staging/normalized");
  fs.mkdirSync(outputDir, { recursive: true });

  const catalog: NormalizedAsset[] = [];
  const usedImages = new Set<string>();

  let poolIndex = 0;

  for (const cat of missingHeroCats) {
    const slug = cat.slug?.current;
    if (!slug) continue;

    // Pick an unused image from pool
    let picked: PoolImage | null = null;
    while (poolIndex < pool.length) {
      const candidate = pool[poolIndex++];
      if (!usedImages.has(candidate.localPath) && fs.existsSync(candidate.localPath)) {
        picked = candidate;
        usedImages.add(candidate.localPath);
        break;
      }
    }

    if (!picked) {
      console.warn(`No more pool images available for [${cat.name}]!`);
      break;
    }

    const outFilename = `${slug}.webp`;
    const outputPath = path.join(outputDir, outFilename);

    try {
      await sharp(picked.localPath)
        .resize(TARGET_WIDTH, TARGET_HEIGHT, { fit: "cover", position: "center" })
        .webp({ quality: 85, effort: 4 })
        .toFile(outputPath);

      const stats = fs.statSync(outputPath);
      console.log(`  ✓ Normalized [${cat.name}] (${slug}) -> ${outFilename} (${(stats.size / 1024).toFixed(1)} KB)`);

      catalog.push({
        categorySlug: slug,
        categoryName: cat.name,
        familySlug: cat.primaryRail || "handles-knobs",
        sourceUrl: picked.url,
        normalizedPath: outputPath,
        publicUrl: `/staging/normalized/${outFilename}`,
        width: TARGET_WIDTH,
        height: TARGET_HEIGHT,
        format: "webp",
        sizeBytes: stats.size,
      });
    } catch (err) {
      console.error(`  ✗ Error normalizing [${slug}]:`, (err as Error).message);
    }
  }

  const catalogPath = path.resolve(process.cwd(), "public/staging/staging-catalog.json");
  // Merge with existing if any
  let existing: NormalizedAsset[] = [];
  if (fs.existsSync(catalogPath)) {
    try {
      existing = JSON.parse(fs.readFileSync(catalogPath, "utf-8"));
    } catch {}
  }

  const existingMap = new Map(existing.map((e) => [e.categorySlug, e]));
  for (const item of catalog) {
    existingMap.set(item.categorySlug, item);
  }

  const finalCatalog = Array.from(existingMap.values());
  fs.writeFileSync(catalogPath, JSON.stringify(finalCatalog, null, 2));

  console.log(`\n✨ Successfully mapped and normalized ${catalog.length} new unique assets!`);
  console.log(`Total staging catalog entries: ${finalCatalog.length}`);
}

main().catch(console.error);
