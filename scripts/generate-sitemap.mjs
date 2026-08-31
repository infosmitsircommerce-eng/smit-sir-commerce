import { writeFile } from 'node:fs/promises';
import { seoHubs, seoMaterials } from '../src/data/seoMaterials.js';

const BASE = 'https://www.smitsircommerce.in';
const basePages = [
  ['/', 'weekly', '1.0'],
  ['/courses', 'weekly', '0.9'],
  ['/study-material', 'weekly', '0.9'],
  ['/quizzes', 'weekly', '0.7'],
  ['/test-series', 'weekly', '0.7'],
  ['/live-classes', 'weekly', '0.7'],
  ['/online-batch', 'monthly', '0.8'],
  ['/offline-batch', 'monthly', '0.8'],
  ['/about', 'monthly', '0.6'],
  ['/contact', 'monthly', '0.7'],
  ['/faq', 'monthly', '0.6'],
];

function urlEntry(path, changefreq, priority, lastmod = '') {
  return [
    '  <url>',
    `    <loc>${BASE}${path}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : '',
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].filter(Boolean).join('\n');
}

const entries = [
  ...basePages.map(([path, frequency, priority]) => urlEntry(path, frequency, priority)),
  ...seoHubs.map((hub) => urlEntry(hub.path, 'weekly', '0.9', '2026-08-31')),
  ...seoMaterials.map((material) => urlEntry(material.seo_path, 'monthly', '0.8', material.updated)),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`;

await writeFile(new URL('../public/sitemap.xml', import.meta.url), xml, 'utf8');
console.log(`Generated sitemap with ${entries.length} indexable URLs.`);

