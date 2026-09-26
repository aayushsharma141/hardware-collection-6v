/**
 * seed-brand-attribution.ts — attach authorised brands to categories in Sanity
 * and set brand display priority. Owner-approved 2026-09-26.
 *
 * PRIORITY: Blum, Häfele, Dorset, Hettich and Tattva lead every brand surface.
 * Every other brand keeps its current relative order — the owner set only the
 * top five, so nothing else is promoted or demoted.
 *
 * ATTRIBUTION SOURCES — deliberately narrow:
 *   - `brands` (verified) from src/content/fallback/catalog.ts for the 13
 *     original categories. `pendingVerificationBrands` are NOT attached: they
 *     are unconfirmed, and "authorised" is a claim the brands themselves care
 *     about.
 *   - Blum, the owner's top brand, has no verified category. Blum makes only
 *     furniture fittings (hinges, drawer runners, lift systems), so it is
 *     attached to exactly the three categories where Häfele and Hettich
 *     already cover those lines. This is an inference, recorded here so it can
 *     be reversed.
 *   - Tattva's record describes only "a range of high-quality hardware
 *     products", too vague to map without guessing. Left unattached.
 *
 * References are stored in priority order, so every consumer that renders them
 * as-is already shows the top brands first.
 *
 * Usage:  npx tsx scripts/cms/seed-brand-attribution.ts [--dry-run]
 */
import { createClient } from "next-sanity";
import dotenv from "dotenv";
import path from "path";
import { CATEGORIES } from "../../src/content/fallback/catalog";

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

const TOP_FIVE = ["blum", "hafele", "dorset", "hettich", "tattva"];

/** Blum inference — see header. */
const BLUM_CATEGORIES = ["hinges-soft-close", "drawer-channels", "modular-kitchen-hardware"];

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

async function main() {
  const label = isDryRun ? " [DRY RUN]" : "";
  const brands: Array<{ _id: string; name: string; slug: string; displayOrder?: number }> =
    await client.fetch(`*[_type == "brand"]{ _id, name, "slug": slug.current, displayOrder }`);
  const bySlug = new Map(brands.map((b) => [b.slug, b]));

  // --- 1. Display priority -------------------------------------------------
  const rest = brands
    .filter((b) => !TOP_FIVE.includes(b.slug))
    .sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999) || a.name.localeCompare(b.name))
    .map((b) => b.slug);
  const ordered = [...TOP_FIVE.filter((slug) => bySlug.has(slug)), ...rest];
  const priority = new Map(ordered.map((slug, i) => [slug, i]));

  console.log(`1. Brand display priority${label}`);
  for (const slug of ordered) {
    const brand = bySlug.get(slug)!;
    const want = priority.get(slug)!;
    if (brand.displayOrder === want) continue;
    console.log(`   ${slug.padEnd(12)} ${String(brand.displayOrder).padStart(4)} -> ${want}`);
    if (!isDryRun) await client.patch(brand._id).set({ displayOrder: want }).commit();
  }

  // --- 2. Category attribution --------------------------------------------
  const byName = new Map(brands.map((b) => [norm(b.name), b]));
  const wanted = new Map<string, Set<string>>();
  for (const cat of CATEGORIES) {
    for (const name of cat.brands) {
      const brand = byName.get(norm(name));
      if (!brand) {
        console.warn(`   WARNING: brand "${name}" (${cat.slug}) has no Sanity document — skipped.`);
        continue;
      }
      wanted.set(cat.slug, (wanted.get(cat.slug) ?? new Set()).add(brand.slug));
    }
  }
  for (const slug of BLUM_CATEGORIES) wanted.set(slug, (wanted.get(slug) ?? new Set()).add("blum"));

  console.log(`\n2. Category attribution${label}`);
  for (const [catSlug, brandSlugs] of wanted) {
    const doc = await client.fetch<{ _id: string } | null>(
      `*[_type == "category" && slug.current == $slug][0]{ _id }`,
      { slug: catSlug }
    );
    if (!doc) {
      console.warn(`   WARNING: category "${catSlug}" not in Sanity — skipped.`);
      continue;
    }
    const sorted = [...brandSlugs].sort((a, b) => priority.get(a)! - priority.get(b)!);
    const refs = sorted.map((slug) => ({
      _type: "reference" as const,
      _ref: bySlug.get(slug)!._id,
      _key: slug,
    }));
    console.log(`   ${catSlug.padEnd(28)} ${sorted.join(", ")}`);
    if (!isDryRun) await client.patch(doc._id).set({ brands: refs }).commit();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
