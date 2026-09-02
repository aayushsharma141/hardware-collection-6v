/**
 * Upload compressed brand catalogs to Sanity and attach them to brand documents.
 *
 * Run `scripts/compress-catalogs.py` first — this reads from its output folder,
 * not from the raw originals.
 *
 * Dry run by default. Nothing is written to the dataset without `--apply`.
 *
 *   npx tsx scripts/upload-catalogs.ts              # show the plan
 *   npx tsx scripts/upload-catalogs.ts --apply      # upload and patch
 *   npx tsx scripts/upload-catalogs.ts --apply --only yale.pdf
 *   npx tsx scripts/upload-catalogs.ts --apply --force   # replace existing
 */

import { createClient } from "next-sanity";
import fs from "fs";
import path from "path";

const SRC_DIR = path.resolve(process.cwd(), "Hardware Collection/compressed-catalogs");

/**
 * Filename -> brand, set by hand rather than matched fuzzily: three of these
 * do not resemble their brand's name, and a wrong guess would attach the wrong
 * company's catalog to a brand page.
 */
type Entry = {
  slug: string;
  title: string;
  note?: string;
  /** Rename the brand document before attaching. */
  renameTo?: { name: string; slug: string };
  /** Deliberately not uploaded yet; reported, not silently skipped. */
  hold?: string;
};

const CATALOG_MAP: Record<string, Entry> = {
  "blum.pdf": { slug: "blum", title: "Blum Catalog" },
  "decor-bath.pdf": { slug: "decore", title: "Decore Bath Catalog" },
  "dorset.pdf": { slug: "dorset", title: "Dorset Catalog" },
  "geze.pdf": { slug: "geze", title: "Geze Catalog" },
  "godrej.pdf": { slug: "godrej", title: "Godrej Catalog" },
  "labacha-long-handle.pdf": { slug: "labacha", title: "Labacha Long Handle" },
  "labacha-sofa-leg.pdf": {
    slug: "labacha",
    title: "Labacha Sofa Leg - Elevè Series",
  },
  "liftor.pdf": { slug: "liftor", title: "Liftor Catalog" },
  "madhuram.pdf": { slug: "madhuram", title: "Madhuram Catalog" },
  "maranello.pdf": {
    slug: "marnello",
    title: "Maranello Catalog",
    renameTo: { name: "Maranello", slug: "maranello" },
    note: 'brand document is spelled "Marnello"; the catalog spells itself "Maranello"',
  },
  "ozone.pdf": { slug: "ozone", title: "Ozone Catalog" },
  "rexton.pdf": { slug: "rexton", title: "Rexton Catalog" },
  "sliding.pdf": {
    slug: "hafele",
    title: "Häfele Sliding Systems",
    note: "filename says nothing about the brand — the document is Häfele's "
      + "(cover logo, and Häfele appears on 18 pages; Labacha on none)",
  },
  "taco-bigfoot.pdf": { slug: "taco", title: "Taco Bigfoot Catalog" },
  "tattva.pdf": { slug: "tattva", title: "Tattva Catalog" },
  "yale.pdf": { slug: "yale", title: "Yale Catalog" },
};

/** Tolerant .env.local read — the file mixes UTF-8 and UTF-16LE content. */
function loadEnv(): Record<string, string> {
  const file = path.resolve(process.cwd(), ".env.local");
  const text = fs.readFileSync(file, "utf8").replace(/\u0000/g, "");
  const env: Record<string, string> = {};
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (m) env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
  return env;
}

const env = loadEnv();
const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = env.NEXT_PUBLIC_SANITY_DATASET;
const token = env.SANITY_API_TOKEN;

if (!projectId || !dataset || !token) {
  console.error("Missing Sanity credentials in .env.local");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-02-12",
  useCdn: false,
  token,
  perspective: "published",
});

const argv = process.argv.slice(2);
const APPLY = argv.includes("--apply");
const FORCE = argv.includes("--force");
const onlyIdx = argv.indexOf("--only");
const ONLY = onlyIdx >= 0 ? argv.slice(onlyIdx + 1).filter((a) => !a.startsWith("--")) : null;

const mb = (n: number) => (n / 1_000_000).toFixed(1) + "M";

type Brand = { _id: string; name: string; slug: string; hasCatalog: boolean };

