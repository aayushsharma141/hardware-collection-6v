/**
 * reconcile-categories.ts — bring the Sanity `category` roster in line with the
 * physical showroom board (5 families) and the canonical fallback taxonomy.
 *
 * Three deterministic operations, all idempotent:
 *
 *   1. REPOINT — the sole `product` document hangs off the legacy `doors`
 *      category. It is a Hafele mortise lock, so it belongs to
 *      `mortise-door-locks`.
 *   2. RETIRE  — delete the 9 legacy/duplicate category documents that Sanity
 *      accumulated but the fallback taxonomy never had. Two of them
 *      (`kitchen`, `wardrobe`) collide head-on with `space` documents of the
 *      same slug, which makes `/collections/kitchen` ambiguous and violates
 *      D-27 (cross-type slug uniqueness). `doors` exists three times over.
 *   3. FAMILIES — every category currently has an empty `families` array, so
 *      family-based grouping silently falls back to `primaryRail` alone. Mirror
 *      the authoritative `SHOWROOM_FAMILIES[].collectionSlugs` mapping from
 *      src/content/fallback/catalog.ts into the CMS.
 *
 * Usage:  npx tsx scripts/cms/reconcile-categories.ts [--dry-run]
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

/** Legacy category documents with no counterpart in the canonical taxonomy. */
const RETIRE_IDS = [
  "category-architectural",
  "category-bath",
  "category-kitchen",                          // collides with space-kitchen
  "category-smart",
  "category-wardrobe",                         // collides with space-wardrobe
  "3fd02fa8-d2b3-433a-ab80-c5d6079bc548",      // cabinet-and-drawer-hardware
  "category-doors",
  "e2514cac-dd6b-4cf8-92f6-a2cd821ef347",      // doors (duplicate)
  "drafts.e2514cac-dd6b-4cf8-92f6-a2cd821ef347",
];

const REPOINT = {
  productId: "86e6e1d6-a60a-48ff-8098-eaa8a7bb7fd1", // "Hafele Mortise Lock"
  toCategorySlug: "mortise-door-locks",
};

/** categorySlug -> family ids, inverted from SHOWROOM_FAMILIES[].collectionSlugs. */
function buildFamilyMap(): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const family of SHOWROOM_FAMILIES) {
    for (const slug of family.collectionSlugs) {
      map.set(slug, [...(map.get(slug) ?? []), family.id]);
    }
  }
  return map;
}

async function main() {
  const label = isDryRun ? " [DRY RUN]" : "";

  // --- 1. Repoint the orphaned product ------------------------------------
  console.log(`\n1. Repointing product -> ${REPOINT.toCategorySlug}${label}`);
  const target = await client.fetch<{ _id: string } | null>(
    `*[_type == "category" && slug.current == $slug][0]{ _id }`,
    { slug: REPOINT.toCategorySlug }
  );
  if (!target) {
    console.error(`   ABORT: target category "${REPOINT.toCategorySlug}" does not exist.`);
    process.exit(1);
  }
  const product = await client.fetch<{ _id: string; name: string } | null>(
    `*[_id == $id][0]{ _id, name }`,
    { id: REPOINT.productId }
  );
  if (!product) {
    console.log("   skipped — product not found (already reconciled?)");
  } else if (isDryRun) {
    console.log(`   [dry-run] would set ${product.name}.category -> ${target._id}`);
  } else {
    await client
      .patch(REPOINT.productId)
      .set({ category: { _type: "reference", _ref: target._id } })
      .commit();
    console.log(`   ${product.name}.category -> ${target._id}`);
  }

  // --- 2. Retire legacy categories ----------------------------------------
  console.log(`\n2. Retiring ${RETIRE_IDS.length} legacy category documents${label}`);
  for (const id of RETIRE_IDS) {
    const doc = await client.fetch<{ _id: string; slug: string } | null>(
      `*[_id == $id][0]{ _id, "slug": slug.current }`,
      { id }
    );
    if (!doc) {
      console.log(`   ${id.padEnd(44)} absent — nothing to do`);
      continue;
    }
    // Never delete a document something still points at.
    const referrers = await client.fetch<Array<{ _id: string; _type: string }>>(
      `*[references($id)]{ _id, _type }`,
      { id }
    );
    // In a dry run the repoint above has not actually happened yet, so the
    // product still points at the legacy `doors` document. Don't cry wolf.
    const blocking = isDryRun
      ? referrers.filter((r) => r._id !== REPOINT.productId)
      : referrers;
    if (blocking.length > 0) {
      console.error(
        `   ABORT: ${id} (${doc.slug}) is still referenced by ` +
          blocking.map((r) => `${r._type}:${r._id}`).join(", ")
      );
      process.exit(1);
    }
    if (isDryRun) {
      console.log(`   [dry-run] would delete ${id.padEnd(44)} (${doc.slug})`);
    } else {
      await client.delete(id);
      console.log(`   deleted ${id.padEnd(44)} (${doc.slug})`);
    }
  }

  // --- 3. Populate families -----------------------------------------------
  const familyMap = buildFamilyMap();
  console.log(`\n3. Populating families on ${familyMap.size} categories${label}`);
  for (const [slug, families] of familyMap) {
    const doc = await client.fetch<{ _id: string; families?: string[] } | null>(
      `*[_type == "category" && slug.current == $slug][0]{ _id, families }`,
      { slug }
    );
    if (!doc) {
      console.warn(`   WARNING: category "${slug}" not found — skipping, not fabricating a document.`);
      continue;
    }
    const current = (doc.families ?? []).slice().sort().join(",");
    if (current === families.slice().sort().join(",")) {
      console.log(`   ${slug.padEnd(28)} already correct`);
      continue;
    }
    if (isDryRun) {
      console.log(`   [dry-run] would set ${slug.padEnd(28)} -> ${families.join(", ")}`);
    } else {
      await client.patch(doc._id).set({ families }).commit();
      console.log(`   ${slug.padEnd(28)} -> ${families.join(", ")}`);
    }
  }

  const remaining = await client.fetch<number>(`count(*[_type == "category"])`);
  console.log(`\nDone. category documents remaining: ${remaining}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
