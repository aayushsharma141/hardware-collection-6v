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
  const query = `*[_type == "brand" && brandName == "Blum"][0] {
    "catalogues": *[_type == "catalogue" && references(^._id)] | order(_createdAt asc) { _id, catalogueName, "title": catalogueName, version, releaseDate, "size": pdfFile.asset->size, "pdfUrl": pdfFile.asset->url, "coverUrl": coverImage.asset->url }
  }`;
  const res = await client.fetch(query);
  console.log(JSON.stringify(res, null, 2));
}

run().catch(console.error);
