import { readFile, writeFile } from 'node:fs/promises';
import { netGsetSeoPaths } from '../src/data/netGsetSeoUnits.js';

const BASE = 'https://www.smitsircommerce.in';
const mainSitemapPath = new URL('../public/sitemap.xml', import.meta.url);
const dedicatedSitemapPath = new URL('../public/sitemap-net-gset.xml', import.meta.url);
const masterLibraryPath = '/net-gset-commerce';

function xmlEscape(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function entry(path) {
  const priority = path === masterLibraryPath ? '0.99' : path.includes('/unit-') ? '0.94' : '0.97';
  return `  <url>\n    <loc>${xmlEscape(`${BASE}${path}`)}</loc>\n    <lastmod>2026-09-26</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

// The master library contains client-side template hrefs used to open/download PDFs.
// Keep it in its dedicated sitemap, while the static search landing pages go in
// the main sitemap that is subjected to the strict static-link build audit.
const mainSearchPaths = netGsetSeoPaths.filter((path) => path !== masterLibraryPath);

let mainXml = await readFile(mainSitemapPath, 'utf8');
const additions = [];
for (const path of mainSearchPaths) {
  const loc = `${BASE}${path}`;
  if (!mainXml.includes(`<loc>${xmlEscape(loc)}</loc>`)) additions.push(entry(path));
}
if (additions.length) {
  mainXml = mainXml.replace('</urlset>', `${additions.join('\n')}\n</urlset>`);
  await writeFile(mainSitemapPath, mainXml, 'utf8');
}

const dedicatedXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${netGsetSeoPaths.map(entry).join('\n')}\n</urlset>\n`;
await writeFile(dedicatedSitemapPath, dedicatedXml, 'utf8');

console.log(`NET/GSET search cluster: ${netGsetSeoPaths.length} URLs in dedicated sitemap; ${mainSearchPaths.length} static search URLs covered by the main sitemap.`);
