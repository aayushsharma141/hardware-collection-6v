import { createClient } from "next-sanity";
import * as fs from "fs";
import * as path from "path";

// Tolerant .env.local read - handles mixed encoding
function loadEnv(): Record<string, string> {
  const file = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(file)) return {};
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
});

async function main() {
  console.log("Fetching brands with officialCatalog...");
  const brands = await client.fetch(
    `*[_type == "brand" && defined(officialCatalog)] {
      _id,
      name,
      officialCatalog
    }`
  );

  console.log(`Found ${brands.length} brands to migrate.`);

  const transaction = client.transaction();
  for (const brand of brands) {
    // Generate a unique key for the array item
    const arrayItem = {
      _key: Math.random().toString(36).substring(2, 9),
      ...brand.officialCatalog,
    };
    
    transaction.patch(brand._id, (p) =>
      p
        .setIfMissing({ officialCatalogs: [] })
        .insert("after", "officialCatalogs[-1]", [arrayItem])
        .unset(["officialCatalog"])
        .set({ catalogType: "upload" })
    );
    console.log(`Queued migration for ${brand.name}`);
  }

  // Also handle brands that only have a URL
  const urlBrands = await client.fetch(
    `*[_type == "brand" && !defined(officialCatalog) && defined(officialCatalogUrl) && !defined(catalogType)] {
      _id,
      name
    }`
  );
  
  for (const brand of urlBrands) {
    transaction.patch(brand._id, (p) =>
      p.set({ catalogType: "url" })
    );
    console.log(`Queued catalogType=url for ${brand.name}`);
  }

  if (brands.length > 0 || urlBrands.length > 0) {
    console.log("Committing transaction...");
    await transaction.commit();
    console.log("Migration complete.");
  } else {
    console.log("Nothing to migrate.");
  }
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
