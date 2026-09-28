/**
 * seed-family-categories.ts — create the five showroom-family landing pages in
 * Sanity. Phase 12 step 2.
 *
 * WHY THIS IS URGENT
 * ------------------
 * Phase 12 steps 3/4/7 shipped first: `generateStaticParams` now emits only 11
 * slugs, and next.config.ts permanently (301) redirects 13 legacy category URLs
 * to family pages. But `resolveCollectionSlug` queries Sanity only — it has no
 * fallback branch for the category document — and the five family documents did
 * not exist. So every family route 404s, and 13 previously-live, indexed URLs
 * 301 into those 404s. This script closes that hole.
 *
 * B-2: the family slug is `bathroom-hardware`, not `bathroom`. `bathroom` is
 * already a space slug, and `resolveCollectionSlug` resolves spaces first, so a
 * family on `bathroom` would be permanently unreachable (and a D-27 violation).
 *
 * searchKeywords carries each family's full board sub-item list — all ~50 names
 * from the showroom wall. That is what keeps "shaving mirrors" or "italian
 * collection" findable now that they are no longer routes of their own.
 *
 * heroImage is left unset so Studio flags each family as needing real
 * photography. `image` points at the nearest existing category render so cards
 * are not blank. See 11-CONTEXT.md §8 for why a shared render must not be
 * promoted to hero.
 *
 * Usage:  npx tsx scripts/cms/seed-family-categories.ts [--dry-run]
 */
import { createClient } from "next-sanity";
import dotenv from "dotenv";
import path from "path";
import { SHOWROOM_FAMILIES } from "../../src/content/fallback/catalog";

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

/** B-2: family id -> routable slug. Only bathroom differs from its family id. */
const FAMILY_ROUTE_SLUG: Record<string, string> = {
  bathroom: "bathroom-hardware",
};

/** Existing category renders, reused as family card imagery only. */
const FAMILY_CARD_IMAGE: Record<string, string> = {
  "handles-knobs": "image-b478c0ecd77d2a15afae664991f282416453f6c5-1376x768-jpg", // HC-03-DOORS
  "door-hardware": "image-b478c0ecd77d2a15afae664991f282416453f6c5-1376x768-jpg", // HC-03-DOORS
  bathroom: "image-020a9776f72ac570aa7511d80300e6f332e64885-1376x768-jpg", // HC-03-BATHROOM
  "kitchen-wardrobes": "image-7334d68edd0962748c325ab3d1e0bb7355511aa0-1376x768-jpg", // HC-03-KITCHEN
  "furniture-hardware": "image-e681c77583364af7af02a1481544e73559e935da-1376x768-jpg", // HC-03-WARDROBE
};

const FAMILY_ICON: Record<string, string> = {
  "handles-knobs": "Grip",
  "door-hardware": "DoorOpen",
  bathroom: "Bath",
  "kitchen-wardrobes": "ChefHat",
  "furniture-hardware": "Armchair",
};

async function main() {
  const label = isDryRun ? " [DRY RUN]" : "";
  console.log(`Seeding ${SHOWROOM_FAMILIES.length} family landing pages${label}\n`);

  const assetIds = Array.from(new Set(Object.values(FAMILY_CARD_IMAGE)));
  const liveAssets = new Set<string>(await client.fetch(`*[_id in $ids]._id`, { ids: assetIds }));

  for (const [i, family] of SHOWROOM_FAMILIES.entries()) {
    const slug = FAMILY_ROUTE_SLUG[family.id] ?? family.slug;

    // Never mint a category on a slug a space already owns: spaces resolve
    // first, so the family page would be unreachable.
    const clash = await client.fetch<string | null>(
      `*[_type == "space" && slug.current == $slug][0].slug.current`,
      { slug }
    );
    if (clash) {
      console.error(`  ABORT: "${slug}" is already a space slug. Family would be unreachable (D-27).`);
      process.exit(1);
    }

    const assetId = FAMILY_CARD_IMAGE[family.id];
    const doc = {
      _id: `category-${slug}`,
      _type: "category" as const,
      name: family.name,
      slug: { _type: "slug" as const, current: slug },
      eyebrow: family.tagline,
      description: family.description,
      overview: family.description,
      cardVariant: "feature" as const,
      families: [family.id],
      primaryRail: family.id,
      // The full board sub-item list keeps every wall name findable by search
      // now that they are no longer routes of their own.
      searchKeywords: family.subcategories,
      keyFeatures: [],
      suitableFor: ["Residential", "Commercial"],
      icon: FAMILY_ICON[family.id] ?? "Package",
      whatsappMessage: `Hardware Collection — I would like to consult on ${family.name}.`,
      featured: true,
      verificationStatus: "brand_verified" as const,
      displayOrder: i,
      ...(assetId && liveAssets.has(assetId)
        ? { image: { _type: "image" as const, asset: { _type: "reference" as const, _ref: assetId } } }
        : {}),
    };

    if (isDryRun) {
      console.log(`  [dry-run] would create ${doc._id.padEnd(34)} "${family.name}" — ${family.subcategories.length} keywords`);
    } else {
      await client.createIfNotExists(doc);
      console.log(`  created ${doc._id.padEnd(34)} "${family.name}" — ${family.subcategories.length} keywords`);
    }
  }

  console.log(`\ncategory documents in Sanity: ${await client.fetch<number>(`count(*[_type == "category"])`)}`);
  console.log("\nNEXT: each family page still needs a real heroImage. Studio will flag it.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
