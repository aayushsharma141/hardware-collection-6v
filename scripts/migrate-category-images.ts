import { createClient } from "next-sanity";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !dataset || !token) {
  console.error("Missing Sanity environment variables. Check .env.local.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: false,
  token,
});

const IMAGE_FILES = [
  "HC-03-BATHROOM.png",
  "HC-03-DOORS.png",
  "HC-03-GLASS.png",
  "HC-03-KITCHEN.png",
  "HC-03-SECURITY.png",
  "HC-03-WARDROBE.png",
];

const KEYWORD_MAP: Record<string, string[]> = {
  "HC-03-SECURITY.png": ["lock", "security", "safe"],
  "HC-03-BATHROOM.png": ["bath"],
  "HC-03-KITCHEN.png": ["kitchen", "sink"],
  "HC-03-WARDROBE.png": ["wardrobe", "furniture", "slide", "hinge"],
  "HC-03-GLASS.png": ["glass"],
};

async function uploadCategoryAssets(): Promise<Record<string, string>> {
  const assetMap: Record<string, string> = {};
  const dirPath = path.resolve(process.cwd(), "public/cinema/categories");

  for (const filename of IMAGE_FILES) {
    const filePath = path.join(dirPath, filename);
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filePath}`);
      continue;
    }

    try {
      console.log(`Uploading ${filename}...`);
      const stream = fs.createReadStream(filePath);
      const asset = await client.assets.upload("image", stream, { filename });
      assetMap[filename] = asset._id;
      console.log(`  Uploaded ${filename} -> ${asset._id}`);
    } catch (err) {
      console.error(`Failed to upload ${filename}:`, err);
    }
  }

  return assetMap;
}

async function migrate() {
  console.log("Starting Category Image Sanity Migration...");
  const assetMap = await uploadCategoryAssets();

  const categories: Array<{
    _id: string;
    slug?: string;
    image?: unknown;
  }> = await client.fetch(`*[_type == "category"]{ _id, "slug": slug.current, image }`);

  let categoriesPatched = 0;
  let categoriesSkipped = 0;

  for (const cat of categories) {
    if (cat.image) {
      console.log(`Skipping category ${cat._id} (${cat.slug}) — already has image.`);
      categoriesSkipped++;
      continue;
    }

    const slugStr = (cat.slug || "").toLowerCase();
    let matchedFilename: string | null = null;

    for (const [filename, keywords] of Object.entries(KEYWORD_MAP)) {
      if (keywords.some((kw) => slugStr.includes(kw))) {
        matchedFilename = filename;
        break;
      }
    }

    if (!matchedFilename) {
      matchedFilename = "HC-03-DOORS.png";
    }

    const assetId = assetMap[matchedFilename];
    if (!assetId) {
      console.warn(`No asset found for ${matchedFilename}, skipping category ${cat._id}`);
      continue;
    }

    try {
      await client
        .patch(cat._id)
        .setIfMissing({
          image: {
            _type: "image",
            asset: {
              _type: "reference",
              _ref: assetId,
            },
          },
        })
        .commit();

      console.log(
        `Patched category ${cat._id} (${cat.slug}) with ${matchedFilename} (${assetId})`
      );
      categoriesPatched++;
    } catch (err) {
      console.error(`Failed to patch category ${cat._id}:`, err);
    }
  }

  // Patch siteSettings singleton with HC-03-DOORS asset
  const doorsAssetId = assetMap["HC-03-DOORS.png"];
  let settingsPatched = false;
  if (doorsAssetId) {
    try {
      await client
        .patch("siteSettings")
        .setIfMissing({
          defaultCategoryImage: {
            _type: "image",
            asset: {
              _type: "reference",
              _ref: doorsAssetId,
            },
          },
        })
        .commit();
      console.log(`Patched siteSettings with defaultCategoryImage (${doorsAssetId})`);
      settingsPatched = true;
    } catch (err) {
      console.error("Failed to patch siteSettings defaultCategoryImage:", err);
    }
  }

  console.log("\n--- Migration Summary ---");
  console.log(`Assets uploaded: ${Object.keys(assetMap).length}/${IMAGE_FILES.length}`);
  console.log(`Categories patched: ${categoriesPatched}`);
  console.log(`Categories skipped: ${categoriesSkipped}`);
  console.log(`SiteSettings patched: ${settingsPatched}`);
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
