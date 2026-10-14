/**
 * fix-open-items.ts — close the small content gaps the 2026-10-13 audit left
 * open, using the owner's answers (2026-10-14):
 *
 *   product "Pull Handle"   no brand   -> Hafele (matches the satin-stainless
 *                                         "Pull Handle / HÄFELE" item in src/content/fallback/home.ts)
 *   homePage.heroHeadline   empty      -> "The Art of\nthe Finish." (the live fallback, line break included,
 *                                         so the hero is unchanged and Publish is no longer blocked)
 *   brand Becker, Dorio     no logo    -> public/brands/BECKER.webp, public/brands/dorio.svg
 *
 * NOT touched: the unpublished siteSettings draft. The owner confirmed the
 * published opening hours are right, but the draft also holds a different
 * Google Maps link and SEO title that need a decision, so it is left alone.
 *
 * A field is written only when it is empty (see planOpenItems), so an editor's
 * value is never overwritten and the script is safe to re-run.
 *
 * READ-ONLY BY DEFAULT: prints the plan and writes nothing. --apply uploads the
 * logos and writes the fields; the previous documents are saved to .backups/
 * (gitignored) first.
 *
 * Usage:
 *   npx tsx scripts/cms/fix-open-items.ts            # plan only
 *   npx tsx scripts/cms/fix-open-items.ts --apply    # write
 */
import { createClient } from "@sanity/client";
import { createReadStream, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  HAFELE_BRAND_ID,
  LOGO_FILES,
  PULL_HANDLE_PRODUCT_ID,
  planOpenItems,
  type OpenItemsState,
  type StoredDoc,
} from "../../src/content/sanity/lib/openItems";

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

async function readState(): Promise<OpenItemsState> {
  const brandIds = [HAFELE_BRAND_ID, ...Object.keys(LOGO_FILES)];
  const [product, brands, homePage, homePageDraft] = await Promise.all([
    client.getDocument<StoredDoc>(PULL_HANDLE_PRODUCT_ID),
    client.getDocuments<StoredDoc>(brandIds),
    client.getDocument<StoredDoc>("homePage"),
    client.getDocument<StoredDoc>("drafts.homePage"),
  ]);
  return {
    product: product ?? null,
    brands: Object.fromEntries(brands.filter((b): b is StoredDoc => Boolean(b)).map((b) => [b._id, b])),
    homePage: homePage ?? null,
    homePageDraft: homePageDraft ?? null,
  };
}

async function main() {
  const state = await readState();
  const { writes, skipped } = planOpenItems(state);

  console.log(`Dataset ${projectId}/${dataset}. ${apply ? "APPLYING" : "Plan only (pass --apply to write)"}.\n`);
  for (const w of writes) console.log(`  WRITE  ${w.kind.padEnd(16)} ${w.note}`);
  for (const s of skipped) console.log(`  skip   ${s}`);
  if (writes.length === 0) {
    console.log("\nNothing to do.");
    return;
  }
  if (!apply) return;

  // Save what is about to be changed.
  const backup = {
    at: new Date().toISOString(),
    docs: Object.fromEntries(
      [...new Set(writes.map((w) => w.docId))].map((id) => {
        const doc = id === state.product?._id ? state.product : id === "homePage" ? state.homePage : id === "drafts.homePage" ? state.homePageDraft : state.brands[id];
        return [id, doc];
      })
    ),
  };
  mkdirSync(path.resolve(process.cwd(), ".backups"), { recursive: true });
  const file = path.resolve(process.cwd(), ".backups", `open-items-${Date.now()}.json`);
  writeFileSync(file, JSON.stringify(backup, null, 2));
  console.log(`\nBackup written: ${path.relative(process.cwd(), file)}`);

  for (const w of writes) {
    if (w.kind === "setProductBrand") {
      await client.patch(w.docId).set({ brand: { _type: "reference", _ref: w.brandId } }).commit();
    } else if (w.kind === "setHeadline") {
      await client.patch(w.docId).set({ heroHeadline: w.value }).commit();
    } else {
      const abs = path.resolve(process.cwd(), w.file);
      const asset = await client.assets.upload("image", createReadStream(abs), { filename: path.basename(abs) });
      await client.patch(w.docId).set({ logo: { _type: "image", asset: { _type: "reference", _ref: asset._id } } }).commit();
    }
    console.log(`  done   ${w.note}`);
  }
}

main().catch((error) => {
  console.error("fix-open-items failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
