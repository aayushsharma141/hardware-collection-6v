const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  console.log('--- 1. HOMEPAGE ---');
  await page.goto('http://localhost:3000/');
  
  const title = await page.title();
  const desc = await page.locator('meta[name="description"]').getAttribute('content', {timeout: 2000}).catch(()=>'');
  const canonical = await page.locator('link[rel="canonical"]').getAttribute('href', {timeout: 2000}).catch(()=>'');
  const jsonld = await page.locator('script[type="application/ld+json"]').count();
  
  console.log(`Title: ${title}`);
  console.log(`Description: ${desc}`);
  console.log(`Canonical: ${canonical}`);
  console.log(`JSON-LD count: ${jsonld}`);
  
  // check CTA
  const whatsappHref = await page.locator('a[href*="wa.me/"]').first().getAttribute('href', {timeout: 2000}).catch(()=>'');
  console.log(`WhatsApp CTA: ${whatsappHref}`);
  
  console.log('\n--- 2. COLLECTIONS ---');
  await page.goto('http://localhost:3000/collections');
  console.log(`Title: ${await page.title()}`);
  const collectionsDesc = await page.locator('meta[name="description"]').getAttribute('content', {timeout: 2000}).catch(()=>'');
  console.log(`Description: ${collectionsDesc}`);
  
  console.log('\n--- 3. BRANDS / CATALOGS ---');
  await page.goto('http://localhost:3000/catalogs');
  const viewCatalogButtons = await page.locator('text="View Catalog"').count();
  console.log(`"View Catalog" buttons found: ${viewCatalogButtons}`);
  // Check image src
  const firstBrandImage = await page.locator('img').first().getAttribute('src', {timeout: 2000}).catch(()=>'');
  console.log(`First brand image: ${firstBrandImage}`);
  
  console.log('\n--- 4. PRODUCTS ---');
  // First get a product URL
  await page.goto('http://localhost:3000/collections/cabinet-and-drawer-hardware');
  await page.waitForTimeout(1000);
  console.log('Category page loaded.');
  // Find a product and click it to open the drawer
  const productCount = await page.locator('h3').count();
  console.log(`Products displayed: ${productCount}`);
  
  await browser.close();
})();
