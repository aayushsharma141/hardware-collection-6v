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
  console.log("Fixing validation errors...");

  // Fix homePage CTA
  await client
    .patch("homePage")
    .set({
      cta: {
        _type: "cta",
        label: "Schedule Consultation",
        type: "showroom-visit",
        destination: "#consultation",
      },
    })
    .commit();
  console.log("homePage cta fixed.");

  // For products, heroImage is required but we don't have images easily available to upload via script right now, unless we change the schema to make it optional, or provide a placeholder.
  // The user explicitly stated: "Never launch a premium showroom website with visible placeholder imagery."
  // Wait, the user said "many data or details are missing so take frome site and update it through cms".
  // Let me look at the deployed site to see if products have images.
}

main().catch(console.error);
