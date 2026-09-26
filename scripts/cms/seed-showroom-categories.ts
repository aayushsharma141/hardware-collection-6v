/**
 * seed-showroom-categories.ts — push the showroom-board categories that exist
 * only in the fallback into Sanity, which is the canonical content source.
 *
 * WHY THIS EXISTS
 * ---------------
 * Commit 074657e ("complete showroom taxonomy expansion") added 35 categories
 * to `src/content/fallback/catalog.ts`, taking CATEGORIES from 13 to 48. But
 * `src/content/fallback/` is a resilience mechanism, not a place to author
 * content (CLAUDE.md, "Content ownership"), and Sanity was never updated.
 *
 * The consequence is a silent one:
 *
 *   - `generateStaticParams` in /collections/[slug] unions the Sanity slugs
 *     with the fallback slugs, so all 54 paths get prerendered.
 *   - `resolveCollectionSlug` queries Sanity *only* — there is no fallback
 *     branch for the category document itself.
 *   - So 35 of those 54 prerendered paths call `notFound()` and serve a 404.
 *
 * Nothing links to them and they are not in sitemap.xml, so no visitor hits a
 * broken link today. But they are dead URLs, and they block any UI that groups
 * categories by showroom family — such a section's whole job is to link here.
 *
 * WHAT THIS DOES
 * --------------
 * Creates the absent category documents from the fallback definitions, using
 * `createIfNotExists` so it never overwrites owner edits made in Studio.
 *
 * IMAGES: `image` is set to the closest of the six existing category renders so
 * grid cards are not blank. `heroImage` is deliberately left UNSET even though
 * the schema marks it required — that makes Studio flag each new category as
 * needing real photography, which is exactly the outstanding owner task. Do not
 * "fix" those warnings by pointing every style collection at one shared render:
 * eleven Handles & Knobs collections are distinguished by how they look, and a
 * shared stock image would make them indistinguishable.
 *
 * BRANDS: left empty. The fallback declares no brands for these 35, and the
 * owner has not confirmed which partner supplies which collection. This script
 * does not invent references.
 *
 * Usage:  npx tsx scripts/cms/seed-showroom-categories.ts [--dry-run]
 */
import { createClient } from "next-sanity";
import dotenv from "dotenv";
import path from "path";
import { CATEGORIES, type CategoryInfo } from "../../src/content/fallback/catalog";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !dataset || !token) {
  console.error("Missing Sanity env vars. Check .env.local.");
  process.exit(1);
}

const isDryRun = process.argv.includes("--dry-run");
const client = createClient({ projectId, dataset, apiVersion: "2024-02-12", useCdn: false, token });

/**
 * The six category renders already uploaded to Sanity, mapped to the family
 * each new category belongs to. Card imagery only — never a hero.
 */
const FAMILY_CARD_IMAGE: Record<string, string> = {
  "handles-knobs": "image-b478c0ecd77d2a15afae664991f282416453f6c5-1376x768-jpg", // HC-03-DOORS
  "door-hardware": "image-b478c0ecd77d2a15afae664991f282416453f6c5-1376x768-jpg", // HC-03-DOORS
  bathroom: "image-020a9776f72ac570aa7511d80300e6f332e64885-1376x768-jpg", // HC-03-BATHROOM
  "kitchen-wardrobes": "image-7334d68edd0962748c325ab3d1e0bb7355511aa0-1376x768-jpg", // HC-03-KITCHEN
  "furniture-hardware": "image-e681c77583364af7af02a1481544e73559e935da-1376x768-jpg", // HC-03-WARDROBE
};

/** primaryRail values the Sanity schema actually accepts. */
const VALID_RAILS = new Set([
  "handles-knobs",
  "door-hardware",
  "bathroom",
  "kitchen-wardrobes",
  "furniture-hardware",
  "more",
]);

/**
 * Board order, not alphabetical. The showroom wall reads
 * "Kids · Modern · Classical · Long Bar …", and the site should not disagree
 * with the wall (D3). `CATEGORIES` is authored in board order, so its index is
 * the ordering signal. Offset past the original 13 so the pre-existing
 * categories keep leading their families.
 */
function displayOrderFor(cat: CategoryInfo): number {
  return CATEGORIES.findIndex((c) => c.slug === cat.slug);
}

