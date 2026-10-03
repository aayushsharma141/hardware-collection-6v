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

async function checkCatalogs() {
  const brands = await client.fetch(`*[_type == "brand" && defined(officialCatalogs)]`);
  console.log(`Found ${brands.length} brands with officialCatalogs`);
  if (brands.length > 0) {
    console.log(JSON.stringify(brands[0].officialCatalogs, null, 2));
  }
}

checkCatalogs().catch(console.error);
