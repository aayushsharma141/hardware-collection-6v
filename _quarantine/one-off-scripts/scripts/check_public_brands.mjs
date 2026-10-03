import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

async function checkCleanAssets() {
  const dir = path.resolve('E:/Hardware-Collection/public/brands');
  const files = fs.readdirSync(dir);
  for (const f of files) {
    if (f.endsWith('.png') || f.endsWith('.webp')) {
      const full = path.join(dir, f);
      const meta = await sharp(full).metadata();
      const { data } = await sharp(full).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      let transparent = 0;
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] < 10) transparent++;
      }
      const pct = Math.round(transparent / (meta.width * meta.height) * 100);
      console.log(`${f} (${meta.width}x${meta.height}): ${pct}% transparent`);
    }
  }
}

checkCleanAssets();
