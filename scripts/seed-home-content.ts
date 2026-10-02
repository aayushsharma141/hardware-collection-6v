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

async function seed() {
  const homePageId = "homePage";

  try {
    const existing = await client.fetch(`*[_id == $id][0]`, { id: homePageId });
    if (!existing) {
      console.log("homePage document not found.");
      return;
    }

    const valuePropositions = [
      {
        _key: "val1",
        title: "AUTHORIZED DEALER",
        description: "100% Genuine Products",
        icon: "ShieldCheck",
      },
      {
        _key: "val2",
        title: "PREMIUM BRANDS",
        description: "World-class Hardware",
        icon: "Award",
      },
      {
        _key: "val3",
        title: "EXPERT GUIDANCE",
        description: "Personalized Consultation",
        icon: "UserCheck",
      },
      {
        _key: "val4",
        title: "WIDE RANGE",
        description: "Complete Solutions",
        icon: "Package",
      },
      {
        _key: "val5",
        title: "RELIABLE SUPPORT",
        description: "After-sales Assistance",
        icon: "Headphones",
      },
      {
        _key: "val6",
        title: "VISIT SHOWROOM",
        description: "Sakchi, Jamshedpur",
        icon: "MapPin",
      },
    ];

    const materialFinishes = [
      {
        _key: "mat1",
        name: "SATIN",
        subName: "Satin Steel",
        description: "Restrained. Architectural. Timeless. Satin finish diffuses light without glare — the professional's choice for contemporary residential and commercial specification.",
        specification: "Surface: 180-grit satin brush · Sheen: Low reflectance · Application: Interior door & cabinet hardware",
      },
      {
        _key: "mat2",
        name: "BRASS",
        subName: "Living Brass",
        description: "Warm, breathing finish that deepens with time. Each handle develops a unique patina — the mark of architectural confidence and material honesty.",
        specification: "Alloy: C26000 cartridge brass · Treatment: Lacquer-free, living finish · Note: Patination expected and valued",
      },
      {
        _key: "mat3",
        name: "MATTE BLACK",
        subName: "Architectural Black",
        description: "Crisp contrast. Modern spatial definition. Matte black hardware reads as a deliberate decision — geometry made visible.",
        specification: "Process: Powder-coat or PVD black · Sheen: 0–5° gloss units · Application: Contemporary & industrial interiors",
      },
      {
        _key: "mat4",
        name: "CHROME",
        subName: "Polished Chrome",
        description: "Brilliant precision. Chrome reflects its environment without apology — for spaces designed to impress at every surface.",
        specification: "Process: Triple-layered PVD chrome · Hardness: 9H surface · Application: Bathrooms, hospitality, feature entrances",
      },
      {
        _key: "mat5",
        name: "BRONZE",
        subName: "Oil-Rubbed Bronze",
        description: "Deep heritage. Rich transitional character. Bronze hardware speaks of a space that considers its history and its future simultaneously.",
        specification: "Base: Solid brass · Treatment: Chemical patina, sealed · Application: Heritage, luxury residential, hospitality",
      },
    ];

    const legacyPillars = [
      {
        _key: "leg1",
        title: "Expert Selection",
        body: "Guidance for homeowners, architects, designers and contractors.",
      },
      {
        _key: "leg2",
        title: "Premium Showroom",
        body: "See, compare and handle every finish before you decide.",
      },
    ];

    console.log("Updating homePage...");
    await client.patch(existing._id).set({
      valuePropositions,
      materialFinishes,
      legacyYearsOfTrust: "10+",
      legacyBrandsCount: "20+",
      legacyPillars,
    }).commit();

    console.log("Seeding complete!");
  } catch (error) {
    console.error(error);
  }
}

seed();
