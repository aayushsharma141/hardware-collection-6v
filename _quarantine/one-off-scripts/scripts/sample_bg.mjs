import sharp from 'sharp';
import path from 'path';

async function sampleBg(file) {
  const full = path.resolve('E:/Hardware-Collection/Hardware Collection/photos/logos/brand-logos', file);
  const { data, info } = await sharp(full).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  
  console.log(`--- ${file} ---`);
  // Print top-left 5x5 pixels
  for (let y = 0; y < 5; y++) {
    let row = [];
    for (let x = 0; x < 5; x++) {
      const idx = (y * info.width + x) * 4;
      row.push(`(${data[idx]},${data[idx+1]},${data[idx+2]})`);
    }
    console.log(`Row ${y}:`, row.join(' '));
  }
}

async function run() {
  await sampleBg('BECKER.jpg');
  await sampleBg('PANS.jpg');
}
run();
