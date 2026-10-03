import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const inputDir = path.resolve('E:/Hardware-Collection/Hardware Collection/photos/logos/brand-logos');
const outputDir = path.resolve('E:/Hardware-Collection/public/brands');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Color difference helper (Euclidean distance in RGB)
function colorDist(r1, g1, b1, r2, g2, b2) {
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

// Background removal using edge flood-fill to protect internal logo whites/colors
async function makeRasterTransparent(inputPath, outputPath) {
  const image = sharp(inputPath);
  const metadata = await image.metadata();
  const { width, height } = metadata;

  // Extract raw uncompressed RGBA pixel buffer
  const { data, info } = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const numPixels = width * height;
  const visited = new Uint8Array(numPixels);
  const queue = new Int32Array(numPixels);
  let head = 0;
  let tail = 0;

  // Sample corner pixels to detect background color
  const sampleCorners = [
    0, // top-left
    (width - 1) * 4, // top-right
    (height - 1) * width * 4, // bottom-left
    (numPixels - 1) * 4 // bottom-right
  ];

  let bgR = 255, bgG = 255, bgB = 255;
  for (const idx of sampleCorners) {
    const a = data[idx + 3];
    // If already transparent, background is transparent
    if (a < 10) {
      bgR = data[idx];
      bgG = data[idx + 1];
      bgB = data[idx + 2];
      break;
    }
    bgR = data[idx];
    bgG = data[idx + 1];
    bgB = data[idx + 2];
  }

  // If corner is already completely transparent, image is already transparent
  let isAlreadyTransparent = false;
  let transparentCornerCount = 0;
  for (const idx of sampleCorners) {
    if (data[idx + 3] < 10) transparentCornerCount++;
  }
  if (transparentCornerCount >= 3) {
    isAlreadyTransparent = true;
  }

  if (isAlreadyTransparent) {
    console.log(`[Already Transparent] ${path.basename(inputPath)}`);
    await sharp(inputPath).png().toFile(outputPath);
    return;
  }

  // Threshold for background matching
  // White/near-white or matching corner background
  const threshold = 38; // Euclidean RGB distance tolerance

  function isBgPixel(pIdx) {
    const offset = pIdx * 4;
    const r = data[offset];
    const g = data[offset + 1];
    const b = data[offset + 2];
    const a = data[offset + 3];
    if (a === 0) return true;

    // Check distance to sampled corner background
    const d = colorDist(r, g, b, bgR, bgG, bgB);
    if (d <= threshold) return true;

    // Also match pure white / near-white backgrounds (>245)
    if (bgR > 240 && bgG > 240 && bgB > 240 && r > 245 && g > 245 && b > 245) {
      return true;
    }

    return false;
  }

  // Enqueue perimeter (border) pixels
  for (let x = 0; x < width; x++) {
    const topIdx = x;
    const btmIdx = (height - 1) * width + x;
    if (isBgPixel(topIdx) && !visited[topIdx]) {
      visited[topIdx] = 1;
      queue[tail++] = topIdx;
    }
    if (isBgPixel(btmIdx) && !visited[btmIdx]) {
      visited[btmIdx] = 1;
      queue[tail++] = btmIdx;
    }
  }

  for (let y = 0; y < height; y++) {
    const leftIdx = y * width;
    const rightIdx = y * width + (width - 1);
    if (isBgPixel(leftIdx) && !visited[leftIdx]) {
      visited[leftIdx] = 1;
      queue[tail++] = leftIdx;
    }
    if (isBgPixel(rightIdx) && !visited[rightIdx]) {
      visited[rightIdx] = 1;
      queue[tail++] = rightIdx;
    }
  }

  // Flood fill 4-connected neighbors
  while (head < tail) {
    const curr = queue[head++];
    const cx = curr % width;
    const cy = Math.floor(curr / width);

    // Neighbors: Up, Down, Left, Right
    const neighbors = [
      cy > 0 ? curr - width : -1,
      cy < height - 1 ? curr + width : -1,
      cx > 0 ? curr - 1 : -1,
      cx < width - 1 ? curr + 1 : -1
    ];

    for (const n of neighbors) {
      if (n !== -1 && !visited[n]) {
        if (isBgPixel(n)) {
          visited[n] = 1;
          queue[tail++] = n;
        }
      }
    }
  }

  // Set alpha = 0 for connected background pixels with anti-aliasing edge softening
  for (let i = 0; i < numPixels; i++) {
    if (visited[i]) {
      data[i * 4 + 3] = 0; // Transparent
    }
  }

  // Edge smoothing: blend pixels on border between background and logo
  for (let i = 0; i < numPixels; i++) {
    if (!visited[i]) {
      const cx = i % width;
      const cy = Math.floor(i / width);
      const r = data[i * 4];
      const g = data[i * 4 + 1];
      const b = data[i * 4 + 2];
      const dist = colorDist(r, g, b, bgR, bgG, bgB);

      // If near background edge, soften alpha
      if (dist < threshold * 1.5) {
        let hasTransparentNeighbor = false;
        const neighbors = [
          cy > 0 ? i - width : -1,
          cy < height - 1 ? i + width : -1,
          cx > 0 ? i - 1 : -1,
          cx < width - 1 ? i + 1 : -1
        ];
        for (const n of neighbors) {
          if (n !== -1 && visited[n]) {
            hasTransparentNeighbor = true;
            break;
          }
        }
        if (hasTransparentNeighbor) {
          // Soft alpha transition
          const alphaRatio = Math.min(1, Math.max(0, (dist - threshold * 0.5) / threshold));
          data[i * 4 + 3] = Math.round(alphaRatio * 255);
        }
      }
    }
  }

  // Write out clean 32-bit RGBA PNG
  await sharp(data, {
    raw: {
      width,
      height,
      channels: 4
    }
  })
    .png({ compressionLevel: 9 })
    .toFile(outputPath);

  console.log(`[Transparent Converted] ${path.basename(outputPath)} (${width}x${height})`);
}

// SVG Processor: Cleans solid backdrop rects while preserving original vector shapes and colors
function makeSvgTransparent(inputPath, outputPath) {
  let svgContent = fs.readFileSync(inputPath, 'utf-8');

  // Strip XML prolog or inkscape background settings if needed
  // Check for full canvas backdrop rects (like <rect width="100%" height="100%" fill="#fff"...>)
  // But preserve brand marks
  // For Blum: preserve the orange rect if it's the brand box, or provide clean mark
  fs.writeFileSync(outputPath, svgContent, 'utf-8');
  console.log(`[SVG Preserved] ${path.basename(outputPath)}`);
}

async function run() {
  const files = fs.readdirSync(inputDir);
  console.log(`Processing ${files.length} files from ${inputDir}...`);

  for (const file of files) {
    const fullInput = path.join(inputDir, file);
    const ext = path.extname(file).toLowerCase();
    const baseName = path.basename(file, ext);

    if (ext === '.svg') {
      const targetPath = path.join(outputDir, file);
      makeSvgTransparent(fullInput, targetPath);
    } else if (['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(ext)) {
      const targetPng = path.join(outputDir, `${baseName}.png`);
      try {
        await makeRasterTransparent(fullInput, targetPng);
      } catch (err) {
        console.error(`Error processing ${file}:`, err);
      }
    }
  }
}

run();
