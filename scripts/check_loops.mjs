import sharp from 'sharp';
import path from 'path';

async function checkLoopTransparency(file) {
  const full = path.resolve('E:/Hardware-Collection/public/brands', file);
  const { data, info } = await sharp(full).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  
  // Look for any opaque pixels that have near-grey/white color (230-245)
  let opaqueGreyCount = 0;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
    if (a > 200 && r > 230 && g > 230 && b > 230) {
      opaqueGreyCount++;
    }
  }
  console.log(`${file}: opaque grey/white pixels remaining: ${opaqueGreyCount}`);
}

async function run() {
  await checkLoopTransparency('BECKER.png');
  await checkLoopTransparency('PANS.png');
}
run();
