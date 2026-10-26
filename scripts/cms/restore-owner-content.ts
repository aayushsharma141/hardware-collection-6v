/**
 * restore-owner-content.ts — restore owner-edited content from the 2026-10-23
 * documents export of the old Sanity project (gfwqxrd2) into the current one
 * (hoghkg00), which was re-seeded from the repo's fallback and lacks it.
 *
 *   created if missing   legalPage, offer, space documents
 *   set if missing       homePage sections (value propositions, finishes, pillars, gallery,
 *                        counts, CTAs, featured and trusted lists) and siteSettings.seo
 *   reported, not written  contact values that differ between the two projects
 *
 * Never overwrites an existing value. References are kept only where the target exists
 * in the new dataset; dangling ones are dropped and listed. The export holds documents
 * only, so images come back only where the same asset id exists in the new project.
 *
 * READ-ONLY BY DEFAULT: prints the plan and writes nothing. Writing needs --apply, and
 * the current homePage and siteSettings are saved whole to the export's .backups/ folder
 * first. Safe to re-run: a finished restore reports "nothing to do".
 *
 *   npx tsx scripts/cms/restore-owner-content.ts                  # plan only
 *   npx tsx scripts/cms/restore-owner-content.ts --apply          # write
 *   npx tsx scripts/cms/restore-owner-content.ts --export <file>  # another export
 *
 * To undo: the backup holds the full singleton documents (createOrReplace them back) and
 * the ids of the documents it created (delete them).
 */
