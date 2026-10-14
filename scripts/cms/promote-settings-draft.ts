/**
 * promote-settings-draft.ts — keep two values from the unpublished siteSettings
 * draft, then discard the draft. Owner-approved 2026-10-14.
 *
 *   googleMapsUrl     the draft's pinned place link replaces the generic search link
 *   seo.metaTitle     the draft's "... in Jamshedpur" title replaces the shorter one
 *                     (it is the home page <title>, via layout.tsx and page.tsx)
 *
 * NOT copied: the draft's opening hours (the owner confirmed the PUBLISHED hours
 * are right), and nothing else. The draft is then deleted in the same
 * transaction, and only if the published document was patched successfully.
 *
 * READ-ONLY BY DEFAULT: prints the plan and writes nothing. --apply writes; the
 * published and draft documents are saved whole to .backups/ (gitignored) first.
 * Safe to re-run: with no draft left it reports "nothing to do".
 *
 * Usage:
 *   npx tsx scripts/cms/promote-settings-draft.ts            # plan only
 *   npx tsx scripts/cms/promote-settings-draft.ts --apply    # write
 */
import { createClient } from "@sanity/client";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { planSettingsDraft, type SettingsDoc } from "../../src/content/sanity/lib/settingsDraft";

const PUBLISHED_ID = "siteSettings";
const DRAFT_ID = "drafts.siteSettings";

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
  const [published, draft] = await Promise.all([
    client.getDocument<SettingsDoc>(PUBLISHED_ID),
    client.getDocument<SettingsDoc>(DRAFT_ID),
  ]);
  const plan = planSettingsDraft(published ?? null, draft ?? null);

  console.log(`${apply ? "APPLYING" : "DRY RUN (nothing will be written)"}  dataset: ${dataset}\n`);
  if (!draft) {
    console.log("Nothing to do: there is no siteSettings draft.");
    return;
  }
  if (!published) {
    console.log("Refusing: the published siteSettings document is missing, so the draft is the only copy.");
    process.exit(1);
  }
  for (const line of plan.changes) console.log(`  SET     ${line}`);
  if (plan.changes.length === 0) console.log("  (no values to copy: the published document already has them)");
  console.log(`  DELETE  ${DRAFT_ID}  (draft last edited ${String(draft._updatedAt)})`);
  if (!apply) return;

  mkdirSync(path.resolve(process.cwd(), ".backups"), { recursive: true });
  const file = path.resolve(process.cwd(), ".backups", `settings-draft-${Date.now()}.json`);
  writeFileSync(file, JSON.stringify({ at: new Date().toISOString(), published, draft }, null, 2));
  console.log(`\nBackup written: ${path.relative(process.cwd(), file)}`);

  // One transaction: the published document is patched only if it is unchanged
  // since it was read, and the draft is deleted only if that patch succeeds.
  const tx = client.transaction();
  if (Object.keys(plan.set).length > 0) tx.patch(PUBLISHED_ID, (p) => p.ifRevisionId(String(published._rev)).set(plan.set));
  tx.delete(DRAFT_ID);
  await tx.commit();
  console.log("  done");
}

main().catch((error) => {
  console.error("promote-settings-draft failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
