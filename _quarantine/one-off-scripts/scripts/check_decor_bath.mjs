import sharp from 'sharp';
import path from 'path';

async function checkDecorBath() {
  const full = path.resolve('E:/Hardware-Collection/Hardware Collection/photos/logos/brand-logos/decor bath.webp');
  const img = sharp(full);
  const meta = await img.metadata();
  const { data } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  let transparent = 0;
  let white = 0;
  let nonWhiteOpaque = 0;
  let sampleColors = [];

  for (let i = 0; i < data.length; i += 4) {
    const a = data[i+3];
    const r = data[i], g = data[i+1], b = data[i+2];
    if (a < 10) {
      transparent++;
    } else if (r > 240 && g > 240 && b > 240) {
      white++;
    } else {
      nonWhiteOpaque++;
      if (sampleColors.length < 5) {
        sampleColors.push(`rgb(${r},${g},${b})`);
      }
    }
  }

  const total = meta.width * meta.height;
  console.log(`decor bath.webp (${meta.width}x${meta.height}): transparent=${Math.round(transparent/total*100)}%, white=${Math.round(white/total*100)}%, colored=${Math.round(nonWhiteOpaque/total*100)}%`);
  console.log('Sample non-white colors:', sampleColors);
}

checkDecorBath();
