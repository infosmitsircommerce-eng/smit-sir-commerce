import { readFile, writeFile } from 'node:fs/promises';

const sitemapUrl = new URL('../public/sitemap.xml', import.meta.url);
const canonical = 'https://www.smitsircommerce.in/premium/cbse-12-business-studies';
const xml = await readFile(sitemapUrl, 'utf8');

if (xml.includes(`<loc>${canonical}</loc>`)) {
  console.log('[premium-sitemap] CBSE 12 Business Studies Premium is already listed.');
  process.exit(0);
}

if (!xml.includes('</urlset>')) {
  throw new Error('[premium-sitemap] sitemap.xml is missing </urlset>.');
}

const entry = [
  '  <url>',
  `    <loc>${canonical}</loc>`,
  '    <changefreq>weekly</changefreq>',
  '    <priority>0.92</priority>',
  '  </url>',
].join('\n');

await writeFile(sitemapUrl, xml.replace('</urlset>', `${entry}\n</urlset>`), 'utf8');
console.log('[premium-sitemap] Added CBSE 12 Business Studies Premium to the focused sitemap.');
