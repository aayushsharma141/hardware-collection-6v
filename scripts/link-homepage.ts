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
  console.log("Fetching reference IDs...");

  const brands = await client.fetch(`*[_type == "brand"]{_id, name}`);
  const products = await client.fetch(`*[_type == "product" && featured == true]{_id, name}`);
  const categories = await client.fetch(`*[_type == "category" && featured == true]{_id, name}`);
  const testimonials = await client.fetch(`*[_type == "testimonial"]{_id, customerName}`);

  console.log(`Found ${brands.length} brands, ${products.length} featured products, ${categories.length} featured categories, ${testimonials.length} testimonials.`);

  if (brands.length === 0 && products.length === 0) {
    console.log("No data found, skipping update.");
    return;
  }

  // We want to pick 4-6 brands, 3-6 categories, 4-8 products, 2-6 testimonials
  const trustedBrands = brands.slice(0, 6).map((b: any, i: number) => ({ _type: "reference", _ref: b._id, _key: `brand-${i}` }));
  const featuredProducts = products.slice(0, 8).map((p: any, i: number) => ({ _type: "reference", _ref: p._id, _key: `prod-${i}` }));
  const featuredCategories = categories.slice(0, 6).map((c: any, i: number) => ({ _type: "reference", _ref: c._id, _key: `cat-${i}` }));
  const testimonialRefs = testimonials.slice(0, 6).map((t: any, i: number) => ({ _type: "reference", _ref: t._id, _key: `test-${i}` }));

  await client
    .patch("homePage")
    .set({
      trustedBrands,
      featuredProducts,
      featuredCategories,
      testimonials: testimonialRefs.length > 0 ? testimonialRefs : undefined,
    })
    .commit();

  console.log("homePage updated with references!");
}

main().catch(console.error);
