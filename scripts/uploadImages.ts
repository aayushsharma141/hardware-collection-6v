import { createClient } from "next-sanity";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { config } from "dotenv";
config({ path: path.join(__dirname, "../.env.local") });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-03-22",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  perspective: "published",
});

async function uploadImage(filePath: string) {
  const fullPath = path.join(__dirname, "../public", filePath);
  if (!fs.existsSync(fullPath)) {
    console.log("File not found:", fullPath);
    return null;
  }
  const stream = fs.createReadStream(fullPath);
  const asset = await client.assets.upload('image', stream, {
    filename: path.basename(fullPath)
  });
  console.log("Uploaded:", filePath, "->", asset._id);
  return {
    _type: "image",
    asset: {
      _type: "reference",
      _ref: asset._id
    }
  };
}

async function main() {
  console.log("Uploading images...");
  
  // HomePage images
  const exterior = await uploadImage("/cinema/showroom/exterior.png");
  const interior = await uploadImage("/cinema/showroom/interior.png");
  const consultation = await uploadImage("/cinema/consultation/consultation-editorial-v2.jpg");
  
  // SiteSettings images
  const mainLogo = await uploadImage("/Hardware Collection/HQ_LOGO_SMB-removebg-preview (2).png");
  
  console.log("Updating homePage...");
  const homePageResult = await client
    .patch("homePage")
    .setIfMissing({ _type: "homePage" })
    .set({
      showroomExteriorImage: exterior,
      showroomInteriorImage: interior,
      consultationImage: consultation
    })
    .commit();
  console.log("homePage updated:", homePageResult._id);

  console.log("Updating siteSettings...");
  const siteSettingsResult = await client
    .patch("siteSettings")
    .setIfMissing({ _type: "siteSettings" })
    .set({
      mainLogo: mainLogo
    })
    .commit();
  console.log("siteSettings updated:", siteSettingsResult._id);
}

main().catch(console.error);
