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

async function run() {
  const query = `*[_type == "catalogue"] {
    catalogueName,
    "hasPdf": defined(pdfFile.asset),
    "brandId": brand._ref
  }`;
  const res = await client.fetch(query);
  console.log("Total catalogues:", res.length);
  
  const invalid = res.filter((r: any) => !r.hasPdf || !r.brandId);
  if (invalid.length > 0) {
    console.error("Found invalid catalogues:", invalid);
  } else {
    console.log("All catalogues have valid PDF assets and point to a brand.");
  }
}

run().catch(console.error);
