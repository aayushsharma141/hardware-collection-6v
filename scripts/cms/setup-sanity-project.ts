import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Parse .env.local
const envPath = resolve(process.cwd(), '.env.local');
const envContent = readFileSync(envPath, 'utf8');
const env: Record<string, string> = {};
for (const line of envContent.split('\n')) {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] || '';
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    env[match[1]] = value.trim();
  }
}

const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'hoghkg00';
const token = env.SANITY_API_TOKEN;

if (!token) {
  console.error('No SANITY_API_TOKEN found in .env.local');
  process.exit(1);
}

const origins = [
  'https://www.hardwarecollection.co',
  'https://hardwarecollection.co',
  'https://hc-demo-five.vercel.app',
  'https://hc-demo-ten.vercel.app',
  'https://hc-demo.vercel.app',
  'http://localhost:3000',
  'http://localhost:3333',
];

async function main() {
  console.log(`Configuring Sanity project: ${projectId}`);

  // 1. Manage CORS Origins
  console.log('\n--- 1. CORS Origins ---');
  const corsRes = await fetch(`https://api.sanity.io/v2021-06-07/projects/${projectId}/cors`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const existingCors: any[] = await corsRes.json();
  const existingOrigins = new Set(existingCors.map((c) => c.origin));
  console.log('Current CORS origins:', Array.from(existingOrigins));

  for (const origin of origins) {
    if (existingOrigins.has(origin)) {
      console.log(`✓ CORS origin exists: ${origin}`);
    } else {
      const addRes = await fetch(`https://api.sanity.io/v2021-06-07/projects/${projectId}/cors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ origin, allowCredentials: true }),
      });
      if (addRes.ok) {
        console.log(`+ Added CORS origin: ${origin}`);
      } else {
        console.error(`Failed to add CORS origin ${origin}:`, await addRes.text());
      }
    }
  }

  // 2. Manage Webhooks
  console.log('\n--- 2. Webhooks ---');
  const hooksRes = await fetch(`https://api.sanity.io/v2025-02-19/hooks/projects/${projectId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const existingHooks: any[] = await hooksRes.json();
  console.log('Current webhooks:', existingHooks.map((h) => ({ id: h.id, name: h.name, url: h.url })));

  const revalidateSecret = env.SANITY_REVALIDATE_SECRET;
  const reindexSecret = env.CATALOG_REINDEX_SECRET;

  console.log('Revalidate secret present:', Boolean(revalidateSecret));
  console.log('Reindex secret present:', Boolean(reindexSecret));

  // Determine production/preview URLs for webhooks
  // By default, webhooks point to production https://www.hardwarecollection.co (or demo if chosen)
  // Let's see what hooks should be created
  const targetDomain = 'https://www.hardwarecollection.co';

  const hooksToConfigure = [
    {
      name: 'Content Revalidation',
      url: `${targetDomain}/api/revalidate`,
      secret: revalidateSecret,
      dataset: 'production',
      filter: '!(_id in path("drafts.**"))',
      projection: '{ _type }',
    },
    {
      name: 'Catalogue Reindexing',
      url: `${targetDomain}/api/catalog/reindex`,
      secret: reindexSecret,
      dataset: 'production',
      filter: '_type in ["catalogue", "brand"] && !(_id in path("drafts.**"))',
      projection: '{ _type }',
    },
  ];

  for (const hook of hooksToConfigure) {
    if (!hook.secret) {
      console.warn(`Skipping webhook "${hook.name}" because secret is missing in .env.local`);
      continue;
    }
    const match = existingHooks.find((h) => h.name === hook.name || h.url === hook.url);
    if (match) {
      console.log(`✓ Webhook "${hook.name}" already exists (${match.url})`);
    } else {
      console.log(`Creating webhook: "${hook.name}" -> ${hook.url}`);
      const payload: any = {
        type: 'document',
        name: hook.name,
        url: hook.url,
        dataset: hook.dataset,
        apiVersion: 'v2025-02-19',
        httpMethod: 'POST',
        secret: hook.secret,
        rule: {
          on: ['create', 'update', 'delete'],
          filter: hook.filter || null,
          projection: hook.projection || null,
        },
      };
      const createRes = await fetch(`https://api.sanity.io/v2025-02-19/hooks/projects/${projectId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (createRes.ok) {
        const created = await createRes.json();
        console.log(`+ Created webhook "${hook.name}" with ID: ${created.id}`);
      } else {
        console.error(`Failed to create webhook "${hook.name}":`, await createRes.text());
      }
    }
  }
}

main().catch(console.error);
