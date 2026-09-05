import sharp from 'sharp';
import path from 'path';

const files = [
  'BECKER.jpg',
  'decore.png',
  'dorset-seeklogo.png',
  'furnipart-of-denmark-seeklogo.png',
  'GEZE_Logo_RGB.png',
  'Haefele_Logo.png',
  'labacha_logo.webp',
  'Liftor.png',
  'ozone.webp',
  'PANS.jpg',
  'philips.png',
  'rexton-logo.webp',
  'Shapes_logo_dark-1-768x224.png',
  'TATTVA.avif'
];

async function inspectAll() {
  const dir = path.resolve('E:/Hardware-Collection/Hardware Collection/photos/logos/brand-logos');
  for (const f of files) {
    const full = path.join(dir, f);
    const { data, info } = await sharp(full).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    
    // Count transparent pixels (alpha < 10)
    let transparent = 0;
    let white = 0;
    let nonWhiteOpaque = 0;
    
    for (let i = 0; i < data.length; i += 4) {
      const a = data[i+3];
      if (a < 10) {
        transparent++;
      } else {
        const r = data[i], g = data[i+1], b = data[i+2];
        if (r > 240 && g > 240 && b > 240) {
          white++;
        } else {
          nonWhiteOpaque++;
        }
      }
    }
    const total = info.width * info.height;
    console.log(`${f} (${info.width}x${info.height}): transparent=${Math.round(transparent/total*100)}%, white=${Math.round(white/total*100)}%, colored=${Math.round(nonWhiteOpaque/total*100)}%`);
  }
}

inspectAll();
