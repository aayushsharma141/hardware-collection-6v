import { createClient } from '@sanity/client';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2023-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
});

async function run() {
  console.log("Fetching Godrej brand...");
  const godrej = await client.fetch('*[_type == "brand" && slug.current == "godrej"][0]');
  if (!godrej) {
    console.error("Godrej brand not found in Sanity");
    return;
  }
  console.log(`Found Godrej brand ID: ${godrej._id}`);

  console.log("Uploading logo...");
  const readStream = fs.createReadStream('public/brands/Godrej.png');
  const asset = await client.assets.upload('image', readStream, {
    filename: 'Godrej.png'
  });
  console.log(`Uploaded image asset ID: ${asset._id}`);

  console.log("Patching brand...");
  await client.patch(godrej._id)
    .set({
      logo: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: asset._id
        }
      }
    })
    .commit();
  console.log("Successfully updated Godrej logo in Sanity!");
}

run().catch(console.error);
