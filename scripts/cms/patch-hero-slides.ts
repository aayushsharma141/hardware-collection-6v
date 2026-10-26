import { createClient } from "next-sanity";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-02-12",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function main() {
  const doc = await client.fetch<{ _id: string; homeHero: any[]; collectionHero: any[] }>(
    `*[_type == "heroManager"][0]`
  );

  if (!doc) {
    console.error("heroManager document not found");
    return;
  }

  const slideLinks: Record<string, string> = {
    "slide-1": "/collections",
    "slide-2": "/catalogues",
    "slide-3": "/collections#smart-security",
    "slide-4": "/#showroom",
  };

  const fixSlides = (slides: any[]) =>
    slides.map((s, idx) => ({
      _key: s._key,
      _type: "heroSlide",
      slideType: "custom",
      title: s.title,
      subtitle: s.subtitle,
      link: s.link || slideLinks[s._key] || (idx === 0 ? "/collections" : idx === 1 ? "/catalogues" : idx === 2 ? "/collections#smart-security" : "/#showroom"),
      imageDesktop: s.imageDesktop || s.image,
      imageMobile: s.imageMobile || s.imageDesktop || s.image,
      position: s.position ?? (idx + 1),
    }));

  const updatedHome = fixSlides(doc.homeHero);
  const updatedCollection = fixSlides(doc.collectionHero);

  await client
    .patch(doc._id)
    .set({
      homeHero: updatedHome,
      collectionHero: updatedCollection,
    })
    .commit();

  console.log("✓ Successfully patched heroManager in Sanity with slideType, imageDesktop, and imageMobile!");
}

main().catch(console.error);
