import { createClient } from "next-sanity";
import dotenv from "dotenv";
import path from "path";
import { SPACES } from "../src/content/fallback/spaces";
import { CANONICAL_BRANDS as BRANDS } from "../src/content/fallback/brands";
import { CATEGORIES } from "../src/content/fallback/catalog";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !dataset || !token) {
  console.error(
    "Missing Sanity environment variables. Check .env.local for NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_TOKEN."
  );
  process.exit(1);
}

const isDryRun = process.argv.includes("--dry-run");
const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-02-12",
  useCdn: false,
  token,
});

const FEATURED_BRAND_IDS = [
  "hafele",
  "dorset",
  "godrej",
  "labacha",
  "hettich",
  "kich",
];

async function resolveCategoryRefs(slugs: string[]) {
  const docs: Array<{ _id: string; slug: string }> = await client.fetch(
    `*[_type == "category" && slug.current in $slugs]{ _id, "slug": slug.current }`,
    { slugs }
  );
  const found = new Set(docs.map((d) => d.slug));
  for (const slug of slugs) {
    if (!found.has(slug)) {
      console.warn(
        `  WARNING: category slug "${slug}" not found in Sanity — skipping, not fabricating a reference.`
      );
    }
  }
  return docs.map((d) => ({ _type: "reference" as const, _ref: d._id }));
}

async function seedSpaces() {
  console.log(
    `\nSeeding ${SPACES.length} spaces (D-02)${isDryRun ? " [DRY RUN]" : ""}...`
  );
  for (const space of SPACES) {
    const refs = await resolveCategoryRefs(space.linkedCategorySlugs);
    const doc = {
      _id: `space-${space.slug}`,
      _type: "space" as const,
      name: space.name,
      slug: { _type: "slug" as const, current: space.slug },
      description: space.description,
      displayOrder: space.displayOrder,
      linkedCategories: refs,
    };
    if (isDryRun) {
      console.log(
        `  [dry-run] would createIfNotExists ${doc._id} — ${refs.length}/${space.linkedCategorySlugs.length} category refs resolved`
      );
    } else {
      await client.createIfNotExists(doc);
      console.log(
        `  seeded ${doc._id} — ${refs.length}/${space.linkedCategorySlugs.length} category refs resolved`
      );
    }
  }
}

async function seedBrands() {
  console.log(
    `\nSeeding ${BRANDS.length} brands (D-26 canonical roster)${isDryRun ? " [DRY RUN]" : ""}...`
  );
  for (let index = 0; index < BRANDS.length; index++) {
    const brand = BRANDS[index];
    const doc = {
      _id: `brand-${brand.id}`,
      _type: "brand" as const,
      name: brand.name,
      slug: { _type: "slug" as const, current: brand.id },
      description: brand.tagline || brand.description,
      authorizedStatus: "Authorized Dealer",
      displayOrder: index,
      featured: FEATURED_BRAND_IDS.includes(brand.id),
    };
    if (isDryRun) {
      console.log(
        `  [dry-run] would createIfNotExists ${doc._id} (featured: ${doc.featured})`
      );
    } else {
      await client.createIfNotExists(doc);
      console.log(`  seeded ${doc._id} (featured: ${doc.featured})`);
    }
  }
}

async function seedCategories() {
  console.log(
    `\nSeeding ${CATEGORIES.length} categories (D-10/D-13)${isDryRun ? " [DRY RUN]" : ""}...`
  );
  for (let index = 0; index < CATEGORIES.length; index++) {
    const cat = CATEGORIES[index];
    const doc = {
      _id: `category-${cat.slug}`,
      _type: "category" as const,
      name: cat.title,
      slug: { _type: "slug" as const, current: cat.slug },
      eyebrow: cat.eyebrow,
      description: cat.shortDesc,
      overview: cat.overview,
      cardVariant: cat.cardVariant,
      primaryRail: cat.primaryRail,
      suitableFor: cat.suitableFor,
      keyFeatures: cat.keyFeatures,
      icon: cat.iconName,
      status: cat.status,
      whatsappMessage: cat.whatsappMessage,
      displayOrder: index,
      featured: cat.featured ?? false,
    };
    if (isDryRun) {
      console.log(`  [dry-run] would createIfNotExists ${doc._id}`);
    } else {
      await client.createIfNotExists(doc);
      console.log(`  seeded ${doc._id}`);
    }
  }
}

async function main() {
  await seedCategories();
  await seedSpaces();
  await seedBrands();
  console.log(
    isDryRun
      ? "\nDry run complete — no documents written. Re-run without --dry-run to write to Sanity."
      : "\nSeed complete. Verify the new space and brand documents in Sanity Studio at /studio."
  );
}

main().catch((error) => {
  console.error("Seed script failed:", error);
  process.exit(1);
});
