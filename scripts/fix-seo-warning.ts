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
  console.log("Fixing warnings...");

  // Fix siteSettings metaTitle warning (> 60 chars)
  await client
    .patch("siteSettings")
    .set({
      seo: {
        metaTitle: "Hardware Collection | Premium Architectural Hardware",
        metaDescription: "Authorized Hafele & Dorset Dealer in Sakchi, Jamshedpur. Premium architectural hardware and digital locks.",
      },
    })
    .commit();
  console.log("siteSettings SEO warning fixed.");
}

main().catch(console.error);
