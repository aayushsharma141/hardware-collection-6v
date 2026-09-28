import { createClient } from "@sanity/client";
import { CATEGORIES, BRANDS, PRODUCTS } from "../src/content/fallback/catalog";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-02-28",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function main() {
  console.log("Patching Sanity documents...");
  let patchedBrands = 0;
  let patchedCategories = 0;
  let patchedProducts = 0;

  // 1. Patch Brands
  for (const brand of BRANDS) {
    const _id = `brand-${brand.id}`;
    try {
      await client
        .patch(_id)
        .set({
          name: brand.name,
          description: brand.tagline,
          authorizedStatus: brand.authorized ? "Authorized Dealer" : "Partner",
          displayOrder: BRANDS.indexOf(brand),
          featured: brand.authorized,
        })
        .commit();
      patchedBrands++;
    } catch (e: any) {
      console.warn(`Failed to patch brand ${_id}: ${e.message}`);
    }
  }

  // 2. Patch Categories
  for (const cat of CATEGORIES) {
    const _id = `category-${cat.slug}`;
    try {
      await client
        .patch(_id)
        .set({
          eyebrow: cat.eyebrow,
          cardVariant: cat.cardVariant,
          primaryRail: cat.primaryRail,
          icon: cat.iconName,
          whatsappMessage: cat.whatsappMessage,
          displayOrder: CATEGORIES.indexOf(cat),
          featured: cat.featured || false,
        })
        .commit();
      patchedCategories++;
    } catch (e: any) {
      console.warn(`Failed to patch category ${_id}: ${e.message}`);
    }
  }

  // 3. Patch Products
  for (const prod of PRODUCTS) {
    const _id = `product-${prod.id}`;
    try {
      await client
        .patch(_id)
        .set({
          catalogReference: prod.catalogReference || prod.model,
          showroomDisplay: prod.displayStatus === "Live Display",
          specifications: prod.specifications?.map(s => ({ _key: s.key, specName: s.key, specValue: s.value })) || [],
        })
        .commit();
      patchedProducts++;
    } catch (e: any) {
      console.warn(`Failed to patch product ${_id}: ${e.message}`);
    }
  }

  console.log(`Successfully patched ${patchedBrands} brands, ${patchedCategories} categories, and ${patchedProducts} products.`);
}

main().catch(console.error);
