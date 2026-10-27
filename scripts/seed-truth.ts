import { createClient } from "next-sanity";
import dotenv from "dotenv";
import path from "path";

// Load env vars from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !dataset || !token) {
  console.error("Missing Sanity environment variables.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: false,
  token,
});

async function seedTruth() {
  console.log("Seeding Sanity with business truth...");

  try {
    // 1. Site Settings: created only when the document does not exist yet, so a re-run never
    // overwrites what an editor set in Studio. The field names are the stored ones (the
    // site's getSiteSettings query renames them for the components). The map embed is left
    // out on purpose: set it in Studio.
    await client.createIfNotExists({
      _id: "siteSettings",
      _type: "siteSettings",
      businessName: "Hardware Collection",
      ownerName: "Mukesh Khandelwal",
      phone: "+91 98351 90738",
      secondaryPhone: "+91 70336 50739",
      whatsapp: "919835190738",
      email: "hardwarecollectionjsr@gmail.com",
      defaultWhatsappMessage: "Hi Hardware Collection, I would like to enquire about your architectural hardware collections.",
      address: "1/18, Kashidih, Near Durga Puja Maidan,\nSakchi, Jamshedpur,\nJharkhand 831001",
      openingHours: "Wed - Mon: 10:00 AM - 8:00 PM\nTuesday: 10:00 AM - 2:00 PM",
      googleMapsUrl: "https://maps.app.goo.gl/6qokJfpuQgfNwqZK9"
    });
    console.log("✅ Site Settings checked (created only if missing)");

    // 2. Update Brands (Adding authorizedStatus if missing)
    const brands = await client.fetch(`*[_type == "brand"]`);
    for (const brand of brands) {
      if (!brand.authorizedStatus) {
        await client.patch(brand._id).set({ authorizedStatus: "Authorized Partner" }).commit();
        console.log(`✅ Updated brand ${brand.name} with authorizedStatus`);
      }
    }

    console.log("🚀 All business truth seeded successfully!");
  } catch (error) {
    console.error("Error seeding:", error);
  }
}

seedTruth();
