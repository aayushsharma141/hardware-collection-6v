/**
 * remove-leftover-fields.ts — delete fields that are stored in Sanity but
 * declared by no schema, so Studio stops reporting "Unknown field found".
 *
 *   brand.brandName      duplicate of `name` (written by an earlier migration)
 *   brand.catalogType    migration marker ("upload"); nothing reads it
 *   category.status      retired in favour of the Publish button
 *   homePage.heroSlides  the pre-Hero-Manager hero; the homepage hero now
 *                        comes from code and the offers marked "show on home"
 *
 * Nothing in src/ or scripts/ reads any of these (checked 2026-10-13). Only the
 * fields listed here are touched, and the script refuses to remove one that a
 * registered schema declares.
 *
 * NOT included: `siteSettings.mainLogo` (decide whether the logo should be
 * editable first) and the testimonial fields `quote`, `source`, `date`,
 * `approved`, which the site reads and need their own migration.
 *
 * READ-ONLY BY DEFAULT: prints every removal and its value and writes nothing.
 * Writing needs --apply; before any write the removed values are saved to
 * .backups/ (gitignored). Safe to re-run.
 *
 * Usage:
 *   npx tsx scripts/cms/remove-leftover-fields.ts            # plan only
 *   npx tsx scripts/cms/remove-leftover-fields.ts --apply    # write
 */
import { createClient } from "@sanity/client";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { planLeftoverFields, type AnyDoc, type LeftoverSpec } from "../../src/content/sanity/lib/leftoverFields";

const SPEC: LeftoverSpec = {
  brand: ["brandName", "catalogType"],
  category: ["status"],
  homePage: ["heroSlides"],
};

/** .env.local holds one UTF-16 line spliced into UTF-8, so strip NULs before parsing. */
function loadEnv(): Record<string, string> {
  const env: Record<string, string> = {};
  let text = "";
  try {
    text = readFileSync(path.resolve(process.cwd(), ".env.local"), "utf8").replace(/\u0000/g, "");
  } catch {
    // Fall through to process.env, which CI and Vercel provide.
  }
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (match) env[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }
  return { ...env, ...(Object.fromEntries(Object.entries(process.env).filter(([, v]) => v)) as Record<string, string>) };
}

const apply = process.argv.includes("--apply");
const env = loadEnv();
const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = env.NEXT_PUBLIC_SANITY_DATASET;
const token = env.SANITY_API_TOKEN;
if (!projectId || !dataset || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET or SANITY_API_TOKEN (.env.local).");
  process.exit(1);
}

// The schema files reach env.ts, which asserts these at import time, so they are
// set before the schema is imported (dynamically, in declaredFields).
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ??= projectId;
process.env.NEXT_PUBLIC_SANITY_DATASET ??= dataset;

// `raw` sees drafts as well as published documents; the default perspective hides them.
const client = createClient({ projectId, dataset, apiVersion: "2024-02-12", useCdn: false, token, perspective: "raw" });

/** Fields a registered schema declares for a document type. */
async function declaredFields(type: string): Promise<Set<string>> {
  const { schema } = await import("../../src/content/sanity/schemaTypes");
  const def = schema.types.find((t) => t.name === type) as { fields?: { name: string }[] } | undefined;
  return new Set((def?.fields ?? []).map((f) => f.name));
}

const show = (value: unknown) => {
  const text = JSON.stringify(value);
  return text.length > 110 ? `${text.slice(0, 107)}...` : text;
};

async function main() {
  console.log(`${apply ? "APPLY" : "DRY RUN (nothing will be written)"}  dataset: ${dataset}\n`);

  const declared: string[] = [];
  for (const [type, fields] of Object.entries(SPEC)) {
    const known = await declaredFields(type);
    declared.push(...fields.filter((f) => known.has(f)).map((f) => `${type}.${f}`));
  }
  if (declared.length) {
    console.error(`Refusing to run: a registered schema declares ${declared.join(", ")}. Those are live fields, not leftovers.`);
    process.exit(1);
  }

  const docs = await client.fetch<AnyDoc[]>(`*[_type in $types]`, { types: Object.keys(SPEC) });
  const plan = planLeftoverFields(docs, SPEC);

  for (const [key, n] of Object.entries(plan.counts)) console.log(`  ${key.padEnd(22)} removed from ${n} document(s)`);
  console.log("");
  // One representative value per field; a long list of identical markers helps nobody.
  const seen = new Set<string>();
  for (const r of plan.removed) {
    const k = `${r.type}.${r.field}`;
    if (seen.has(k) && r.type !== "homePage") continue;
    seen.add(k);
    console.log(`  e.g. ${k} on ${r.id}: ${show(r.value)}`);
  }
  if (plan.differing.length) {
    console.log("\n  ! These brandName values are NOT the brand's name, so removing them loses a value:");
    for (const d of plan.differing) console.log(`    ${d.id}: brandName ${show(d.value)} vs name ${show(d.name)}`);
  } else if (plan.counts["brand.brandName"]) {
    console.log("\n  brandName equals name on every brand: it is a pure duplicate.");
  }

  if (plan.mutations.length === 0) {
    console.log("\nNothing to do.");
    return;
  }
  if (!apply) {
    console.log(`\nDry run complete: ${plan.mutations.length} document(s) would be patched. Re-run with --apply to write them.`);
    return;
  }

  const dir = path.resolve(process.cwd(), ".backups");
  mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `leftover-fields-${new Date().toISOString().replace(/[:.]/g, "-")}.json`);
  writeFileSync(
    file,
    JSON.stringify(
      {
        restore: "Each entry is a field removed from a document, with its value. To undo, set the field back on that _id.",
        dataset,
        removed: plan.removed,
      },
      null,
      2
    )
  );
  console.log(`\nBackup written: ${path.relative(process.cwd(), file)}`);

  await client.mutate(plan.mutations, { visibility: "sync" });

  const after = planLeftoverFields(await client.fetch<AnyDoc[]>(`*[_type in $types]`, { types: Object.keys(SPEC) }), SPEC);
  const ok = after.mutations.length === 0;
  console.log(`${ok ? "OK  " : "FAIL"} ${plan.mutations.length} patched; ${after.mutations.length} still carrying a leftover field`);
  if (!ok) process.exitCode = 1;
}

main().catch((error: unknown) => {
  console.error("Failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
