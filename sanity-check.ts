import { createClient } from "next-sanity";

const client = createClient({
  projectId: "gfwqxrd2",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false, // get fresh data
});

async function runCheck() {
  console.log("Checking products missing 'images'...");
  const invalidProducts = await client.fetch(`
    *[_type == "product" && (!defined(images) || count(images) == 0)] {
      _id,
      name
    }
  `);
  console.log("Found " + invalidProducts.length + " products missing images:", invalidProducts);

  console.log("\nChecking brands missing 'logo' or 'description'...");
  const invalidBrands = await client.fetch(`
    *[_type == "brand" && (!defined(logo) || !defined(description) || description == "")] {
      _id,
      name,
      "missingLogo": !defined(logo),
      "missingDescription": !defined(description) || description == ""
    }
  `);
  console.log("Found " + invalidBrands.length + " brands missing logo/description:", invalidBrands);
}

runCheck().catch(console.error);
