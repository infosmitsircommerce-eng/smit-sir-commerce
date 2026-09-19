import { rename, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const source = fileURLToPath(new URL('../public/og-image.jpg.png', import.meta.url));
const output = fileURLToPath(new URL('../public/og-image.jpg', import.meta.url));
const temporary = fileURLToPath(new URL('../public/og-image.optimized.jpg', import.meta.url));

await sharp(source)
  .resize(1200, 630, { fit: 'cover', position: 'centre' })
  .flatten({ background: '#faf6ee' })
  .jpeg({ quality: 82, progressive: true, mozjpeg: true })
  .toFile(temporary);

await rename(temporary, output);
const { size } = await stat(output);
console.log(`[performance] Optimized social preview image: ${Math.round(size / 1024)} KB.`);
