/**
 * seed-legacy-pillars.ts — set Studio's Home Page "Legacy Pillars" to the three
 * pillars the About section used to hardcode (src/components/home/pillars.ts),
 * so the page can read the field with no visible change. Studio held a different
 * pair ("Expert Selection", "Premium Showroom"); they are replaced, and listed in
 * the dry run and the backup. Drafts are patched too.
 *
 * READ-ONLY BY DEFAULT: prints what it would replace and writes nothing. Writing
 * needs --apply, and the affected documents are saved whole to .backups/
 * (gitignored) first. Safe to re-run: a finished seed reports "nothing to do".
 *
 *   npx tsx scripts/cms/seed-legacy-pillars.ts            # plan only
 *   npx tsx scripts/cms/seed-legacy-pillars.ts --apply    # write
 *
 * To undo: each backup holds the full documents; createOrReplace them back.
 */
import { createClient } from "@sanity/client";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { LEGACY_PILLARS } from "../../src/components/home/pillars";
import { planLegacyPillars, type HomeDoc } from "../../src/content/sanity/lib/legacyPillarsSeed";

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
const fetchHome = () => client.fetch<HomeDoc[]>(`*[_type == "homePage"]`);

const show = (pillars: { title?: string; description?: string }[]) =>
  pillars.length ? pillars.map((p) => `"${p.title}"`).join(", ") : "(none)";

async function main() {
  console.log(`${apply ? "APPLY" : "DRY RUN (nothing will be written)"}  dataset: ${dataset}
`);

  const docs = await fetchHome();
  const plan = planLegacyPillars(docs, LEGACY_PILLARS);
  console.log(`  homePage documents found: ${docs.map((d) => d._id).join(", ") || "none"}
`);
  console.log(`  will set: ${LEGACY_PILLARS.map((p) => `"${p.title}"`).join(", ")}`);
  for (const b of plan.before) console.log(`  ${b.id} currently: ${show(b.pillars)}`);
  for (const p of LEGACY_PILLARS) console.log(`    ${p._key}  ${p.title} - ${p.description}`);

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
  const file = path.join(dir, `legacy-pillars-${new Date().toISOString().replace(/[:.]/g, "-")}.json`);
  const touched = new Set(plan.mutations.map((m) => m.patch.id));
  writeFileSync(
    file,
    JSON.stringify(
      {
        restore: "Each value is the full document before the change. To undo, createOrReplace it back.",
        dataset,
        documents: Object.fromEntries(docs.filter((d) => touched.has(d._id)).map((d) => [d._id, d])),
      },
      null,
      2
    )
  );
  console.log(`\nBackup written: ${path.relative(process.cwd(), file)}`);

  await client.mutate(plan.mutations, { visibility: "sync" });

  const after = planLegacyPillars(await fetchHome(), LEGACY_PILLARS);
  const ok = after.mutations.length === 0;
  console.log(`${ok ? "OK  " : "FAIL"} ${plan.mutations.length} patched; ${after.mutations.length} still differing`);
  if (!ok) process.exitCode = 1;
}

main().catch((error: unknown) => {
  console.error("Failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
