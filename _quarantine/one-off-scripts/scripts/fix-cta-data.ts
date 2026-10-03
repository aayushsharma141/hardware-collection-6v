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
  console.log("Patching homePage CTA objects...");

  await client
    .patch("homePage")
    .set({
      primaryCta: {
        _type: "cta",
        label: "Explore Collections",
        destination: "/collections",
        type: "internal"
      },
      secondaryCta: {
        _type: "cta",
        label: "WhatsApp Us",
        destination: "https://wa.me/919835190738",
        type: "external"
      }
    })
    .commit();

  console.log("homePage updated with CTA objects!");
}

main().catch(console.error);
