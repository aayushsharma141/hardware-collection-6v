/**
 * normalize-assets.ts
 *
 * Image processing tool that converts raw scraped imagery into
 * canonical 1376x768 WebP assets for showroom category hero cards.
 *
 * Usage:
 *   npx tsx scripts/scrape/normalize-assets.ts
 */

import * as fs from "fs";
import * as path from "path";
import sharp from "sharp";

interface ManifestEntry {
  categorySlug: string;
  categoryName: string;
  familySlug: string;
  imageUrl: string;
  altText: string;
  sourcePage: string;
  localPath?: string;
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

const TARGET_WIDTH = 1376;
const TARGET_HEIGHT = 768;

async function normalizeImage(inputPath: string, outputPath: string): Promise<{ width: number; height: number; sizeBytes: number } | null> {
  try {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });

    await sharp(inputPath)
      .resize(TARGET_WIDTH, TARGET_HEIGHT, {
        fit: "cover",
        position: "center",
      })
      .webp({ quality: 85, effort: 4 })
      .toFile(outputPath);

    const stats = fs.statSync(outputPath);
    return {
      width: TARGET_WIDTH,
      height: TARGET_HEIGHT,
      sizeBytes: stats.size,
    };
  } catch (err) {
    console.error(`  ✗ Failed to process ${inputPath}:`, (err as Error).message);
    return null;
  }
}

async function main() {
  const manifestPath = path.resolve(process.cwd(), "public/staging/raw/manifest.json");
  if (!fs.existsSync(manifestPath)) {
    console.error("No manifest found at:", manifestPath);
    console.log("Run extract-web-assets.ts first to collect source images.");
    process.exit(1);
  }

  const rawEntries: ManifestEntry[] = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
  console.log(`\n🎨 Normalizing ${rawEntries.length} scraped assets to ${TARGET_WIDTH}x${TARGET_HEIGHT} WebP...`);

  const outputDir = path.resolve(process.cwd(), "public/staging/normalized");
  fs.mkdirSync(outputDir, { recursive: true });

  const normalizedCatalog: NormalizedAsset[] = [];
  const processedCategories = new Set<string>();

  for (const entry of rawEntries) {
    if (!entry.localPath || !fs.existsSync(entry.localPath)) {
      console.warn(`  ⚠️ Missing local file: ${entry.localPath}`);
      continue;
    }

    // Produce one primary hero per category
    const isPrimary = !processedCategories.has(entry.categorySlug);
    const suffix = isPrimary ? "" : `-${Date.now()}`;
    const outFilename = `${entry.categorySlug}${suffix}.webp`;
    const outputPath = path.join(outputDir, outFilename);

    console.log(`  Processing [${entry.categorySlug}] -> ${outFilename}`);
    const meta = await normalizeImage(entry.localPath, outputPath);

    if (meta) {
      processedCategories.add(entry.categorySlug);
      normalizedCatalog.push({
        categorySlug: entry.categorySlug,
        categoryName: entry.categoryName,
        familySlug: entry.familySlug,
        sourceUrl: entry.imageUrl,
        normalizedPath: outputPath,
        publicUrl: `/staging/normalized/${outFilename}`,
        width: meta.width,
        height: meta.height,
        format: "webp",
        sizeBytes: meta.sizeBytes,
      });
      console.log(`  ✓ Created ${outFilename} (${(meta.sizeBytes / 1024).toFixed(1)} KB)`);
    }
  }

  const catalogPath = path.resolve(process.cwd(), "public/staging/staging-catalog.json");
  fs.writeFileSync(catalogPath, JSON.stringify(normalizedCatalog, null, 2));

  console.log(`\n✨ Successfully normalized ${normalizedCatalog.length} assets.`);
  console.log(`   Catalog index: ${catalogPath}`);
}

main().catch(console.error);
