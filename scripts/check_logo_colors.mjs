import sharp from 'sharp';
import path from 'path';

async function checkColors(file) {
  const imgPath = path.resolve('E:/Hardware-Collection/Hardware Collection/photos/logos/brand-logos', file);
  const { data, info } = await sharp(imgPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  
  // Sample center pixel and some non-white pixels
  let nonWhiteCount = 0;
  let sampleColors = [];
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
    if (r < 230 || g < 230 || b < 230) {
      nonWhiteCount++;
      if (sampleColors.length < 5) {
        sampleColors.push(`rgb(${r},${g},${b})`);
      }
    }
  }
  console.log(`${file}: ${info.width}x${info.height}, non-white pixels: ${nonWhiteCount}, sample logo colors: ${sampleColors.join(', ')}`);
}

async function run() {
  await checkColors('BECKER.jpg');
  await checkColors('PANS.jpg');
  await checkColors('TATTVA.avif');
  await checkColors('Haefele_Logo.png');
  await checkColors('labacha_logo.webp');
}
run();
