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

async function main() {
  const docs = await client.fetch<Array<{ _id: string; heroHeadline?: string }>>('*[_type == "homePage"]');
  console.log(`Found ${docs.length} homePage document(s) in Sanity:`, docs.map((d) => d._id));

  const NEW_HEADLINE = "The Right Hardware\nChanges Everything.";

  for (const doc of docs) {
    console.log(`Updating ${doc._id} heroHeadline from "${doc.heroHeadline}" to "${NEW_HEADLINE}"...`);
    await client.patch(doc._id).set({ heroHeadline: NEW_HEADLINE }).commit();
    console.log(`✓ Updated ${doc._id}`);
  }
}

main().catch((err) => {
  console.error("Error updating hero headline:", err);
  process.exit(1);
});
