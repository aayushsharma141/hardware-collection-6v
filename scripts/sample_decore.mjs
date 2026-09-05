import sharp from 'sharp';
import path from 'path';

async function sampleDecore() {
  const full = path.resolve('E:/Hardware-Collection/Hardware Collection/photos/logos/brand-logos/decore.png');
  const { data, info } = await sharp(full).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  
  // Find where the white pixels are
  let whitePixels = [];
  for (let y = 0; y < info.height; y += 10) {
    for (let x = 0; x < info.width; x += 10) {
      const idx = (y * info.width + x) * 4;
      const r = data[idx], g = data[idx+1], b = data[idx+2], a = data[idx+3];
      if (a > 10 && r > 240 && g > 240 && b > 240) {
        whitePixels.push({ x, y, r, g, b, a });
      }
    }
  }
  console.log('decore.png sample white pixels count:', whitePixels.length, 'examples:', whitePixels.slice(0, 5));
}
sampleDecore();
