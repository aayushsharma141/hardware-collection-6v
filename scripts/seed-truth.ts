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
    // 1. Site Settings
    await client.createOrReplace({
      _id: "siteSettings",
      _type: "siteSettings",
      primaryPhone: "+91 98351 90738",
      whatsappNumber: "919835190738",
      defaultWhatsappMessage: "Hi Hardware Collection, I would like to inquire about your architectural hardware collections.",
      storeEmail: "",
      showroomAddress: "1/18, Kashidih, Near Durga Puja Maidan,\nSakchi, Jamshedpur,\nJharkhand 831001",
      showroomHours: "10:00 AM — 8:00 PM (Mon-Sun)",
      googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Hardware+Collection,+Kashidih,+Sakchi,+Jamshedpur",
      googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3677.892699292556!2d86.20885231542845!3d22.806427385061614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f5e31e5088fcc1%3A0x6fb7ebaa2fb0327e!2sKashidih%2C%20Sakchi%2C%20Jamshedpur%2C%20Jharkhand%20831001!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
    });
    console.log("✅ Site Settings seeded");

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