async function main() {
  if (!fs.existsSync(SRC_DIR)) {
    console.error(`Compressed catalogs not found at ${SRC_DIR}`);
    console.error("Run: python scripts/compress-catalogs.py");
    process.exit(1);
  }

    const brands: Brand[] = await client.fetch(
    `*[_type == "brand"]{ _id, name, "slug": slug.current, "hasCatalog": defined(officialCatalogs[0].asset) }`
  );
  const bySlug = new Map(brands.map((b) => [b.slug, b]));

  let files = fs.readdirSync(SRC_DIR).filter((f) => f.toLowerCase().endsWith(".pdf")).sort();
  if (ONLY) files = files.filter((f) => ONLY.includes(f));

  // Group by target brand so a brand with several catalogs is caught up front.
  const byBrand = new Map<string, string[]>();
  const unmapped: string[] = [];
  const held: string[] = [];
  for (const f of files) {
    const entry = CATALOG_MAP[f];
    if (!entry) {
      unmapped.push(f);
      continue;
    }
    if (entry.hold) {
      held.push(`${f} — ${entry.hold}`);
      continue;
    }
    byBrand.set(entry.slug, [...(byBrand.get(entry.slug) ?? []), f]);
  }

  const plan: { file: string; brand: Brand; entry: Entry; size: number }[] = [];
  const blocked: string[] = [];

  for (const [slug, fileNames] of byBrand) {
    const brand = bySlug.get(slug);
    if (!brand) {
      blocked.push(`no brand document with slug "${slug}" (for ${fileNames.join(", ")})`);
      continue;
    }
    if (fileNames.length > 1) {
      console.log(`${brand.name} has ${fileNames.length} catalogs to upload.`);
    }
    if (brand.hasCatalog && !FORCE) {
      blocked.push(`${brand.name} already has a catalog attached (use --force to replace)`);
      continue;
    }
    for (const file of fileNames) {
      plan.push({
        file,
        brand,
        entry: CATALOG_MAP[file],
        size: fs.statSync(path.join(SRC_DIR, file)).size,
      });
    }
  }

  console.log(`${APPLY ? "UPLOADING" : "DRY RUN — nothing will be written"}\n`);
  console.log(`${"file".padEnd(28)}${"brand".padEnd(14)}${"size".padStart(7)}   title`);
  console.log("-".repeat(78));
  let total = 0;
  for (const p of plan) {
    total += p.size;
    console.log(
      `${p.file.padEnd(28)}${p.brand.name.padEnd(14)}${mb(p.size).padStart(7)}   ${p.entry.title}`
    );
    if (p.entry.renameTo)
      console.log(
        `${" ".repeat(28)}rename: ${p.brand.name} -> ${p.entry.renameTo.name}` +
          ` (slug ${p.brand.slug} -> ${p.entry.renameTo.slug})`
      );
    if (p.entry.note) console.log(`${" ".repeat(28)}note: ${p.entry.note}`);
  }
  console.log("-".repeat(78));
  console.log(`${plan.length} file(s), ${mb(total)} total\n`);

  if (unmapped.length) {
    console.log("not in CATALOG_MAP (skipped):");
    unmapped.forEach((f) => console.log(`  ${f}`));
    console.log();
  }
  if (held.length) {
    console.log("held back on purpose:");
    held.forEach((h) => console.log(`  ${h}`));
    console.log();
  }
  if (blocked.length) {
    console.log("blocked:");
    blocked.forEach((b) => console.log(`  ${b}`));
    console.log();
  }

  const brandsWithout = brands.filter((b) => !byBrand.has(b.slug)).map((b) => b.name);
  if (brandsWithout.length) {
    console.log(`no catalog supplied for: ${brandsWithout.join(", ")}\n`);
  }

  if (!APPLY) {
    console.log("Re-run with --apply to upload.");
    return;
  }

  const today = new Date().toISOString().slice(0, 10);
  let done = 0;
  for (const p of plan) {
    const full = path.join(SRC_DIR, p.file);
    if (p.entry.renameTo) {
      await client
        .patch(p.brand._id)
        .set({
          name: p.entry.renameTo.name,
          slug: { _type: "slug", current: p.entry.renameTo.slug },
        })
        .commit();
      console.log(`renamed ${p.brand.name} -> ${p.entry.renameTo.name}`);
    }
    process.stdout.write(`uploading ${p.file} (${mb(p.size)}) ... `);
    const asset = await client.assets.upload("file", fs.createReadStream(full), {
      filename: p.file,
      contentType: "application/pdf",
    });
    const arrayItem = {
      _key: Math.random().toString(36).substring(2, 9),
      _type: "file",
      asset: { _type: "reference", _ref: asset._id },
      assetTitle: p.entry.title,
      assetType: "catalog",
      releaseDate: today,
    };
    
    await client
      .patch(p.brand._id)
      .setIfMissing({ officialCatalogs: [] })
      .insert("after", "officialCatalogs[-1]", [arrayItem])
      .commit();
    done++;
    console.log(`attached to ${p.brand.name}`);
  }
  console.log(`\n${done} catalog(s) uploaded and attached.`);
}

main().catch((err) => {
  console.error("\nFailed:", err.message);
  process.exit(1);
});
