import { gunzipSync } from 'node:zlib';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const archivePath = join(root, 'assets', 'gseb-class-12-economics.tar.gz');
const publicDir = join(root, 'public');

let tar;
try {
  tar = gunzipSync(await readFile(archivePath));
} catch (error) {
  console.error(`Unable to read GSEB PDF archive: ${error?.message || error}`);
  process.exit(1);
}

let offset = 0;
let written = 0;
function readString(buffer, start, length) {
  return buffer.subarray(start, start + length).toString('utf8').replace(/\0.*$/s, '').trim();
}

while (offset + 512 <= tar.length) {
  const header = tar.subarray(offset, offset + 512);
  if (header.every((byte) => byte === 0)) break;
  const name = readString(header, 0, 100);
  const prefix = readString(header, 345, 155);
  const path = prefix ? `${prefix}/${name}` : name;
  const sizeText = readString(header, 124, 12).replace(/\s/g, '');
  const size = sizeText ? parseInt(sizeText, 8) : 0;
  const type = String.fromCharCode(header[156] || 48);
  offset += 512;
  const body = tar.subarray(offset, offset + size);
  if ((type === '0' || type === '\0') && path.startsWith('materials/gseb/class-12/economics/') && path.endsWith('.pdf')) {
    const target = join(publicDir, path);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, body);
    written += 1;
  }
  offset += Math.ceil(size / 512) * 512;
}

if (written !== 10) {
  console.error(`GSEB PDF archive assembled ${written}/10 PDFs.`);
  process.exit(1);
}
console.log('Assembled 10 GSEB Class 12 Economics PDFs.');
