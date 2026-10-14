/**
 * merge-duplicate-brands.ts — fold two duplicate brand documents into one.
 * Owner-approved 2026-10-13.
 *
 *   brand-marnello   survives, slug "maranello"   (brand-maranello is deleted)
 *   brand-decore     survives, slug "decor-bath"  (brand-decor-bath is deleted)
 *   brand-becker     survives, slug "becker"      (brand-backer is deleted; owner-approved 2026-10-14)
 *
 * Where both documents have a value the survivor's is kept, except the Decor
 * Bath `description` and `brandPositioning`: the duplicate holds the real copy
 * and the survivor only a placeholder ("Premium Finishes"). `featured` is the
 * survivor's own on both (false); the duplicates had true.
 *
 * In each pair the survivor is the document that already has the logo and the
 * catalogue. Every reference to the duplicate (catalogues, products, categories,
 * hero slides, drafts included) is moved to the survivor, empty fields on the
 * survivor are filled from the duplicate, and then the duplicate is deleted, in
 * one transaction per pair.
 *
 * READ-ONLY BY DEFAULT. It prints exactly what it would change and writes
 * nothing. Writing needs --apply, and before any write the affected documents
 * are saved whole to .backups/ (gitignored). Safe to re-run: a finished merge
 * reports "nothing to do".
 *
 * Old links keep working: src/content/fallback/brands.ts already aliases
 * `marnello` -> maranello and `decore` -> decor-bath.
 *
 * Usage:
 *   npx tsx scripts/cms/merge-duplicate-brands.ts            # plan only
 *   npx tsx scripts/cms/merge-duplicate-brands.ts --apply    # write
 *
 * To undo: each backup holds the full documents; see its "restore" note.
 */
import { createClient } from "@sanity/client";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { planMerge, type Doc } from "../../src/content/sanity/lib/brandMerge";

const MERGES: { keep: string; drop: string; slug: string; preferDrop?: string[] }[] = [
  { keep: "brand-marnello", drop: "brand-maranello", slug: "maranello" },
  { keep: "brand-decore", drop: "brand-decor-bath", slug: "decor-bath", preferDrop: ["description", "brandPositioning"] },
  // Owner-approved 2026-10-14: "Backer" is a misspelling of Becker, which is the original.
  // Nothing referenced Backer, so this only removes the duplicate document.
  { keep: "brand-becker", drop: "brand-backer", slug: "becker" },
];

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

// `raw` sees drafts as well as published documents; the default perspective hides them.
const client = createClient({ projectId, dataset, apiVersion: "2024-02-12", useCdn: false, token, perspective: "raw" });

const get = (id: string) => client.fetch<Doc | null>(`*[_id == $id][0]`, { id });
const referrersOf = (id: string) => client.fetch<Doc[]>(`*[references($id)]`, { id });

async function main() {
  console.log(`${apply ? "APPLY" : "DRY RUN (nothing will be written)"}  dataset: ${dataset}\n`);

  const allBrands = await client.fetch<{ _id: string; slug?: string }[]>(
    `*[_type == "brand" && !(_id in path("drafts.**"))]{ _id, "slug": slug.current }`
  );
  const failures: string[] = [];
  const backup: Record<string, Doc | null> = {};
  const pending: { label: string; keep: string; drop: string; mutations: ReturnType<typeof planMerge>["mutations"] }[] = [];

  for (const { keep, drop, slug, preferDrop } of MERGES) {
    console.log(`== ${drop}  ->  ${keep}   (final slug "${slug}")`);
    const [keepDoc, dropDoc, keepDraft, dropDraft, referrers] = await Promise.all([
      get(keep),
      get(drop),
      get(`drafts.${keep}`),
      get(`drafts.${drop}`),
      referrersOf(drop),
    ]);
    const plan = planMerge({
      keep: keepDoc,
      drop: dropDoc,
      keepDraft,
      dropDraft,
      referrers,
      targetSlug: slug,
      preferDrop,
      otherSlugs: allBrands.filter((b) => b._id !== keep && b._id !== drop && b.slug).map((b) => b.slug as string),
    });

    for (const doc of [keepDoc, dropDoc, keepDraft, dropDraft, ...referrers]) if (doc) backup[doc._id] = doc;
    plan.steps.forEach((step) => console.log(`   - ${step}`));
    plan.problems.forEach((problem) => console.log(`   ! ${problem}`));
    if (plan.problems.length) failures.push(`${drop}: ${plan.problems[0]}`);
    else if (!plan.alreadyDone) pending.push({ label: `${drop} -> ${keep}`, keep, drop, mutations: plan.mutations });
    console.log(`   ${plan.mutations.length} mutation(s)\n`);
  }

  if (failures.length) {
    console.error(`Stopped. Nothing written. Resolve first:\n  ${failures.join("\n  ")}`);
    process.exit(1);
  }
  if (pending.length === 0) {
    console.log("Nothing to do.");
    return;
  }
  if (!apply) {
    console.log(`Dry run complete: ${pending.length} merge(s) would be written. Re-run with --apply to write them.`);
    return;
  }

  const dir = path.resolve(process.cwd(), ".backups");
  mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `brand-merge-${new Date().toISOString().replace(/[:.]/g, "-")}.json`);
  writeFileSync(
    file,
    JSON.stringify(
      {
        restore:
          "Each value is the full document before the merge (null = did not exist). To undo, createOrReplace the brand documents and every other document listed back to their saved value.",
        dataset,
        documents: backup,
      },
      null,
      2
    )
  );
  console.log(`Backup written: ${path.relative(process.cwd(), file)}\n`);

  for (const merge of pending) {
    await client.mutate(merge.mutations, { visibility: "sync" });
    const [leftover, gone, survivor] = await Promise.all([
      referrersOf(merge.drop),
      get(merge.drop),
      get(merge.keep),
    ]);
    const ok = leftover.length === 0 && gone === null && survivor !== null;
    console.log(`${ok ? "OK  " : "FAIL"} ${merge.label}: references left ${leftover.length}, duplicate exists ${gone !== null}`);
    if (!ok) process.exitCode = 1;
  }
}

main().catch((error: unknown) => {
  console.error("Failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
