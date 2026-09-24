import { access, readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { PREMIUM_MEGA_PACK } from '../src/data/premiumMegaPack.js';

const DIST = new URL('../dist/', import.meta.url);
const currentPrice = `₹${PREMIUM_MEGA_PACK.price}`;
const replacements = [
  ['₹699 Commerce Mega Premium', `${currentPrice} Commerce Mega Premium`],
  ['for ₹699 one time', `for ${currentPrice} one time`],
  ['access for ₹699', `access for ${currentPrice}`],
  ['The ₹699 Commerce Mega Premium Pack', `The ${currentPrice} Commerce Mega Premium Pack`],
  ['What the ₹699 Mega Premium includes', `What the ${currentPrice} Mega Premium includes`],
  ['separate ₹699 Mega Premium plan', `separate ${currentPrice} Mega Premium plan`],
  ['₹699 Mega Premium option', `${currentPrice} Mega Premium option`],
];

async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await htmlFiles(full));
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(full);
  }
  return files;
}

try {
  await access(DIST);
} catch {
  console.log('[premium-pricing] dist/ is unavailable; nothing to normalize.');
  process.exit(0);
}

let changedFiles = 0;
let replacementsMade = 0;
const files = await htmlFiles(DIST.pathname);
for (const file of files) {
  const before = await readFile(file, 'utf8');
  let after = before;
  for (const [stale, fresh] of replacements) {
    const count = after.split(stale).length - 1;
    if (!count) continue;
    after = after.replaceAll(stale, fresh);
    replacementsMade += count;
  }
  if (after !== before) {
    await writeFile(file, after, 'utf8');
    changedFiles += 1;
  }
}

const staleMegaPrice = /₹699[^<]{0,100}(?:Mega Premium|Commerce Mega Premium)|(?:Mega Premium|Commerce Mega Premium)[^<]{0,100}₹699/i;
const leftovers = [];
for (const file of files) {
  const html = await readFile(file, 'utf8');
  if (staleMegaPrice.test(html)) leftovers.push(file.replace(DIST.pathname, 'dist/'));
}
if (leftovers.length) {
  throw new Error(`[premium-pricing] stale ₹699 Mega Premium copy remains in: ${leftovers.slice(0, 12).join(', ')}`);
}

console.log(`[premium-pricing] canonical Mega Premium price ${currentPrice}; normalized ${replacementsMade} occurrence(s) across ${changedFiles} HTML file(s).`);
