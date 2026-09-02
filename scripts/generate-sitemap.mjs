import { writeFile } from 'node:fs/promises';
import { seoHubs, seoMaterials } from '../src/data/seoMaterials.js';
import { gsebMaterials } from '../src/data/gsebMaterials.js';
import { authorityGuides } from '../src/data/authorityGuides.js';
import { localSeoPages } from '../src/data/localSeoPages.js';
import { growthManifest } from './growth-manifest.mjs';
import { examTests } from '../src/data/examBank.js';

const BASE = 'https://www.smitsircommerce.in';
const basePages = [
  ['/', 'weekly', '1.0'], ['/courses', 'weekly', '0.9'], ['/study-material', 'weekly', '0.9'],
  ['/cbse-notes', 'weekly', '1.0'], ['/cbse-practice', 'weekly', '1.0'], ['/cbse-pyq', 'weekly', '0.9'],
  ['/commerce-coaching-mehsana', 'weekly', '1.0'],
  ['/gseb-class-12-economics.html', 'weekly', '0.95'], ['/gseb-class-12-economics-practice.html', 'weekly', '0.9'],
  ['/quizzes', 'weekly', '0.7'], ['/test-series', 'weekly', '0.8'], ['/exam-mode', 'weekly', '0.9'],
  ['/daily-practice', 'weekly', '0.7'], ['/study-coach', 'weekly', '0.7'], ['/study-tools', 'weekly', '0.7'],
  ['/live-classes', 'weekly', '0.7'], ['/online-batch', 'monthly', '0.8'], ['/offline-batch', 'monthly', '0.8'],
  ['/book-demo', 'monthly', '0.9'], ['/about', 'monthly', '0.6'], ['/contact', 'monthly', '0.7'],
  ['/faq', 'monthly', '0.6'], ['/privacy', 'yearly', '0.3'], ['/terms', 'yearly', '0.3'], ['/access-policy', 'yearly', '0.4'],
];
function urlEntry(path, changefreq, priority, lastmod=''){return ['  <url>',`    <loc>${BASE}${path}</loc>`,lastmod?`    <lastmod>${lastmod}</lastmod>`:'',`    <changefreq>${changefreq}</changefreq>`,`    <priority>${priority}</priority>`,'  </url>'].filter(Boolean).join('\n')}
const entries=[
  ...basePages.map(([p,f,pr])=>urlEntry(p,f,pr)),
  ...localSeoPages.map(page=>urlEntry(page.path,'weekly','0.95','2026-09-03')),
  ...seoHubs.map(h=>urlEntry(h.path,'weekly','0.9','2026-08-31')),
  ...seoMaterials.map(m=>urlEntry(m.seo_path,'monthly','0.8',m.updated)),
  ...gsebMaterials.map(m=>urlEntry(m.seo_path,'monthly','0.86',m.updated || '2026-09-02')),
  ...authorityGuides.map(g=>urlEntry(g.path,'weekly','0.9',g.updated)),
  ...growthManifest.map(p=>urlEntry(p.path,'monthly',p.type==='mcqs'||p.type==='important-questions'?'0.82':'0.76',p.updated)),
  ...examTests.map(t=>urlEntry(`/tests/${t.slug}`,'monthly','0.75','2026-09-01'))
];
const xml=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`;
await writeFile(new URL('../public/sitemap.xml',import.meta.url),xml,'utf8');
console.log(`Generated sitemap with ${entries.length} indexable URLs (${localSeoPages.length} Mehsana local pages, ${gsebMaterials.length} GSEB chapter pages, ${authorityGuides.length} evergreen guides, ${growthManifest.length} CBSE chapter-practice pages).`);
