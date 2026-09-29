/**
 * sync-category-copy.ts — push corrected category copy from the fallback into
 * Sanity (owner-approved 2026-09-26).
 *
 * 1. DESCRIPTIONS: the 35 September categories were created with one templated
 *    sentence ("Premium {name} for architectural and interior applications.").
 *    Each now has a real line in src/content/fallback/catalog.ts.
 * 2. BATHROOM: the showroom deals in bathroom accessories, not showers, cubicles
 *    or plumbing. The Bathroom family, Bathroom Accessories, Glass Hardware and
 *    the Bathroom space carried shower copy.
 *
 * Safety: a field is overwritten ONLY while it still holds known-wrong text —
 * the templated sentence, or copy mentioning showers, thermostats, cubicles or
 * drains. Anything edited in Studio since is left alone.
 *
 * Usage:  npx tsx scripts/cms/sync-category-copy.ts [--dry-run]
 */
import { createClient } from "next-sanity";
import dotenv from "dotenv";
import path from "path";
import { CATEGORIES, SHOWROOM_FAMILIES } from "../../src/content/fallback/catalog";
import { SPACES } from "../../src/content/fallback/spaces";

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

const TEMPLATED = /^Premium .+ for architectural and interior applications\.?$/i;
const SHOWER = /shower|thermostatic|cubicle|drain/i;

type Fields = Record<string, string | string[] | undefined>;

const isStale = (value: unknown, test: RegExp) =>
  Array.isArray(value) ? value.some((v) => test.test(String(v))) : typeof value === "string" && test.test(value);

async function sync(docId: string, want: Fields, test: RegExp, label: string) {
  const doc = await client.fetch<Record<string, unknown> | null>(`*[_id == $id][0]`, { id: docId });
  if (!doc) {
    console.warn(`   WARNING: ${docId} not found — skipped.`);
    return 0;
  }
  const patch: Fields = {};
  for (const [field, value] of Object.entries(want)) {
    if (value === undefined) continue;
    if (isStale(doc[field], test)) patch[field] = value;
  }
  const keys = Object.keys(patch);
  if (keys.length === 0) return 0;
  console.log(`   ${label} ${docId.padEnd(38)} ${keys.join(", ")}`);
  if (!isDryRun) await client.patch(docId).set(patch).commit();
  return keys.length;
}

async function main() {
  const tag = isDryRun ? "[dry-run]" : "";
  let changed = 0;

  console.log(`1. Templated descriptions ${tag}`);
  for (const cat of CATEGORIES) {
    changed += await sync(`category-${cat.slug}`, { description: cat.shortDesc }, TEMPLATED, "desc ");
  }

  console.log(`\n2. Bathroom — accessories only ${tag}`);
  const cat = (slug: string) => CATEGORIES.find((c) => c.slug === slug)!;
  const bathAcc = cat("bathroom-accessories");
  changed += await sync("category-bathroom-accessories", {
    eyebrow: bathAcc.eyebrow,
    description: bathAcc.shortDesc,
    overview: bathAcc.overview,
    keyFeatures: bathAcc.keyFeatures,
    whatsappMessage: bathAcc.whatsappMessage,
  }, SHOWER, "bath ");

  const glass = cat("glass-hardware");
  changed += await sync("category-glass-hardware", {
    description: glass.shortDesc,
    overview: glass.overview,
    keyFeatures: glass.keyFeatures,
  }, SHOWER, "bath ");

  const bathFamily = SHOWROOM_FAMILIES.find((f) => f.id === "bathroom")!;
  changed += await sync("category-bathroom-hardware", {
    eyebrow: bathFamily.tagline,
    description: bathFamily.description,
    overview: bathFamily.description,
  }, SHOWER, "bath ");

  const bathSpace = SPACES.find((s) => s.slug === "bathroom")!;
  changed += await sync("space-bathroom", { description: bathSpace.description }, SHOWER, "bath ");

  console.log(`\n${isDryRun ? "Would change" : "Changed"} ${changed} field(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