function buildDoc(cat: CategoryInfo, assetId: string | undefined) {
  const rail = VALID_RAILS.has(cat.primaryRail) ? cat.primaryRail : "more";
  return {
    _id: `category-${cat.slug}`,
    _type: "category" as const,
    name: cat.title,
    slug: { _type: "slug" as const, current: cat.slug },
    eyebrow: cat.eyebrow,
    description: cat.shortDesc,
    overview: cat.overview,
    cardVariant: cat.cardVariant,
    families: cat.familySlugs,
    primaryRail: rail,
    suitableFor: cat.suitableFor,
    keyFeatures: cat.keyFeatures,
    // The board's own sub-item names double as customer-language search terms.
    searchKeywords: cat.subcategories ?? [],
    icon: cat.iconName,
    whatsappMessage: cat.whatsappMessage,
    featured: cat.featured ?? false,
    verificationStatus: cat.verificationStatus,
    displayOrder: displayOrderFor(cat),
    ...(assetId
      ? { image: { _type: "image" as const, asset: { _type: "reference" as const, _ref: assetId } } }
      : {}),
  };
}

async function main() {
  const label = isDryRun ? " [DRY RUN]" : "";

  // Which fallback slugs are genuinely absent from Sanity?
  const allSlugs = CATEGORIES.map((c) => c.slug);
  const present: string[] = await client.fetch(
    `*[_type in ["space", "category"] && slug.current in $slugs].slug.current`,
    { slugs: allSlugs }
  );
  const presentSet = new Set(present);
  const absent = CATEGORIES.filter((c) => !presentSet.has(c.slug));

  console.log(`fallback categories : ${allSlugs.length}`);
  console.log(`already in Sanity   : ${presentSet.size}`);
  console.log(`to create           : ${absent.length}${label}\n`);

  // Verify the shared card assets exist before referencing them.
  const assetIds = Array.from(new Set(Object.values(FAMILY_CARD_IMAGE)));
  const liveAssets: string[] = await client.fetch(`*[_id in $ids]._id`, { ids: assetIds });
  const liveAssetSet = new Set(liveAssets);
  for (const id of assetIds) {
    if (!liveAssetSet.has(id)) {
      console.warn(`  WARNING: image asset ${id} not found — those categories will be created without a card image.`);
    }
  }

  let created = 0;
  for (const cat of absent) {
    const family = cat.familySlugs[0];
    const assetId = FAMILY_CARD_IMAGE[family];
    const doc = buildDoc(cat, assetId && liveAssetSet.has(assetId) ? assetId : undefined);

    if (isDryRun) {
      console.log(`  [dry-run] would create ${doc._id.padEnd(40)} rail=${doc.primaryRail} order=${doc.displayOrder} img=${doc.image ? "Y" : "-"}`);
    } else {
      await client.createIfNotExists(doc);
      console.log(`  created ${doc._id.padEnd(40)} rail=${doc.primaryRail} order=${doc.displayOrder} img=${doc.image ? "Y" : "-"}`);
      created += 1;
    }
  }

  // Ordering pass — runs even for documents that already existed, so board
  // order can be re-applied without recreating anything. Only `displayOrder`
  // is touched; owner edits to copy and imagery are left alone.
  console.log(`
Reconciling displayOrder against board order${label}...`);
  let reordered = 0;
  for (const cat of CATEGORIES) {
    const want = displayOrderFor(cat);
    const doc = await client.fetch<{ _id: string; displayOrder?: number } | null>(
      `*[_type == "category" && slug.current == $slug][0]{ _id, displayOrder }`,
      { slug: cat.slug }
    );
    if (!doc || doc.displayOrder === want) continue;
    if (isDryRun) {
      console.log(`  [dry-run] ${cat.slug.padEnd(30)} ${doc.displayOrder} -> ${want}`);
    } else {
      await client.patch(doc._id).set({ displayOrder: want }).commit();
      console.log(`  ${cat.slug.padEnd(30)} ${doc.displayOrder} -> ${want}`);
    }
    reordered += 1;
  }
  console.log(`  ${reordered} reordered.`);

  const total = await client.fetch<number>(`count(*[_type == "category"])`);
  console.log(`\n${isDryRun ? "Would create" : "Created"} ${isDryRun ? absent.length : created}. category documents in Sanity: ${total}`);
  console.log("\nNEXT: every new category still needs a real heroImage and its brand");
  console.log("attribution confirmed by the owner. Studio will flag the missing heroImage.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
