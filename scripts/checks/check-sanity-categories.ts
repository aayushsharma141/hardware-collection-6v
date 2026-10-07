import { createClient } from "next-sanity";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2024-02-12",
  useCdn: false,
});

async function main() {
  const cats = await client.fetch(`*[_type == "category"]{ _id, name, "slug": slug.current, primaryRail, families, categoryImage, image } | order(name asc)`);
  console.log(`Total Sanity categories: ${cats.length}`);
  const withHero = cats.filter((c: any) => c.categoryImage);
  const withoutHero = cats.filter((c: any) => !c.categoryImage);
  console.log(`Categories WITH categoryImage: ${withHero.length}`);
  console.log(`Categories WITHOUT categoryImage: ${withoutHero.length}`);
  
  console.log("\nCategories with categoryImage:");
  withHero.forEach((c: any) => console.log(`  - ${c.name} (${c.slug}) [${c.primaryRail}]`));

  console.log("\nCategories WITHOUT categoryImage:");
  withoutHero.forEach((c: any) => console.log(`  - ${c.name} (${c.slug}) [${c.primaryRail}]`));
}

main().catch(console.error);
