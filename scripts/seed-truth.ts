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
      showroomAddress: "1/18, Kashidih, Near Baradwari Durga Puja Maidan,\nSakchi, Jamshedpur,\nJharkhand 831001",
      showroomHours: "10:00 AM — 8:00 PM (Mon-Sun)",
      googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Hardware+Collection,+Kashidih,+Sakchi,+Jamshedpur",
      googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3677.892699292556!2d86.20885231542845!3d22.806427385061614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f5e31e5088fcc1%3A0x6fb7ebaa2fb0327e!2sKashidih%2C%20Sakchi%2C%20Jamshedpur%2C%20Jharkhand%20831001!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
    });
    console.log("✅ Site Settings seeded");

    // 2. Home Page
    await client.createOrReplace({
      _id: "homePage",
      _type: "homePage",
      heroTitle: "The Art of \nthe Finish.",
      heroSubtitle: "Architectural Hardware for Jamshedpur's Finest Homes. Where precision engineering meets unparalleled aesthetic vision.",
      legacyHeading: "Two Decades of \nArchitectural Expertise \nin Sakchi.",
      legacyDescription: "Founded by Mukesh Khandelwal, Hardware Collection has spent over 20 years curating the finest architectural hardware and modular kitchen solutions for Jamshedpur's premium residential and commercial spaces.",
      featuresHeading: "Why Choose Hardware Collection?",
      featuresDescription: "Building a home is a lifetime investment. We ensure that the hardware you touch every single day looks exquisite, functions flawlessly, and endures the test of time and climate.",
      featuresList: [
        {
          _key: "f1",
          title: "Authorized Dealer Network",
          description: "Direct partnerships with global brands like Hafele, Hettich, and Godrej. We provide full warranty support and ensure product authenticity."
        },
        {
          _key: "f2",
          title: "Expert Curation & Compatibility",
          description: "With over two decades of technical knowledge, we ensure your mortise locks fit your doors perfectly and your kitchen systems are engineered for the required weight."
        },
        {
          _key: "f3",
          title: "After-Sales Support",
          description: "We don't just sell boxes. We assist with installation diagrams, technical support, and post-purchase service coordination."
        }
      ],
      showroomHeading: "The Showroom Experience",
      showroomDescription: "Premium hardware is meant to be touched. Feel the weight of solid brass, experience the smooth glide of a soft-close drawer, and test biometric locks in person at our Sakchi showroom."
    });
    console.log("✅ Home Page seeded");

    // 3. Update Brands (Adding authorizedStatus if missing)
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
