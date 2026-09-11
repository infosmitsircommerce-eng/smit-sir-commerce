import { access, readFile, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const DIST = join(ROOT, 'dist');
const BASE = 'https://www.smitsircommerce.in';
const sitemap = await readFile(join(ROOT, 'public', 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>(https:\/\/www\.smitsircommerce\.in[^<]*)<\/loc>/g)].map((match) => match[1]);

async function exists(file) {
  try {
    await access(file, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function candidates(pathname) {
  if (pathname === '/') return [join(DIST, 'index.html')];
  const clean = pathname.replace(/^\//, '');
  if (clean.endsWith('.html')) return [join(DIST, clean)];
  return [join(DIST, `${clean}.html`), join(DIST, clean, 'index.html')];
}

let fixed = 0;
for (const url of urls) {
  const pathname = new URL(url).pathname;
  const files = candidates(pathname);
  for (const file of files) {
    if (!(await exists(file))) continue;
    const before = await readFile(file, 'utf8');
    const withoutCanonicals = before.replace(/<link\s+[^>]*rel=["']canonical["'][^>]*>\s*/gi, '');
    const after = withoutCanonicals.replace('</head>', `<link rel="canonical" href="${url}">\n</head>`);
    if (after !== before) {
      await writeFile(file, after, 'utf8');
      fixed += 1;
    }
  }
}

console.log(`Normalized final canonical tags in ${fixed} sitemap HTML files.`);
