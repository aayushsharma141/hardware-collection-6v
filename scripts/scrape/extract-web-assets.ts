/**
 * extract-web-assets.ts
 *
 * DOM web extraction tool for collecting temporary reference imagery
 * and metadata from target architectural websites and partner brand portals.
 *
 * Usage:
 *   npx tsx scripts/scrape/extract-web-assets.ts [--url <url>] [--category <category-slug>] [--max <number>]
 *   npx tsx scripts/scrape/extract-web-assets.ts --all
 */

import { chromium } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as http from "http";

export interface ScrapeTarget {
  categorySlug: string;
  categoryName: string;
  familySlug: string;
  sourceUrl: string;
  selector?: string;
  minWidth?: number;
  minHeight?: number;
}

export interface ExtractedAsset {
  categorySlug: string;
  categoryName: string;
  familySlug: string;
  imageUrl: string;
  altText: string;
  sourcePage: string;
  localPath?: string;
}

// Canonical showroom taxonomy targets to harvest staging imagery for
export const DEFAULT_TARGETS: ScrapeTarget[] = [
  // Ambient & High-End Interior Reference
  {
    categorySlug: "italian-collection",
    categoryName: "Italian Collection",
    familySlug: "handles-knobs",
    sourceUrl: "https://www.crossangleinterior.com/",
    selector: "img",
    minWidth: 400,
    minHeight: 300,
  },
  {
    categorySlug: "luxury-collection",
    categoryName: "Luxury Collection",
    familySlug: "handles-knobs",
    sourceUrl: "https://www.crossangleinterior.com/",
    selector: "img",
    minWidth: 400,
    minHeight: 300,
  },
  {
    categorySlug: "modern-collection",
    categoryName: "Modern Collection",
    familySlug: "handles-knobs",
    sourceUrl: "https://www.crossangleinterior.com/",
    selector: "img",
    minWidth: 400,
    minHeight: 300,
  },
  {
    categorySlug: "classical-collection",
    categoryName: "Classical Collection",
    familySlug: "handles-knobs",
    sourceUrl: "https://www.crossangleinterior.com/",
    selector: "img",
    minWidth: 400,
    minHeight: 300,
  },
  {
    categorySlug: "long-bar-handles",
    categoryName: "Long Bar Handles",
    familySlug: "handles-knobs",
    sourceUrl: "https://www.crossangleinterior.com/",
    selector: "img",
    minWidth: 400,
    minHeight: 300,
  },
  {
    categorySlug: "profile-handles",
    categoryName: "Profile Handles",
    familySlug: "handles-knobs",
    sourceUrl: "https://www.crossangleinterior.com/",
    selector: "img",
    minWidth: 400,
    minHeight: 300,
  },
  {
    categorySlug: "bathroom-shelves",
    categoryName: "Bathroom Shelves",
    familySlug: "bathroom",
    sourceUrl: "https://www.crossangleinterior.com/",
    selector: "img",
    minWidth: 400,
    minHeight: 300,
  },
  {
    categorySlug: "ss-mirror-cabinets",
    categoryName: "SS Mirror Cabinets",
    familySlug: "bathroom",
    sourceUrl: "https://www.crossangleinterior.com/",
    selector: "img",
    minWidth: 400,
    minHeight: 300,
  },
  {
    categorySlug: "furniture-profiles",
    categoryName: "Furniture Profiles",
    familySlug: "furniture-hardware",
    sourceUrl: "https://www.crossangleinterior.com/",
    selector: "img",
    minWidth: 400,
    minHeight: 300,
  },
  {
    categorySlug: "modular-kitchen-hardware",
    categoryName: "Modular Kitchen Hardware",
    familySlug: "kitchen-wardrobes",
    sourceUrl: "https://www.crossangleinterior.com/",
    selector: "img",
    minWidth: 400,
    minHeight: 300,
  },
];

async function downloadFile(url: string, destPath: string): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const parsedUrl = new URL(url);
      const client = parsedUrl.protocol === "https:" ? https : http;

      const request = client.get(
        url,
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
          },
          timeout: 10000,
        },
        (res) => {
          if (res.statusCode && (res.statusCode < 200 || res.statusCode >= 300)) {
            if (res.statusCode === 301 || res.statusCode === 302) {
              const redirectUrl = res.headers.location;
              if (redirectUrl) {
                downloadFile(redirectUrl, destPath).then(resolve);
                return;
              }
            }
            resolve(false);
            return;
          }

          const fileStream = fs.createWriteStream(destPath);
          res.pipe(fileStream);

          fileStream.on("finish", () => {
            fileStream.close();
            resolve(true);
          });

          fileStream.on("error", () => {
            fs.unlink(destPath, () => {});
            resolve(false);
          });
        }
      );

      request.on("error", () => {
        resolve(false);
      });

      request.on("timeout", () => {
        request.destroy();
        resolve(false);
      });
    } catch {
      resolve(false);
    }
  });
}

