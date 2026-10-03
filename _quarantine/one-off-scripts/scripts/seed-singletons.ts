import { createClient } from "@sanity/client";
import dotenv from "dotenv";
import { SHOWROOM_HOURS_FALLBACK } from "../src/lib/config";

dotenv.config({ path: ".env.local" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-03-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function main() {
  console.log("Seeding Singletons...");

  try {
    // 1. Seed siteSettings
    await client.createOrReplace({
      _id: "siteSettings",
      _type: "siteSettings",
      businessName: "Hardware Collection",
      ownerName: "Mukesh Khandelwal",
      phone: "+91 98351 90738",
      whatsapp: "919835190738",
      email: "info@hardwarecollection.in",
      address: "1/18, Kashidih, Near Durga Puja Maidan,\nSakchi, Jamshedpur, Jharkhand 831001",
      openingHours: SHOWROOM_HOURS_FALLBACK,
      defaultWhatsappMessage: "Hi Hardware Collection, I would like to connect with your consultation desk regarding architectural hardware.",
      googleMapsUrl: "https://maps.app.goo.gl/6qokJfpuQgfNwqZK9",
      googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m3!1d3677.7289568771146!2d86.2081123!3d22.8124967!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f5e31754020a67%3A0x6b7724fdbcb0e46a!2sHardware%20Collection!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
      seo: {
        metaTitle: "Hardware Collection | Premium Architectural Hardware in Jamshedpur",
        metaDescription: "Authorized Hafele & Dorset Dealer in Sakchi, Jamshedpur. Premium architectural hardware and digital locks.",
      }
    });
    console.log("Seeded siteSettings");

    // 2. Seed homePage
    await client.createOrReplace({
      _id: "homePage",
      _type: "homePage",
      heroEyebrow: "PREMIUM ARCHITECTURAL HARDWARE",
      heroHeadline: "Where Vision Meets Material",
      heroDescription: "Discover Jamshedpur's most comprehensive collection of architectural hardware, digital locks, and premium kitchen solutions. Trusted by leading architects and homeowners for over 10 years.",
      primaryCta: "Explore Collections",
      secondaryCta: "Visit Showroom",
      legacyYearsOfTrust: 10,
      legacyBrandsCount: 20,
      valuePropositions: [
        { _key: "val1", title: "AUTHORIZED DEALER", description: "100% Genuine Products", icon: "ShieldCheck" },
        { _key: "val2", title: "PREMIUM BRANDS", description: "World-class Hardware", icon: "Award" },
        { _key: "val3", title: "EXPERT GUIDANCE", description: "Personalized Consultation", icon: "UserCheck" },
        { _key: "val4", title: "WIDE RANGE", description: "Complete Solutions", icon: "Package" },
        { _key: "val5", title: "RELIABLE SUPPORT", description: "After-sales Assistance", icon: "Headphones" },
        { _key: "val6", title: "VISIT SHOWROOM", description: "Sakchi, Jamshedpur", icon: "MapPin" }
      ],
      materialFinishes: [
        {
          _key: "mat1",
          name: "SATIN",
          subName: "Satin Steel",
          description: "Restrained. Architectural. Timeless. Satin finish diffuses light without glare.",
          specification: "Surface: 180-grit satin brush · Sheen: Low reflectance",
        },
        {
          _key: "mat2",
          name: "BRASS",
          subName: "Living Brass",
          description: "Warm, breathing finish that deepens with time. Each handle develops a unique patina.",
          specification: "Alloy: C26000 cartridge brass · Treatment: Lacquer-free",
        }
      ],
      legacyPillars: [
        { _key: "leg1", title: "Expert Selection", description: "Guidance for homeowners, architects, designers and contractors." },
        { _key: "leg2", title: "Premium Showroom", description: "See, compare and handle every finish before you decide." }
      ],
      ctaHeading: "Ready to Transform Your Space?",
      ctaDescription: "Visit our Sakchi showroom to experience our collections in person.",
      cta: {
        text: "Schedule Consultation",
        link: "#consultation"
      }
    });
    console.log("Seeded homePage");

    // 3. Seed Navigation
    await client.createOrReplace({
      _id: "navigation",
      _type: "navigation",
      announcementBar: "",
      mainMenu: [
        { _key: "m1", label: "Collections", path: "/collections" },
        { _key: "m2", label: "Brands & Catalogs", path: "/catalogs" }
      ],
      footerLegalLinks: [
        { _key: "f1", label: "Privacy Policy", path: "/privacy" },
        { _key: "f2", label: "Terms & Conditions", path: "/terms" }
      ],
      socialLinks: [
        { _key: "s1", platform: "Instagram", url: "https://instagram.com/hardwarecollectionjsr" },
        { _key: "s2", platform: "Facebook", url: "https://facebook.com/hardwarecollectionjsr" }
      ]
    });
    console.log("Seeded navigation");

    console.log("Singletons seeded successfully. This should resolve the validation errors.");
  } catch (err: any) {
    console.error("Error seeding singletons:", err.message);
  }
}

main();
