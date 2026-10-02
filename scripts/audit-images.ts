import { createClient } from "@sanity/client";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-03-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function main() {
  // Check categories
  const cats = await client.fetch(`*[_type == "category"] { _id, name, "slug": slug.current, "imageUrl": categoryImage.asset->url } | order(name asc)`);
  console.log("=== CATEGORIES ===");
  cats.forEach((c: any) => console.log(`[${c.slug}] ${c.name}: ${c.imageUrl ? "HAS IMAGE" : "NO IMAGE"}`));

  // Check products
  const prods = await client.fetch(`*[_type == "product" && featured == true] { _id, name, "slug": slug.current, "imageUrl": heroImage.asset->url, "brandName": brand->name }`);
  console.log("\n=== FEATURED PRODUCTS ===");
  prods.forEach((p: any) => console.log(`[${p.slug}] ${p.brandName} - ${p.name}: ${p.imageUrl ? "HAS IMAGE" : "NO IMAGE"}`));
  
  // Check brands with logos
  const brands = await client.fetch(`*[_type == "brand"] { _id, name, "slug": slug.current, "logoUrl": logo.asset->url } | order(name asc)`);
  console.log("\n=== BRANDS ===");
  brands.forEach((b: any) => console.log(`[${b.slug}] ${b.name}: ${b.logoUrl ? "HAS LOGO" : "NO LOGO"}`));
}
main().catch(console.error);
