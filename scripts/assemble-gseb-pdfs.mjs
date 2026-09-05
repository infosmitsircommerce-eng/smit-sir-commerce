import { brotliDecompressSync, gunzipSync } from 'node:zlib';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const unicodeBundleDir = join(root, 'assets', 'gseb-pdf-bundle-v4');
const brotliBundleDir = join(root, 'assets', 'gseb-pdf-bundle-v3');
const bundleDir = join(root, 'assets', 'gseb-pdf-bundle');
const legacyPartsDir = join(root, 'assets', 'gseb-pdf-archive');
const publicDir = join(root, 'public');
const BROTLI_BYTE_LENGTH = 254107;

async function readParts(dir, pattern) {
  const names = (await readdir(dir)).filter((name) => pattern.test(name)).sort();
  if (!names.length) return '';
  let text = '';
  for (const name of names) text += (await readFile(join(dir, name), 'utf8')).trim();
  return text;
}

function decode15(text, byteLength) {
  const out = Buffer.alloc(byteLength);
  let bits = 0, nbits = 0, offset = 0;
  for (const ch of text) {
    const v = ch.codePointAt(0) - 0x3400;
    if (v < 0 || v > 0x7fff) throw new Error('Invalid Unicode bundle character');
    bits = (bits * 32768) + v;
    nbits += 15;
    while (nbits >= 8 && offset < byteLength) {
      nbits -= 8;
      out[offset++] = Math.floor(bits / (2 ** nbits)) & 255;
      bits %= 2 ** nbits;
    }
  }
  if (offset !== byteLength) throw new Error(`Unicode bundle decoded ${offset}/${byteLength} bytes`);
  return out;
}

let tar;
try {
  const packed = await readParts(unicodeBundleDir, /^bundle-\d+\.txt$/);
  if (packed) {
    tar = brotliDecompressSync(decode15(packed, BROTLI_BYTE_LENGTH));
    console.log('Using compact Unicode GSEB PDF bundle.');
  }
} catch (error) {
  console.warn(`Unicode GSEB PDF bundle unavailable (${error?.code || error?.message || 'unknown error'}).`);
}

if (!tar) {
  try {
    const base64 = await readParts(brotliBundleDir, /^bundle-\d+\.b64$/);
    if (base64) tar = brotliDecompressSync(Buffer.from(base64, 'base64'));
  } catch {}
}

if (!tar) {
  let base64 = '';
  try { base64 = await readParts(bundleDir, /^bundle-\d+\.b64$/); } catch {}
  if (!base64) try { base64 = await readParts(legacyPartsDir, /^part-\d+\.b64$/); } catch {}
  if (!base64) { console.warn('GSEB PDF archive is missing; skipping PDF assembly.'); process.exit(0); }
  try { tar = gunzipSync(Buffer.from(base64, 'base64')); }
  catch (error) { console.warn(`GSEB PDF archive is invalid (${error?.code || error?.message || 'unknown error'}); skipping PDF assembly.`); process.exit(0); }
}

let offset = 0, written = 0;
const readString = (buffer, start, length) => buffer.subarray(start, start + length).toString('utf8').replace(/\0.*$/s, '').trim();
while (offset + 512 <= tar.length) {
  const header = tar.subarray(offset, offset + 512);
  if (header.every((byte) => byte === 0)) break;
  const name = readString(header, 0, 100), prefix = readString(header, 345, 155);
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
console.log(`Assembled ${written} GSEB Class 12 Economics PDFs.`);
if (written !== 10) process.exitCode = 1;
