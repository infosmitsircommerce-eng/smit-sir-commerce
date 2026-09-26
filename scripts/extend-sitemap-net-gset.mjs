import { readFile, writeFile } from 'node:fs/promises';
import { netGsetSeoPaths } from '../src/data/netGsetSeoUnits.js';

const BASE = 'https://www.smitsircommerce.in';
const sitemapPath = new URL('../public/sitemap.xml', import.meta.url);
let xml = await readFile(sitemapPath, 'utf8');

function xmlEscape(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const additions = [];
for (const path of netGsetSeoPaths) {
  const loc = `${BASE}${path}`;
  if (xml.includes(`<loc>${xmlEscape(loc)}</loc>`)) continue;
  const priority = path === '/net-gset-commerce' ? '0.99' : path.includes('/unit-') ? '0.94' : '0.97';
  additions.push(`  <url>\n    <loc>${xmlEscape(loc)}</loc>\n    <lastmod>2026-09-26</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>`);
}

if (additions.length) {
  xml = xml.replace('</urlset>', `${additions.join('\n')}\n</urlset>`);
  await writeFile(sitemapPath, xml, 'utf8');
}

console.log(`NET/GSET sitemap coverage: ${netGsetSeoPaths.length} target URLs, ${additions.length} newly added.`);
