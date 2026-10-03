import { createClient } from "next-sanity";

const token = process.env.SANITY_API_TOKEN;
if (!token) {
  console.error("Error: SANITY_API_TOKEN is not set in the environment.");
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "gfwqxrd2",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-02-12",
  useCdn: false,
  token: token,
});

const BRANDS = [
  { id: "hafele", name: "Hafele", tagline: "German Architectural & Kitchen Hardware", authorized: true },
  { id: "dorset", name: "Dorset", tagline: "Digital Locks & Architectural Mortise", authorized: true },
  { id: "labacha", name: "Labacha", tagline: "Luxury Granite Sinks & Bath Mixers", authorized: true },
  { id: "godrej", name: "Godrej", tagline: "India's Trusted Smart Biometric Security", authorized: true },
  { id: "hettich", name: "Hettich", tagline: "Sliding Systems & German Drawer Fittings", authorized: true },
  { id: "kich", name: "Kich", tagline: "Architectural Hardware & Balustrade Systems", authorized: true }
];

const CATEGORIES = [
  { id: "doors", title: "Door Hardware & Locks", shortDesc: "Main door handles, biometric locks, mortise handles, heavy-duty hinges & door closers", iconName: "Lock" },
  { id: "kitchen", title: "Modular Kitchen Systems", shortDesc: "Hafele soft-close tandems, tall units, corner carousel solutions, Labacha luxury sinks", iconName: "ChefHat" },
  { id: "bath", title: "Luxury Bathroom Fittings", shortDesc: "Designer showers, brass faucets, luxury floor drains, grab bars & premium towel suites", iconName: "Bath" },
  { id: "wardrobe", title: "Wardrobe & Sliding Systems", shortDesc: "Hettich soft-close sliding fittings, pull-out trousers racks, sensor wardrobe profiles", iconName: "Layers" },
  { id: "smart", title: "Smart Security & Living", shortDesc: "Hafele Smart Living & Dorset biometric entry, WiFi app-controlled smart deadbolts", iconName: "ShieldCheck" },
  { id: "architectural", title: "Architectural & Glass Fittings", shortDesc: "Shower cubicle hinges, spider fittings, SS 304 glass brackets, luxury profile handles", iconName: "Building2" }
];

async function seed() {
  console.log("Starting seed with Project API token...");
  let cats = 0, brands = 0;

  for (const cat of CATEGORIES) {
    await client.createIfNotExists({
      _id: `category-${cat.id}`,
      _type: "category",
      name: cat.title,
      slug: { _type: "slug", current: cat.id },
      description: cat.shortDesc,
      icon: cat.iconName,
      displayOrder: CATEGORIES.indexOf(cat),
      featured: true,
    });
    cats++;
  }

  for (const brand of BRANDS) {
    await client.createIfNotExists({
      _id: `brand-${brand.id}`,
      _type: "brand",
      name: brand.name,
      slug: { _type: "slug", current: brand.id },
      description: brand.tagline,
      displayOrder: BRANDS.indexOf(brand),
      featured: brand.authorized,
    });
    brands++;
  }
  
  console.log(`Seeded ${cats} categories and ${brands} brands successfully.`);
}

seed().catch(console.error);
