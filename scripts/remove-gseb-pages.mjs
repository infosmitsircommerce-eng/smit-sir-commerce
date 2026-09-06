import { readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = join(root, 'dist');

const removeTargets = [
  'gseb-class-12-economics.html',
  'gseb-class-12-economics-practice.html',
  'gseb',
  join('hi', 'gseb-class-12-economics'),
  join('gu', 'gseb-class-12-economics'),
  join('hi', 'gseb-class-12-economics.html'),
  join('gu', 'gseb-class-12-economics.html'),
];

for (const target of removeTargets) {
  await rm(join(dist, target), { recursive: true, force: true });
}

async function walk(dir) {
  let entries = [];
  try { entries = await readdir(dir); } catch { return; }
  for (const name of entries) {
    const path = join(dir, name);
    const info = await stat(path);
    if (info.isDirectory()) {
      await walk(path);
      continue;
    }
    if (!name.endsWith('.html')) continue;
    let html = await readFile(path, 'utf8');
    const before = html;
    html = html
      .replaceAll('href="/gseb-class-12-economics.html"', 'href="/study-material"')
      .replaceAll("href='/gseb-class-12-economics.html'", "href='/study-material'")
      .replaceAll('href="/gseb-class-12-economics-practice.html"', 'href="/study-material"')
      .replaceAll("href='/gseb-class-12-economics-practice.html'", "href='/study-material'")
      .replaceAll('https://www.smitsircommerce.in/gseb-class-12-economics.html', 'https://www.smitsircommerce.in/study-material')
      .replaceAll('https://www.smitsircommerce.in/gseb-class-12-economics-practice.html', 'https://www.smitsircommerce.in/study-material');
    if (html !== before) await writeFile(path, html, 'utf8');
  }
}

await walk(dist);

const sitemapPath = join(dist, 'sitemap.xml');
try {
  let xml = await readFile(sitemapPath, 'utf8');
  xml = xml.replace(/\s*<url>[\s\S]*?<loc>[^<]*gseb-class-12-economics[^<]*<\/loc>[\s\S]*?<\/url>/g, '');
  await writeFile(sitemapPath, xml, 'utf8');
} catch {}

console.log('Removed all GSEB Class 12 Economics pages and stale internal links from the production build.');
