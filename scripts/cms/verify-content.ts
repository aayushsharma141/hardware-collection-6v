import { createClient } from "next-sanity";
import path from "node:path";

try {
  process.loadEnvFile(path.resolve(process.cwd(), ".env.local"));
} catch {
  // CI and production provide the environment directly.
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !dataset || !token) {
  console.error(
    "Missing Sanity configuration. Set NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET and SANITY_API_TOKEN before running this check."
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-02-12",
  useCdn: false,
  token,
  perspective: "published",
});

type ContentHealth = {
  homePage: number;
  heroManager: number;
  siteSettings: number;
  navigation: number;
  products: number;
  productsMissingIdentity: number;
  productsMissingImages: number;
  brands: number;
  categories: number;
  authorizedBrandRefs: number;
  catalogues: number;
  offers: number;
  testimonials: number;
};

async function main() {
  const health = await client.fetch<ContentHealth>(`{
    "homePage": count(*[_type == "homePage" && _id == "homePage"]),
    "heroManager": count(*[_type == "heroManager" && _id == "heroManager"]),
    "siteSettings": count(*[_type == "siteSettings" && _id == "siteSettings"]),
    "navigation": count(*[_type == "navigation" && _id == "navigation"]),
    "products": count(*[_type == "product"]),
    "productsMissingIdentity": count(*[
      _type == "product" &&
      (!defined(name) || !defined(slug.current) || !defined(brand._ref) || !defined(category._ref))
    ]),
    "productsMissingImages": count(*[
      _type == "product" &&
      !defined(heroImage.asset) &&
      count(images[defined(asset)]) == 0
    ]),
    "brands": count(*[_type == "brand"]),
    "categories": count(*[_type == "category"]),
    "authorizedBrandRefs": count(*[_type == "siteSettings" && _id == "siteSettings"][0].authorizedBrands),
    "catalogues": count(*[_type == "catalogue"]),
    "offers": count(*[_type == "offer"]),
    "testimonials": count(*[_type == "testimonial"])
  }`);

  console.log(`Sanity content health: project=${projectId}, dataset=${dataset}, perspective=published`);
  console.table(health);

  const missingSingletons = ([
    ["homePage", health.homePage],
    ["heroManager", health.heroManager],
    ["siteSettings", health.siteSettings],
    ["navigation", health.navigation],
  ] as const).filter(([, count]) => count !== 1);

  const errors: string[] = [];
  if (missingSingletons.length) {
    errors.push(
      `Expected exactly one published fixed-ID singleton document for: ${missingSingletons
        .map(([name, count]) => `${name} (found ${count})`)
        .join(", ")}.`
    );
  }
  if (health.productsMissingIdentity > 0) {
    errors.push(`${health.productsMissingIdentity} published product(s) are missing name, slug, brand or category.`);
  }
  if (health.brands === 0) errors.push("No published brand documents found.");
  if (health.categories === 0) errors.push("No published category documents found.");
  if (health.authorizedBrandRefs === 0) errors.push("Business Settings has no authorized brand references; refusing to publish unverified brand claims.");
  if (health.catalogues === 0) errors.push("No published catalogue documents found; view-only catalogue acceptance cannot pass.");
  if (health.products === 0) errors.push("No published products found; the public catalogue would rely on fallback content.");

  if (health.productsMissingImages > 0) {
    console.warn(
      `WARNING: ${health.productsMissingImages} published product(s) have no hero image or legacy image asset. Review before publishing them prominently.`
    );
  }

  if (errors.length) {
    for (const error of errors) console.error(`FAIL: ${error}`);
    process.exitCode = 1;
    return;
  }

  console.log("PASS: required Sanity singletons and core catalogue references are present.");
}

main().catch((error: unknown) => {
  console.error("Sanity content verification failed:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
