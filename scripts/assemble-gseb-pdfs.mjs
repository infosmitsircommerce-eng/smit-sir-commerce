import { gunzipSync } from 'node:zlib';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const bundleDir = join(root, 'assets', 'gseb-pdf-bundle');
const legacyPartsDir = join(root, 'assets', 'gseb-pdf-archive');
const publicDir = join(root, 'public');

async function readEncodedArchive() {
  try {
    const bundleNames = (await readdir(bundleDir))
      .filter((name) => /^bundle-\d+\.b64$/.test(name))
      .sort();
    if (bundleNames.length) {
      let base64 = '';
      for (const name of bundleNames) {
        base64 += (await readFile(join(bundleDir, name), 'utf8')).trim();
      }
      console.log(`Using ${bundleNames.length} GSEB PDF bundle parts.`);
      return base64;
    }
  } catch {
    // Fall through to the legacy archive while the new bundle is not present.
  }

  try {
    const partNames = (await readdir(legacyPartsDir))
      .filter((name) => /^part-\d+\.b64$/.test(name))
      .sort();
    if (!partNames.length) return '';
    let base64 = '';
    for (const name of partNames) {
      base64 += (await readFile(join(legacyPartsDir, name), 'utf8')).trim();
    }
    return base64;
  } catch {
    return '';
  }
}

const base64 = await readEncodedArchive();
if (!base64) {
  console.warn('GSEB PDF archive is missing; skipping PDF assembly.');
  process.exit(0);
}

let tar;
try {
  tar = gunzipSync(Buffer.from(base64, 'base64'));
} catch (error) {
  console.warn(
    `GSEB PDF archive is incomplete or invalid (${error?.code || error?.message || 'unknown error'}); skipping PDF assembly so the site can still deploy.`
  );
  process.exit(0);
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
