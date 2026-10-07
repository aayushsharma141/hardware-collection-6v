import { chromium } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as http from "http";

const URLS = [
  "https://www.crossangleinterior.com/",
  "https://www.crossangleinterior.com/gallery",
  "https://www.crossangleinterior.com/portfolio",
  "https://www.crossangleinterior.com/services/residential",
];

async function download(url: string, dest: string): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const client = url.startsWith("https") ? https : http;
      const req = client.get(url, { headers: { "User-Agent": "Mozilla/5.0 Chrome/122.0.0.0 Safari/537.36" }, timeout: 15000 }, (res) => {
        if (res.statusCode && (res.statusCode < 200 || res.statusCode >= 300)) {
          if (res.statusCode === 301 || res.statusCode === 302 && res.headers.location) {
            download(res.headers.location, dest).then(resolve);
            return;
          }
          resolve(false);
          return;
        }
        const fileStream = fs.createWriteStream(dest);
        res.pipe(fileStream);
        fileStream.on("finish", () => {
          fileStream.close();
          resolve(true);
        });
        fileStream.on("error", () => {
          fs.unlink(dest, () => {});
          resolve(false);
        });
      });
      req.on("error", () => resolve(false));
      req.on("timeout", () => {
        req.destroy();
        resolve(false);
      });
    } catch {
      resolve(false);
    }
  });
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const poolDir = path.resolve(process.cwd(), "public/staging/pool");
  fs.mkdirSync(poolDir, { recursive: true });

  const seenUrls = new Set<string>();
  const collected: Array<{ url: string; alt: string; localPath: string }> = [];

  for (const pageUrl of URLS) {
    console.log(`Crawling ${pageUrl}...`);
    const page = await browser.newPage();
    try {
      await page.goto(pageUrl, { waitUntil: "domcontentloaded", timeout: 25000 });
      for (let i = 0; i < 8; i++) {
        await page.evaluate(() => window.scrollBy(0, 1200));
        await new Promise((r) => setTimeout(r, 500));
      }

      const images = await page.evaluate(() => {
        const results: Array<{ src: string; alt: string }> = [];
        document.querySelectorAll("img").forEach((img) => {
          const src = img.currentSrc || img.getAttribute("data-src") || img.src;
          if (src && !src.startsWith("data:") && (img.naturalWidth > 300 || img.width > 300)) {
            results.push({ src, alt: img.alt || "" });
          }
        });
        return results;
      });

      console.log(`  Found ${images.length} candidates on ${pageUrl}`);
      for (const img of images) {
        let fullUrl = img.src;
        if (fullUrl.startsWith("//")) fullUrl = "https:" + fullUrl;
        else if (fullUrl.startsWith("/")) fullUrl = "https://www.crossangleinterior.com" + fullUrl;

        if (seenUrls.has(fullUrl)) continue;
        seenUrls.add(fullUrl);

        const filename = `img-${collected.length + 1}.jpg`;
        const dest = path.join(poolDir, filename);
        const ok = await download(fullUrl, dest);
        if (ok && fs.existsSync(dest) && fs.statSync(dest).size > 15000) {
          collected.push({ url: fullUrl, alt: img.alt, localPath: dest });
        }
      }
    } catch (e) {
      console.warn(`  Failed ${pageUrl}:`, (e as Error).message);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log(`\n🎉 Successfully collected ${collected.length} unique high-res images in pool!`);
  fs.writeFileSync(path.join(poolDir, "pool-manifest.json"), JSON.stringify(collected, null, 2));
}

main().catch(console.error);
