import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import { createClient } from "next-sanity";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-02-12",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function main() {
  const doc = await client.fetch<any>(`*[_type == "heroManager"][0]`);
  console.log("heroManager _id:", doc?._id);
  console.log("\n--- homeHero slides ---");
  for (const s of doc?.homeHero || []) {
    console.log({
      _key: s._key,
      slideType: s.slideType,
      title: s.title,
      subtitle: s.subtitle,
      link: s.link,
      position: s.position,
      hasImageDesktop: Boolean(s.imageDesktop?.asset),
      hasImageMobile: Boolean(s.imageMobile?.asset),
    });
  }
  console.log("\n--- collectionHero slides ---");
  for (const s of doc?.collectionHero || []) {
    console.log({
      _key: s._key,
      slideType: s.slideType,
      title: s.title,
      subtitle: s.subtitle,
      link: s.link,
      position: s.position,
      hasImageDesktop: Boolean(s.imageDesktop?.asset),
      hasImageMobile: Boolean(s.imageMobile?.asset),
    });
  }
}

main().catch(console.error);
