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
  console.log("Fixing homePage CTA...");

  await client
    .patch("homePage")
    .set({
      cta: {
        _type: "cta",
        label: "Schedule Consultation",
        type: "showroom-visit",
        destination: "#consultation"
      },
    })
    .commit();

  console.log("homePage CTA updated!");
}

main().catch(console.error);
