import { createClient } from "@sanity/client";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-03-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function main() {
  console.log("Uploading local images to Sanity...");

  const heroBgPath = path.resolve(process.cwd(), "public/Hardware Collection/hero_bg.png");
  const exteriorPath = path.resolve(process.cwd(), "public/Hardware Collection/hardware_collection_sakchi_shop_exterior_view.png");
  const interiorPath = path.resolve(process.cwd(), "public/Hardware Collection/hardware_collection_sakchi_shop_interior_view.jpeg");
  
  const heroAsset = await client.assets.upload('image', fs.createReadStream(heroBgPath), { filename: 'hero_bg.png' });
  const legacyAsset = await client.assets.upload('image', fs.createReadStream(exteriorPath), { filename: 'exterior_view.png' });
  const galleryAsset = await client.assets.upload('image', fs.createReadStream(interiorPath), { filename: 'interior_view.jpeg' });

  console.log("Uploaded images!");
  console.log("Patching homePage...");

  await client
    .patch("homePage")
    .set({
      heroImageDesktop: {
        _type: "image",
        asset: { _type: "reference", _ref: heroAsset._id }
      },
      heroImageMobile: {
        _type: "image",
        asset: { _type: "reference", _ref: heroAsset._id }
      },
      legacyShowroomImage: {
        _type: "image",
        asset: { _type: "reference", _ref: legacyAsset._id }
      },
      showroomGallery: [
        { _type: "image", _key: "gal1", asset: { _type: "reference", _ref: interiorPath ? galleryAsset._id : "" } },
        { _type: "image", _key: "gal2", asset: { _type: "reference", _ref: legacyAsset._id } }
      ]
    })
    .commit();

  console.log("homePage updated with images!");
}

main().catch(console.error);
