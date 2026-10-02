import { createClient } from "@sanity/client";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config({ path: ".env.local" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-03-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function uploadImage(filePath: string) {
  const fullPath = path.resolve(process.cwd(), "public", filePath.replace(/^\//, ""));
  if (!fs.existsSync(fullPath)) {
    console.warn(`File not found: ${fullPath}`);
    return undefined;
  }
  const stream = fs.createReadStream(fullPath);
  const asset = await client.assets.upload("image", stream, {
    filename: path.basename(fullPath),
  });
  return asset._id;
}

async function seed() {
  const homePageId = "homePage";

  try {
    const existing = await client.fetch(`*[_id == $id][0]`, { id: homePageId });
    if (!existing) {
      console.log("homePage document not found.");
      return;
    }

    console.log("Uploading slide 1 images...");
    const s1Bg = await uploadImage("/cinema/hero/HC-01-HERO-01.png");
    const s1Prod = await uploadImage("/cinema/hero/HC-01-HERO-02.png");
    
    console.log("Uploading slide 2 images...");
    const s2Bg = await uploadImage("/cinema/showroom/interior.png");
    const s2Prod = await uploadImage("/cinema/hero/HC-01-HERO-03.png");

    console.log("Uploading slide 3 images...");
    const s3Bg = await uploadImage("/cinema/categories/HC-03-DOORS.png");
    const s3Prod = await uploadImage("/cinema/materials/HC-04-PVD-BRASS.png");

    const heroSlides = [
      {
        _key: "slide1",
        eyebrow: "ARCHITECTURAL HARDWARE EXPERTS · 10+ YEARS",
        title: "The Art of\nthe Finish.",
        description:
          "Premium architectural hardware and modular solutions, curated for contemporary spaces. Official partner for Häfele, Dorset, Labacha, Godrej & Hettich in Sakchi.",
        primaryCta: "Explore Collections",
        ctaTarget: "/collections",
        image: s1Bg ? { _type: "image", asset: { _type: "reference", _ref: s1Bg } } : undefined,
        productImage: s1Prod ? { _type: "image", asset: { _type: "reference", _ref: s1Prod } } : undefined,
      },
      {
        _key: "slide2",
        eyebrow: "LIVE SHOWROOM EXPERIENCE",
        title: "Touch Before\nYou Decide.",
        description:
          "Experience German soft-close drawers, live biometric lock demos, and full-scale luxury kitchen setups at our Sakchi flagship showroom.",
        primaryCta: "Explore Collections",
        ctaTarget: "/collections",
        image: s2Bg ? { _type: "image", asset: { _type: "reference", _ref: s2Bg } } : undefined,
        productImage: s2Prod ? { _type: "image", asset: { _type: "reference", _ref: s2Prod } } : undefined,
      },
      {
        _key: "slide3",
        eyebrow: "CURATED SELECTION · SAKCHI",
        title: "Curated For\nDiscriminating Spaces.",
        description:
          "Biometric security, German kitchen systems, precision door handles, and bathroom accessories engineered for tactile longevity.",
        primaryCta: "Explore Collections",
        ctaTarget: "/collections",
        image: s3Bg ? { _type: "image", asset: { _type: "reference", _ref: s3Bg } } : undefined,
        productImage: s3Prod ? { _type: "image", asset: { _type: "reference", _ref: s3Prod } } : undefined,
      },
    ];

    console.log("Patching homePage...");
    await client
      .patch(homePageId)
      .set({ heroSlides })
      // Unset the old fields
      .unset(["heroEyebrow", "heroHeadline", "heroDescription", "heroImageDesktop", "heroImageMobile"])
      .commit();

    console.log("Successfully seeded heroSlides to Sanity!");
  } catch (error) {
    console.error("Error seeding heroSlides:", error);
  }
}

seed();
