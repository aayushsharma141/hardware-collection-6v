import fs from 'fs';
import path from 'path';

const dir = path.resolve('E:/Hardware-Collection/Hardware Collection/photos/logos/brand-logos');
const files = fs.readdirSync(dir).filter(f => !fs.statSync(path.join(dir, f)).isDirectory());

const stats = files.map(f => {
  const s = fs.statSync(path.join(dir, f));
  return {
    file: f,
    size: s.size,
    mtime: s.mtime.toISOString()
  };
}).sort((a, b) => new Date(b.mtime) - new Date(a.mtime));

console.log(JSON.stringify(stats, null, 2));
