import { writeFile } from 'node:fs/promises';
import { seoHubs, seoMaterials } from '../src/data/seoMaterials.js';
import { growthManifest } from './growth-manifest.mjs';
import { examTests } from '../src/data/examBank.js';

const BASE = 'https://www.smitsircommerce.in';
const basePages = [
  ['/', 'weekly', '1.0'],
  ['/courses', 'weekly', '0.9'],
  ['/study-material', 'weekly', '0.9'],
  ['/cbse-notes', 'weekly', '1.0'],
  ['/cbse-practice', 'weekly', '1.0'],
  ['/quizzes', 'weekly', '0.7'],
  ['/test-series', 'weekly', '0.8'],
  ['/exam-mode', 'weekly', '0.9'],
  ['/daily-practice', 'weekly', '0.7'],
  ['/study-coach', 'weekly', '0.7'],
  ['/study-tools', 'weekly', '0.7'],
  ['/live-classes', 'weekly', '0.7'],
  ['/online-batch', 'monthly', '0.8'],
  ['/offline-batch', 'monthly', '0.8'],
  ['/book-demo', 'monthly', '0.9'],
  ['/about', 'monthly', '0.6'],
  ['/contact', 'monthly', '0.7'],
  ['/faq', 'monthly', '0.6'],
  ['/privacy', 'yearly', '0.3'],
  ['/terms', 'yearly', '0.3'],
  ['/access-policy', 'yearly', '0.4'],
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
  ...growthManifest.map((page) => urlEntry(page.path, 'monthly', page.type === 'mcqs' || page.type === 'important-questions' ? '0.82' : '0.76', page.updated)),
  ...examTests.map((test) => urlEntry(`/tests/${test.slug}`, 'monthly', '0.75', '2026-09-01')),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`;

await writeFile(new URL('../public/sitemap.xml', import.meta.url), xml, 'utf8');
console.log(`Generated sitemap with ${entries.length} indexable URLs (${growthManifest.length} chapter-practice pages).`);
