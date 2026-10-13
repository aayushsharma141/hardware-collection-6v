/**
 * migrate-category-rails.ts — rewrite every category's `primaryRail` to one of
 * the seven showroom families.
 *
 * Categories still carry the five rails used before 2026-10-06
 * (`door-hardware`, `handles-knobs`, `kitchen-wardrobes`, `bathroom`,
 * `furniture-hardware`). The site resolves them correctly, but Studio shows an
 * error on each category because the value is not one of the seven allowed.
 * The value written is exactly what the site computes today (`railGroupId`),
 * so no category changes family on /collections.
 *
 * READ-ONLY BY DEFAULT: prints every change and writes nothing. Writing needs
 * --apply; before any write the affected documents are saved whole to
 * .backups/ (gitignored). Safe to re-run; a migrated dataset plans nothing.
 * A category the site would show under "More Hardware" has no family to write
 * and is only reported: someone has to choose one.
 *
 * Usage:
 *   npx tsx scripts/cms/migrate-category-rails.ts            # plan only
 *   npx tsx scripts/cms/migrate-category-rails.ts --apply    # write
 */
import { createClient } from "@sanity/client";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { railGroupId } from "../../src/lib/collections/showroom";
import { planCategoryRails, type CategoryDoc } from "../../src/content/sanity/lib/categoryRails";

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

async function main() {
  console.log(`${apply ? "APPLY" : "DRY RUN (nothing will be written)"}  dataset: ${dataset}\n`);

  const docs = await client.fetch<(CategoryDoc & Record<string, unknown>)[]>(`*[_type == "category"]`);
  const plan = planCategoryRails(docs);

  // The migration's whole promise is that no category moves. Check it per change
  // before anything is written, whatever the planner says.
  const moved = plan.migrations.filter((m) => railGroupId(m.to, m.slug) !== railGroupId(m.from, m.slug));
  if (moved.length) {
    console.error(`Refusing to run: ${moved.length} change(s) would move a category: ${moved.map((m) => m.slug).join(", ")}`);
    process.exit(1);
  }

  const width = Math.max(...plan.migrations.map((m) => m.slug.length), 4);
  console.log(`${docs.length} categories: ${plan.migrations.length} to migrate, ${plan.unchanged} already correct, ${plan.unresolved.length} need a decision\n`);
  for (const m of plan.migrations) console.log(`  ${m.slug.padEnd(width)}  ${String(m.from).padEnd(18)} -> ${m.to}${m.id.startsWith("drafts.") ? "   (draft)" : ""}`);
  for (const u of plan.unresolved) console.log(`  ! ${u.slug || u.id}  rail ${JSON.stringify(u.from)}: no family, the site shows it under "More Hardware". Choose one in Studio.`);

  const byFamily: Record<string, number> = {};
  for (const m of plan.migrations) byFamily[m.to] = (byFamily[m.to] ?? 0) + 1;
  console.log(`\nBy family: ${Object.entries(byFamily).map(([family, n]) => `${family} ${n}`).join(", ") || "(none)"}`);

  if (plan.mutations.length === 0) {
    console.log("\nNothing to do.");
    return;
  }
  if (!apply) {
    console.log(`\nDry run complete: ${plan.mutations.length} document(s) would be written. Re-run with --apply to write them.`);
    return;
  }

  const dir = path.resolve(process.cwd(), ".backups");
  mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `category-rails-${new Date().toISOString().replace(/[:.]/g, "-")}.json`);
  const ids = new Set(plan.migrations.map((m) => m.id));
  writeFileSync(
    file,
    JSON.stringify(
      {
        restore:
          "Each entry holds a category's primaryRail before the migration. To undo, set primaryRail on that _id back to this value.",
        dataset,
        before: Object.fromEntries(docs.filter((d) => ids.has(d._id)).map((d) => [d._id, d.primaryRail ?? null])),
      },
      null,
      2
    )
  );
  console.log(`\nBackup written: ${path.relative(process.cwd(), file)}`);

  await client.mutate(plan.mutations, { visibility: "sync" });

  const after = await client.fetch<CategoryDoc[]>(`*[_type == "category"]{_id, slug, primaryRail}`);
  const verify = planCategoryRails(after);
  const ok = verify.migrations.length === 0;
  console.log(`${ok ? "OK  " : "FAIL"} ${plan.mutations.length} written; ${verify.migrations.length} still legacy, ${verify.unchanged} correct, ${verify.unresolved.length} unresolved`);
  if (!ok) process.exitCode = 1;
}

main().catch((error: unknown) => {
  console.error("Failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
