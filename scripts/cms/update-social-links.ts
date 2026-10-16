import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
import path from "node:path";

function loadEnv(): Record<string, string> {
  const env: Record<string, string> = {};
  let text = "";
  try {
    text = readFileSync(path.resolve(process.cwd(), ".env.local"), "utf8").replace(/\u0000/g, "");
  } catch {}
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (match) env[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }
  return { ...env, ...(Object.fromEntries(Object.entries(process.env).filter(([, v]) => v)) as Record<string, string>) };
}

const env = loadEnv();
const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = env.NEXT_PUBLIC_SANITY_DATASET;
const token = env.SANITY_API_TOKEN;

if (!projectId || !dataset || !token) {
  console.error("Missing Sanity credentials in .env.local.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-02-12",
  useCdn: false,
  token,
  perspective: "raw",
});

const SOCIAL_DATA = {
  linkedinUrl: "https://www.linkedin.com/in/hardware-collection-96687278",
  pinterestUrl: "https://in.pinterest.com/hardwarecollectionjsr/",
  instagramUrl: "https://instagram.com/hardware.collection",
  facebookUrl: "https://www.facebook.com/hardware-collection/",
};

const SOCIAL_LINKS_ARRAY = [
  { _key: "s-linkedin", platform: "LinkedIn", url: "https://www.linkedin.com/in/hardware-collection-96687278" },
  { _key: "s-pinterest", platform: "Pinterest", url: "https://in.pinterest.com/hardwarecollectionjsr/" },
  { _key: "s-instagram", platform: "Instagram", url: "https://instagram.com/hardware.collection" },
  { _key: "s-facebook", platform: "Facebook", url: "https://www.facebook.com/hardware-collection/" },
];

async function main() {
  console.log(`Connecting to Sanity dataset: ${dataset}...`);

  // 1. Update siteSettings
  const siteSettings = await client.getDocument("siteSettings");
  if (siteSettings) {
    console.log("Found siteSettings, updating social media fields...");
    await client
      .patch("siteSettings")
      .set(SOCIAL_DATA)
      .commit();
    console.log("✅ Successfully updated siteSettings social media fields!");
  } else {
    console.warn("⚠️ siteSettings document not found in dataset.");
  }

  // Check if draft siteSettings exists
  const draftSettings = await client.getDocument("drafts.siteSettings");
  if (draftSettings) {
    console.log("Found drafts.siteSettings, updating social media fields...");
    await client
      .patch("drafts.siteSettings")
      .set(SOCIAL_DATA)
      .commit();
    console.log("✅ Successfully updated drafts.siteSettings!");
  }

  // 2. Update navigation
  const navDoc = await client.getDocument("navigation");
  if (navDoc) {
    console.log("Found navigation, updating socialLinks array...");
    await client
      .patch("navigation")
      .set({ socialLinks: SOCIAL_LINKS_ARRAY })
      .commit();
    console.log("✅ Successfully updated navigation socialLinks!");
  }

  const draftNavDoc = await client.getDocument("drafts.navigation");
  if (draftNavDoc) {
    console.log("Found drafts.navigation, updating socialLinks array...");
    await client
      .patch("drafts.navigation")
      .set({ socialLinks: SOCIAL_LINKS_ARRAY })
      .commit();
    console.log("✅ Successfully updated drafts.navigation socialLinks!");
  }

  console.log("\n🎉 All social links successfully synced to Sanity CMS!");
}

main().catch((err) => {
  console.error("Error updating social links in Sanity:", err);
  process.exit(1);
});
