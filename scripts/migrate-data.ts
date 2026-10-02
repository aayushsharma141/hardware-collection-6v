import { createClient } from "@sanity/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-03-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function migrateData() {
  console.log("Fetching brand documents...");
  const brands = await client.fetch(`*[_type == "brand"]`);
  
  console.log(`Found ${brands.length} brand documents.`);
  
  for (const brand of brands) {
    const patch = client.patch(brand._id);
    let shouldPatch = false;
    
    if (brand.name && !brand.brandName) {
      patch.set({ brandName: brand.name });
      shouldPatch = true;
    }
    
    if (brand.description && !brand.brandPositioning) {
      patch.set({ brandPositioning: brand.description });
      shouldPatch = true;
    }
    
    if (shouldPatch) {
      console.log(`Patching brand: ${brand.name}`);
      await patch.commit();
    }
  }
  
  console.log("Brands migration complete.");
  
  console.log("Fixing homePage document...");
  const homePage = await client.fetch(`*[_type == "homePage"][0]`);
  if (homePage) {
    const patch = client.patch(homePage._id);
    let shouldPatchHome = false;
    
    if (typeof homePage.legacyYearsOfTrust === 'string') {
      const num = parseInt(homePage.legacyYearsOfTrust.replace(/[^0-9]/g, ''), 10);
      if (!isNaN(num)) {
        patch.set({ legacyYearsOfTrust: num });
        shouldPatchHome = true;
      }
    }
    
    if (typeof homePage.legacyBrandsCount === 'string') {
      const num = parseInt(homePage.legacyBrandsCount.replace(/[^0-9]/g, ''), 10);
      if (!isNaN(num)) {
        patch.set({ legacyBrandsCount: num });
        shouldPatchHome = true;
      }
    }
    
    if (shouldPatchHome) {
      console.log("Patching homePage stats to numbers...");
      await patch.commit();
    }
  }

  console.log("Migration finished successfully.");
}

migrateData().catch(console.error);
