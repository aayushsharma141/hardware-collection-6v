/**
 * Fix Tattva, Labacha, and Decor Bath logos:
 * - Labacha: remove white background, then tight-crop
 * - Tattva: tight-crop the square asset (already transparent? check first)
 * - Decor Bath: tight-crop PNG
 */
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BRANDS_DIR = path.join(__dirname, "../public/brands");

async function getAlphaStats(inputPath) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let transparentPixels = 0;
  let opaquePixels = 0;
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] < 10) transparentPixels++;
    else opaquePixels++;
  }
  return { transparentPixels, opaquePixels, total: info.width * info.height };
}

async function removeWhiteBackground(inputPath, outputPath, threshold = 30) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const channels = info.channels; // 4 (RGBA after ensureAlpha)
  const output = Buffer.from(data);

  for (let i = 0; i < output.length; i += channels) {
    const r = output[i];
    const g = output[i + 1];
    const b = output[i + 2];
    // Euclidean distance from white (255,255,255)
    const dist = Math.sqrt(
      (255 - r) ** 2 + (255 - g) ** 2 + (255 - b) ** 2
    );
    if (dist < threshold) {
      output[i + 3] = 0; // make transparent
    }
  }

  await sharp(output, {
    raw: { width: info.width, height: info.height, channels },
  })
    .png()
    .toFile(outputPath);

  console.log(`✓ White removed: ${path.basename(outputPath)}`);
}

async function tightCrop(inputPath, outputPath, padding = 12) {
  // Use sharp's trim() to auto-detect content boundaries and crop
  const trimmed = await sharp(inputPath)
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 5 })
    .toBuffer({ resolveWithObject: true });

  // Add small padding back around the mark
  await sharp(trimmed.data)
    .raw({
      width: trimmed.info.width,
      height: trimmed.info.height,
      channels: trimmed.info.channels,
    })
    .extend({
      top: padding,
      bottom: padding,
      left: padding,
      right: padding,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(outputPath);

  console.log(
    `✓ Tight-cropped: ${path.basename(outputPath)} (${trimmed.info.width}x${trimmed.info.height} → padded +${padding}px)`
  );
}

async function main() {
  // ── 1. LABACHA ─────────────────────────────────────────────────────────────
  // Source is 800x800 square with white bg + huge padding — remove white, then crop
  const labachaSource = path.join(BRANDS_DIR, "labacha_logo.webp");
  const labachaTmp = path.join(BRANDS_DIR, "labacha_no_white.png");
  const labachaOut = path.join(BRANDS_DIR, "labacha_logo_transparent.png");

  console.log("\n── Labacha ──");
  const labStats = await getAlphaStats(labachaSource);
  console.log(`  Before: ${labStats.transparentPixels} transparent / ${labStats.opaquePixels} opaque`);

  await removeWhiteBackground(labachaSource, labachaTmp, 40);
  await tightCrop(labachaTmp, labachaOut, 8);
  fs.unlinkSync(labachaTmp);

  const labStatsAfter = await getAlphaStats(labachaOut);
  console.log(`  After: ${labStatsAfter.transparentPixels} transparent / ${labStatsAfter.opaquePixels} opaque`);

  // ── 2. TATTVA ──────────────────────────────────────────────────────────────
  // 1000x1000 square with large padding — check if already transparent, then crop
  const tattvaSource = path.join(BRANDS_DIR, "TATTVA.webp");
  const tattvaTmp = path.join(BRANDS_DIR, "tattva_no_white.png");
  const tattvaOut = path.join(BRANDS_DIR, "TATTVA_cropped.png");

  console.log("\n── Tattva ──");
  const tatStats = await getAlphaStats(tattvaSource);
  console.log(`  Before: ${tatStats.transparentPixels} transparent / ${tatStats.opaquePixels} opaque`);

  // Has white bg — remove it first
  await removeWhiteBackground(tattvaSource, tattvaTmp, 35);
  await tightCrop(tattvaTmp, tattvaOut, 10);
  fs.unlinkSync(tattvaTmp);

  const tatStatsAfter = await getAlphaStats(tattvaOut);
  console.log(`  After: ${tatStatsAfter.transparentPixels} transparent / ${tatStatsAfter.opaquePixels} opaque`);

  // ── 3. DECOR BATH ──────────────────────────────────────────────────────────
  // Square with transparent bg but huge empty padding around the mark
  const decorSource = path.join(BRANDS_DIR, "decor-bath.png");
  const decorOut = path.join(BRANDS_DIR, "decor-bath_cropped.png");

  console.log("\n── Decor Bath ──");
  const decStats = await getAlphaStats(decorSource);
  console.log(`  Before: ${decStats.transparentPixels} transparent / ${decStats.opaquePixels} opaque`);

  await tightCrop(decorSource, decorOut, 10);

  const decStatsAfter = await getAlphaStats(decorOut);
  console.log(`  After: ${decStatsAfter.transparentPixels} transparent / ${decStatsAfter.opaquePixels} opaque`);

  console.log("\n✅ All done. New files:");
  console.log("  labacha_logo_transparent.png");
  console.log("  TATTVA_cropped.png");
  console.log("  decor-bath_cropped.png");
}

main().catch(console.error);
