import { brotliDecompressSync, gunzipSync } from 'node:zlib';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const brotliBundleDir = join(root, 'assets', 'gseb-pdf-bundle-v3');
const bundleDir = join(root, 'assets', 'gseb-pdf-bundle');
const legacyPartsDir = join(root, 'assets', 'gseb-pdf-archive');
const publicDir = join(root, 'public');

async function readParts(dir, pattern) {
  const names = (await readdir(dir)).filter((name) => pattern.test(name)).sort();
  if (!names.length) return '';
  let base64 = '';
  for (const name of names) base64 += (await readFile(join(dir, name), 'utf8')).trim();
  return base64;
}

let tar;
try {
  const base64 = await readParts(brotliBundleDir, /^bundle-\d+\.b64$/);
  if (base64) {
    tar = brotliDecompressSync(Buffer.from(base64, 'base64'));
    console.log('Using Brotli GSEB PDF bundle.');
  }
} catch (error) {
  console.warn(`Brotli GSEB PDF bundle unavailable (${error?.code || error?.message || 'unknown error'}).`);
}

if (!tar) {
  let base64 = '';
  try { base64 = await readParts(bundleDir, /^bundle-\d+\.b64$/); } catch {}
  if (!base64) {
    try { base64 = await readParts(legacyPartsDir, /^part-\d+\.b64$/); } catch {}
  }
  if (!base64) {
    console.warn('GSEB PDF archive is missing; skipping PDF assembly.');
    process.exit(0);
  }
  try {
    tar = gunzipSync(Buffer.from(base64, 'base64'));
  } catch (error) {
    console.warn(`GSEB PDF archive is incomplete or invalid (${error?.code || error?.message || 'unknown error'}); skipping PDF assembly so the site can still deploy.`);
    process.exit(0);
  }
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
  if ((type === '0' || type === '\0') && path.startsWith('materials/gseb/') && path.endsWith('.pdf')) {
    const target = join(publicDir, path);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, body);
    written += 1;
  }
  offset += Math.ceil(size / 512) * 512;
}
if (written !== 10) {
  console.warn(`GSEB PDF archive assembled ${written}/10 PDFs; continuing deployment without failing the full site build.`);
} else {
  console.log(`Assembled ${written} GSEB Class 12 Economics PDFs.`);
}
