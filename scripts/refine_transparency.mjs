import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const inputDir = path.resolve('E:/Hardware-Collection/Hardware Collection/photos/logos/brand-logos');
const brandOutputDir = path.resolve('E:/Hardware-Collection/Hardware Collection/photos/logos/brand-logos/transparent');
const publicOutputDir = path.resolve('E:/Hardware-Collection/public/brands');

[brandOutputDir, publicOutputDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

function colorDist(r1, g1, b1, r2, g2, b2) {
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

async function processImage(fileName) {
  const inputPath = path.join(inputDir, fileName);
  const ext = path.extname(fileName).toLowerCase();
  const baseName = path.basename(fileName, ext);

  // 1. SVG: 100% original scalable vector & authentic brand colors
  if (ext === '.svg') {
    const content = fs.readFileSync(inputPath, 'utf-8');
    fs.writeFileSync(path.join(brandOutputDir, fileName), content, 'utf-8');
    fs.writeFileSync(path.join(publicOutputDir, fileName), content, 'utf-8');
    console.log(`[SVG Preserved] ${fileName}`);
    return;
  }

  // 2. Raster processing (PNG, JPG, WebP, AVIF)
  const img = sharp(inputPath);
  const meta = await img.metadata();
  const { width, height } = meta;

  const { data } = await img
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const numPixels = width * height;

  // Custom background transparency & edge anti-aliasing logic per file
  if (fileName === 'BECKER.jpg' || fileName === 'PANS.jpg') {
    for (let i = 0; i < numPixels; i++) {
      const idx = i * 4;
      const r = data[idx], g = data[idx + 1], b = data[idx + 2];
      const brightness = (r + g + b) / 3;
      const d = colorDist(r, g, b, 238, 238, 238);

      if (brightness > 230 || d < 25) {
        data[idx + 3] = 0;
      } else if (brightness > 190 || d < 65) {
        const t = (brightness - 190) / (230 - 190);
        data[idx + 3] = Math.round((1 - t) * 255);
      }
    }
  } else if (fileName === 'TATTVA.avif') {
    for (let i = 0; i < numPixels; i++) {
      const idx = i * 4;
      const r = data[idx], g = data[idx + 1], b = data[idx + 2];
      const brightness = (r + g + b) / 3;
      if (brightness > 240) {
        data[idx + 3] = 0;
      } else if (brightness > 180) {
        const t = (brightness - 180) / (240 - 180);
        data[idx + 3] = Math.round((1 - t) * 255);
      }
    }
  } else if (fileName === 'labacha_logo.webp') {
    for (let i = 0; i < numPixels; i++) {
      const idx = i * 4;
      const r = data[idx], g = data[idx + 1], b = data[idx + 2];
      const brightness = (r + g + b) / 3;
      if (r > 242 && g > 242 && b > 242) {
        data[idx + 3] = 0;
      } else if (r > 215 && g > 215 && b > 215) {
        const t = (brightness - 215) / (245 - 215);
        data[idx + 3] = Math.round((1 - Math.min(1, Math.max(0, t))) * 255);
      }
    }
  } else if (fileName === 'decor bath.webp') {
    // Already 90% transparent; ensure any near-white border residue is cleared
    for (let i = 0; i < numPixels; i++) {
      const idx = i * 4;
      const r = data[idx], g = data[idx + 1], b = data[idx + 2];
      if (r > 245 && g > 245 && b > 245) {
        data[idx + 3] = 0;
      }
    }
  } else if (fileName === 'decore.png') {
    for (let i = 0; i < numPixels; i++) {
      const idx = i * 4;
      const r = data[idx], g = data[idx + 1], b = data[idx + 2];
      if (r > 245 && g > 245 && b > 245) {
        data[idx + 3] = 0;
      }
    }
  }

  const processed = sharp(data, {
    raw: { width, height, channels: 4 }
  });

  // Base output filenames
  const outPngBrand = path.join(brandOutputDir, `${baseName}.png`);
  const outWebpBrand = path.join(brandOutputDir, `${baseName}.webp`);
  const outPngPublic = path.join(publicOutputDir, `${baseName}.png`);
  const outWebpPublic = path.join(publicOutputDir, `${baseName}.webp`);

  await processed.clone().png({ compressionLevel: 9 }).toFile(outPngBrand);
  await processed.clone().png({ compressionLevel: 9 }).toFile(outPngPublic);
  await processed.clone().webp({ quality: 95, alphaQuality: 100, lossless: true }).toFile(outWebpBrand);
  await processed.clone().webp({ quality: 95, alphaQuality: 100, lossless: true }).toFile(outWebpPublic);

  // If filename contains spaces (e.g. "decor bath"), also generate slugified version for web safety
  if (baseName.includes(' ')) {
    const slugName = baseName.replace(/\s+/g, '-');
    await processed.clone().png({ compressionLevel: 9 }).toFile(path.join(publicOutputDir, `${slugName}.png`));
    await processed.clone().webp({ quality: 95, alphaQuality: 100, lossless: true }).toFile(path.join(publicOutputDir, `${slugName}.webp`));
  }

  console.log(`[Converted & Transparent] ${baseName} -> ${width}x${height} (PNG + WebP)`);
}

async function run() {
  const files = fs.readdirSync(inputDir).filter(f => !fs.statSync(path.join(inputDir, f)).isDirectory());
  console.log(`Processing all ${files.length} brand logo assets...`);
  for (const file of files) {
    await processImage(file);
  }
  console.log('All brand logos converted and synced successfully.');
}

run();
