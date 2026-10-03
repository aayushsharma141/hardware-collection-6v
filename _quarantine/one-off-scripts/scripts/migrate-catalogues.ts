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

async function migrateCatalogs() {
  const brands = await client.fetch(`*[_type == "brand" && defined(officialCatalogs)]`);
  console.log(`Found ${brands.length} brands with officialCatalogs`);
  
  // fetch one category to use as fallback
  const fallbackCat = await client.fetch(`*[_type == "category"][0]`);

  for (const brand of brands) {
    if (!brand.officialCatalogs || !Array.isArray(brand.officialCatalogs)) continue;
    
    // Check if we can find a popular category for this brand
    let categoryRef = fallbackCat ? { _type: "reference", _ref: fallbackCat._id } : undefined;
    if (brand.popularCategories && brand.popularCategories.length > 0) {
      categoryRef = brand.popularCategories[0];
    }
    
    for (const catalog of brand.officialCatalogs) {
      if (!catalog.asset || !catalog.asset._ref) continue;
      
      const title = catalog.assetTitle || `${brand.brandName || brand.name} Catalogue`;
      
      // Idempotency check: don't create if a catalogue for this brand with this title already exists
      const existing = await client.fetch(
        `count(*[_type == "catalogue" && brand._ref == $brandId && catalogueName == $title])`,
        { brandId: brand._id, title }
      );
      
      if (existing === 0) {
        const doc = {
          _type: "catalogue",
          catalogueName: title,
          brand: {
            _type: "reference",
            _ref: brand._id
          },
          category: categoryRef,
          pdfFile: {
            _type: "file",
            asset: catalog.asset
          },
          releaseDate: catalog.releaseDate
        };
        
        console.log(`Creating catalogue: ${doc.catalogueName}`);
        await client.create(doc);
      } else {
        console.log(`Skipping catalogue (already exists): ${title}`);
      }
    }
  }
}

migrateCatalogs().catch(console.error);
