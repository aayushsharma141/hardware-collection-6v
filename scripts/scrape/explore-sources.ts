import { chromium } from "@playwright/test";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto("https://www.crossangleinterior.com/", { waitUntil: "domcontentloaded", timeout: 25000 });

  // Scroll to bottom to trigger all lazy loaded elements
  for (let i = 0; i < 10; i++) {
    await page.evaluate(() => window.scrollBy(0, 1500));
    await new Promise((r) => setTimeout(r, 600));
  }

  const data = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll("a")).map((a) => a.href).filter((h) => h.includes("crossangleinterior.com"));
    const imgs: Array<{ src: string; alt: string; w: number; h: number }> = [];
    document.querySelectorAll("img").forEach((img) => {
      const src = img.currentSrc || img.getAttribute("data-src") || img.src;
      if (src && !src.startsWith("data:") && (img.naturalWidth > 300 || img.width > 300)) {
        imgs.push({ src, alt: img.alt || "", w: img.naturalWidth || img.width, h: img.naturalHeight || img.height });
      }
    });
    return { links: Array.from(new Set(links)), imgCount: imgs.length, sampleImgs: imgs };
  });

  console.log("Internal links found:", data.links.length);
  data.links.slice(0, 10).forEach((l) => console.log(" ", l));
  console.log(`High-res images found: ${data.imgCount}`);
  data.sampleImgs.slice(0, 15).forEach((img, i) => console.log(`  ${i + 1}: ${img.src} (${img.w}x${img.h}) - alt: "${img.alt}"`));

  await browser.close();
}

main().catch(console.error);