export async function scrapeTarget(
  target: ScrapeTarget,
  maxImages: number = 3
): Promise<ExtractedAsset[]> {
  console.log(`\n🔍 Scraping DOM for [${target.categoryName}] from ${target.sourceUrl}...`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    viewport: { width: 1920, height: 1080 },
  });

  const page = await context.newPage();
  const extracted: ExtractedAsset[] = [];

  try {
    await page.goto(target.sourceUrl, { waitUntil: "domcontentloaded", timeout: 25000 });
    // Scroll slightly to trigger lazy-loaded images
    await page.evaluate(async () => {
      window.scrollBy(0, 1000);
      await new Promise((r) => setTimeout(r, 800));
      window.scrollBy(0, 1500);
      await new Promise((r) => setTimeout(r, 800));
    });

    // Query DOM for high-resolution images
    const rawImages = await page.evaluate(
      ({ selector, minW, minH }) => {
        const results: Array<{ src: string; alt: string; width: number; height: number }> = [];
        const seen = new Set<string>();

        const elements = document.querySelectorAll(selector || "img");
        elements.forEach((el) => {
          let src = "";
          if (el instanceof HTMLImageElement) {
            src =
              el.currentSrc ||
              el.getAttribute("data-src") ||
              el.getAttribute("data-original") ||
              el.getAttribute("data-lazy-src") ||
              el.src;
          } else {
            const bg = window.getComputedStyle(el).backgroundImage;
            const match = bg.match(/url\(["']?([^"']+)["']?\)/);
            if (match) src = match[1];
          }

          if (!src || src.startsWith("data:") || seen.has(src)) return;
          const rect = el.getBoundingClientRect();
          const naturalW = (el as HTMLImageElement).naturalWidth || rect.width;
          const naturalH = (el as HTMLImageElement).naturalHeight || rect.height;

          // Exclude tiny icons, logos, or UI buttons
          if (naturalW >= (minW || 300) && naturalH >= (minH || 200)) {
            seen.add(src);
            results.push({
              src,
              alt: (el as HTMLElement).getAttribute("alt") || "",
              width: naturalW,
              height: naturalH,
            });
          }
        });

        return results;
      },
      { selector: target.selector, minW: target.minWidth, minH: target.minHeight }
    );

    console.log(`  Found ${rawImages.length} candidates meeting dimension criteria.`);

    const stagingDir = path.resolve(process.cwd(), `public/staging/raw/${target.categorySlug}`);
    fs.mkdirSync(stagingDir, { recursive: true });

    let count = 0;
    for (const item of rawImages) {
      if (count >= maxImages) break;

      let fullUrl = item.src;
      if (fullUrl.startsWith("//")) {
        fullUrl = "https:" + fullUrl;
      } else if (fullUrl.startsWith("/")) {
        const u = new URL(target.sourceUrl);
        fullUrl = `${u.origin}${fullUrl}`;
      }

      const ext = path.extname(new URL(fullUrl).pathname).split("?")[0] || ".jpg";
      const filename = `asset-${count + 1}${ext}`;
      const destPath = path.join(stagingDir, filename);

      const success = await downloadFile(fullUrl, destPath);
      if (success && fs.existsSync(destPath) && fs.statSync(destPath).size > 10000) {
        console.log(`  ✓ Saved [${filename}] (${(fs.statSync(destPath).size / 1024).toFixed(1)} KB)`);
        extracted.push({
          categorySlug: target.categorySlug,
          categoryName: target.categoryName,
          familySlug: target.familySlug,
          imageUrl: fullUrl,
          altText: item.alt || target.categoryName,
          sourcePage: target.sourceUrl,
          localPath: destPath,
        });
        count++;
      }
    }
  } catch (err) {
    console.error(`  ✗ Error scraping ${target.sourceUrl}:`, (err as Error).message);
  } finally {
    await browser.close();
  }

  return extracted;
}

async function main() {
  const args = process.argv.slice(2);
  const isAll = args.includes("--all");
  const urlArgIndex = args.indexOf("--url");
  const catArgIndex = args.indexOf("--category");
  const maxArgIndex = args.indexOf("--max");

  const maxImages = maxArgIndex !== -1 ? parseInt(args[maxArgIndex + 1], 10) || 3 : 2;

  const manifestPath = path.resolve(process.cwd(), "public/staging/raw/manifest.json");
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true });

  let allAssets: ExtractedAsset[] = [];
  if (fs.existsSync(manifestPath)) {
    try {
      allAssets = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    } catch {
      allAssets = [];
    }
  }

  if (urlArgIndex !== -1 && catArgIndex !== -1) {
    const customTarget: ScrapeTarget = {
      categorySlug: args[catArgIndex + 1],
      categoryName: args[catArgIndex + 1],
      familySlug: "custom",
      sourceUrl: args[urlArgIndex + 1],
    };
    const results = await scrapeTarget(customTarget, maxImages);
    allAssets.push(...results);
  } else if (isAll) {
    for (const target of DEFAULT_TARGETS) {
      const results = await scrapeTarget(target, maxImages);
      allAssets.push(...results);
    }
  } else {
    // Default: run first 3 key targets as smoke test
    console.log("No specific flag passed. Running smoke scrape on top targets. (Use --all for complete run)");
    for (const target of DEFAULT_TARGETS.slice(0, 3)) {
      const results = await scrapeTarget(target, 2);
      allAssets.push(...results);
    }
  }

  fs.writeFileSync(manifestPath, JSON.stringify(allAssets, null, 2));
  console.log(`\n✨ Scraping completed. Manifest saved to: ${manifestPath} (${allAssets.length} total entries)`);
}

if (process.argv[1]?.endsWith("extract-web-assets.ts")) {
  main().catch(console.error);
}
