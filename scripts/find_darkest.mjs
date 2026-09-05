import sharp from 'sharp';
import path from 'path';

async function findDarkestColors(file) {
  const imgPath = path.resolve('E:/Hardware-Collection/Hardware Collection/photos/logos/brand-logos', file);
  const { data, info } = await sharp(imgPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  
  let minBrightness = 999;
  let darkestPixels = [];
  let colorHistogram = {};

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i+1], b = data[i+2];
    const brightness = (r + g + b) / 3;
    if (brightness < minBrightness) {
      minBrightness = brightness;
    }
    if (brightness < 100) {
      const key = `${Math.round(r/10)*10},${Math.round(g/10)*10},${Math.round(b/10)*10}`;
      colorHistogram[key] = (colorHistogram[key] || 0) + 1;
    }
  }
  console.log(`${file}: minBrightness = ${minBrightness}, dark color clusters:`, Object.entries(colorHistogram).sort((a,b) => b[1] - a[1]).slice(0, 5));
}

async function run() {
  await findDarkestColors('BECKER.jpg');
  await findDarkestColors('PANS.jpg');
}
run();