import { createClient } from "@sanity/client";
import { createReadStream, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { LEGACY_PILLARS } from "../../src/components/home/pillars";
import { FINISH_IMAGE_FILES, planOwnerContentRestore, SET_FIELDS, type Doc } from "../../src/content/sanity/lib/ownerContentRestore";

const EXPORT_NAME = "gfwqxrd2-documents-export-2026-10-23.json";

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
const exportArg = process.argv.includes("--export") ? process.argv[process.argv.indexOf("--export") + 1] : undefined;
const env = loadEnv();
const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = env.NEXT_PUBLIC_SANITY_DATASET;
const token = env.SANITY_API_TOKEN;
if (!projectId || !dataset || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET or SANITY_API_TOKEN (.env.local).");
  process.exit(1);
}

// The schema files reach env.ts, which asserts these at import time, so they are set
// before the schema is imported (dynamically, in declaredFields).
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ??= projectId;
process.env.NEXT_PUBLIC_SANITY_DATASET ??= dataset;

// `raw` sees drafts as well as published documents; the default perspective hides them.
const client = createClient({ projectId, dataset, apiVersion: "2024-02-12", useCdn: false, token, perspective: "raw" });

/** The export lives in a gitignored .backups/ folder, which a worktree does not have: look upward. */
function findExport(): string {
  if (exportArg) return path.resolve(exportArg);
  let dir = process.cwd();
  for (;;) {
    const candidate = path.join(dir, ".backups", EXPORT_NAME);
    if (existsSync(candidate)) return candidate;
    const parent = path.dirname(dir);
    if (parent === dir) throw new Error(`Cannot find .backups/${EXPORT_NAME}; pass --export <file>.`);
    dir = parent;
  }
}

function findImageDir(): string {
  const dir = path.resolve(process.cwd(), "public", "cinema", "materials");
  if (!existsSync(dir)) throw new Error(`Cannot find ${dir}; run from the repo root.`);
  return dir;
}

async function declaredFields(): Promise<Record<string, Set<string>>> {
  const { schema } = await import("../../src/content/sanity/schemaTypes");
  const out: Record<string, Set<string>> = {};
  for (const type of Object.keys(SET_FIELDS)) {
    const def = schema.types.find((t) => t.name === type) as { fields?: { name: string }[] } | undefined;
    out[type] = new Set((def?.fields ?? []).map((f) => f.name));
  }
  return out;
}

const show = (value: unknown, max = 90) => {
  const text = typeof value === "string" ? JSON.stringify(value) : JSON.stringify(value) ?? "undefined";
  return text.length > max ? `${text.slice(0, max - 3)}...` : text;
};

async function readCurrent() {
  const [singletons, ids] = await Promise.all([
    client.fetch<Doc[]>(`*[_type in $types]`, { types: Object.keys(SET_FIELDS) }),
    client.fetch<{ _id: string }[]>(`*[]{_id}`),
  ]);
  return { singletons, existingIds: new Set(ids.map((d) => d._id)) };
}

async function main() {
  console.log(`${apply ? "APPLY" : "DRY RUN (nothing will be written)"}  project: ${projectId}  dataset: ${dataset}`);
  const exportFile = findExport();
  const oldDocs = JSON.parse(readFileSync(exportFile, "utf8")) as Doc[];
  console.log(`export: ${exportFile}  (${oldDocs.length} documents)\n`);

  const declared = await declaredFields();
  const { singletons, existingIds } = await readCurrent();

  // Dry run: stand-in ids, so the plan shows the finishes with images without uploading.
  // Apply: the real asset ids, filled in after the upload below.
  const finishImages: Record<string, string> = Object.fromEntries(Object.keys(FINISH_IMAGE_FILES).map((name) => [name, `image-dryrun-${name}`]));
  const buildPlan = (docs: Doc[], ids: ReadonlySet<string>) =>
    planOwnerContentRestore({ oldDocs, currentDocs: docs, existingIds: ids, legacyPillars: LEGACY_PILLARS, declared, finishImages });
  let plan = buildPlan(singletons, existingIds);
  console.log(`finish images: ${Object.entries(FINISH_IMAGE_FILES).map(([name, file]) => `${name} <- ${file}`).join(", ")}\n`);

  console.log(`CREATE (${plan.creates.length}) documents that do not exist yet:`);
  for (const c of plan.creates) {
    const doc = oldDocs.find((d) => d._id === c.id);
    console.log(`  ${c.type.padEnd(10)} ${c.id.padEnd(30)} ${show(doc?.title ?? doc?.name ?? "", 50)}`);
  }

  console.log(`\nSET IF MISSING (${plan.sets.length}) fields on the singletons:`);
  for (const s of plan.sets) console.log(`  ${s.id}.${s.field}`);

  const droppedByField = new Map<string, string[]>();
  for (const d of plan.dropped) droppedByField.set(`${d.id}.${d.field}`, [...(droppedByField.get(`${d.id}.${d.field}`) ?? []), d.ref]);
  console.log(`\nDROPPED references to things not in the new dataset (${plan.dropped.length}):`);
  for (const [key, refs] of droppedByField) console.log(`  ${key}: ${refs.length} (e.g. ${refs.slice(0, 2).join(", ")})`);

  console.log(`\nSKIPPED fields (${plan.skipped.length}):`);
  for (const s of plan.skipped) console.log(`  ${s.id}.${s.field}: ${s.reason}`);

  console.log(`\nDIFFER between the projects, NOT written - owner to choose (${plan.decisions.length}):`);
  for (const d of plan.decisions) {
    console.log(`  ${d.id}.${d.field}`);
    console.log(`    current: ${show(d.current)}`);
    console.log(`    old:     ${show(d.old)}`);
  }

  const home = singletons.find((d) => d._type === "homePage");
  const undeclared = home ? Object.keys(home).filter((k) => !k.startsWith("_") && !declared.homePage.has(k)) : [];
  if (undeclared.length) console.log(`\nNOTE homePage carries ${undeclared.length} fields no schema declares (Studio shows "Unknown field"): ${undeclared.join(", ")}`);

  if (plan.mutations.length === 0) {
    console.log("\nNothing to do.");
    return;
  }
  if (!apply) {
    console.log(`\nDry run complete: ${plan.mutations.length} mutation(s) would be written. Re-run with --apply to write them.`);
    return;
  }

  const dir = path.dirname(exportFile);
  mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `restore-owner-content-${new Date().toISOString().replace(/[:.]/g, "-")}.json`);
  writeFileSync(
    file,
    JSON.stringify(
      {
        restore: "singletons: the full documents before the restore (createOrReplace them back). created: ids this run created (delete them).",
        project: projectId,
        dataset,
        singletons,
        created: plan.creates.map((c) => c.id),
      },
      null,
      2
    )
  );
  console.log(`\nBackup written: ${file}`);

  // Upload the stand-in images (Sanity de-duplicates by content hash, so a re-run reuses them).
  const imageDir = findImageDir();
  for (const [name, fileName] of Object.entries(FINISH_IMAGE_FILES)) {
    const asset = await client.assets.upload("image", createReadStream(path.join(imageDir, fileName)), { filename: fileName });
    finishImages[name] = asset._id;
    console.log(`uploaded ${fileName} -> ${asset._id}`);
  }
  plan = buildPlan(singletons, existingIds);

  await client.mutate(plan.mutations as never, { visibility: "sync" });

  const after = await readCurrent();
  const again = buildPlan(after.singletons, after.existingIds);
  const ok = again.mutations.length === 0;
  console.log(`${ok ? "OK  " : "FAIL"} ${plan.mutations.length} written; ${again.mutations.length} still to do`);
  if (!ok) process.exitCode = 1;
}

main().catch((error: unknown) => {
  console.error("Failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
