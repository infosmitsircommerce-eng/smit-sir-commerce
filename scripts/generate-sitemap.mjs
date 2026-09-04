import { writeFile } from 'node:fs/promises';
import { seoHubs, seoMaterials } from '../src/data/seoMaterials.js';
import { gsebMaterials } from '../src/data/gsebMaterials.js';
import { authorityGuides } from '../src/data/authorityGuides.js';
import { localSeoPages } from '../src/data/localSeoPages.js';
import { commerceTools } from '../src/data/allCommerceTools.js';
import { toolClusters } from '../src/data/toolClusters.js';
import { localizedPilotPages, localizedAlternatesByPath } from '../src/data/localizedPilot.js';
import { growthManifest } from './growth-manifest.mjs';
import { examTests } from '../src/data/examBank.js';
import { fetchPublishedCommerceResources, publishedDegreeState } from './commerce-resource-manifest.mjs';

const BASE = 'https://www.smitsircommerce.in';
const publishedCommerceResources = await fetchPublishedCommerceResources();
const degreeState = publishedDegreeState(publishedCommerceResources);
const basePages = [
  ['/', 'weekly', '1.0'], ['/commerce-learning', 'weekly', '0.98'], ['/college-commerce', 'weekly', '0.85'], ['/commerce-exams', 'weekly', '0.9'], ['/ugc-net-commerce', 'weekly', '0.9'], ['/gset-commerce', 'weekly', '0.9'], ['/courses', 'weekly', '0.9'], ['/study-material', 'weekly', '0.9'],
  ['/cbse-notes', 'weekly', '1.0'], ['/cbse-practice', 'weekly', '1.0'], ['/cbse-pyq', 'weekly', '0.9'],
  ['/free-commerce-study-pack', 'weekly', '1.0'], ['/marks-recovery', 'weekly', '1.0'], ['/tools', 'weekly', '1.0'], ['/commerce-coaching-mehsana', 'weekly', '1.0'],
  ['/gseb-class-12-economics.html', 'weekly', '0.95'], ['/gseb-class-12-economics-practice.html', 'weekly', '0.9'],
  ['/quizzes', 'weekly', '0.7'], ['/test-series', 'weekly', '0.8'], ['/exam-mode', 'weekly', '0.9'],
  ['/daily-practice', 'weekly', '0.7'], ['/study-coach', 'weekly', '0.7'], ['/study-tools', 'weekly', '0.7'],
  ['/live-classes', 'weekly', '0.7'], ['/online-batch', 'monthly', '0.8'], ['/offline-batch', 'monthly', '0.8'],
  ['/book-demo', 'monthly', '0.9'], ['/about', 'monthly', '0.6'], ['/contact', 'monthly', '0.7'],
  ['/faq', 'monthly', '0.6'], ['/privacy', 'yearly', '0.3'], ['/terms', 'yearly', '0.3'], ['/access-policy', 'yearly', '0.4'],
];

const activeCollegePages = [
  ...(degreeState.bcom ? [['/college-commerce/bcom', 'weekly', '0.88']] : []),
  ...(degreeState.mcom ? [['/college-commerce/mcom', 'weekly', '0.88']] : []),
];

function urlEntry(path, changefreq, priority, lastmod='') {
  const alternates = localizedAlternatesByPath[path] || [];
  return [
    '  <url>',
    `    <loc>${BASE}${path}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : '',
    ...alternates.map((item) => `    <xhtml:link rel="alternate" hreflang="${item.hreflang}" href="${item.href}" />`),
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].filter(Boolean).join('\n');
}

const entries=[
  ...basePages.map(([p,f,pr])=>urlEntry(p,f,pr)),
  ...activeCollegePages.map(([p,f,pr])=>urlEntry(p,f,pr)),
  ...publishedCommerceResources.map((resource)=>urlEntry(resource.path,'weekly','0.86',String(resource.updatedAt || '').slice(0,10))),
  ...toolClusters.map(cluster=>urlEntry(`/tools/topics/${cluster.slug}`,'weekly','0.96','2026-09-03')),
  ...commerceTools.map(tool=>urlEntry(`/tools/${tool.slug}`,'monthly','0.92','2026-09-03')),
  ...localSeoPages.map(page=>urlEntry(page.path,'weekly','0.95','2026-09-03')),
  ...seoHubs.map(h=>urlEntry(h.path,'weekly','0.9','2026-08-31')),
  ...seoMaterials.map(m=>urlEntry(m.seo_path,'monthly','0.8',m.updated)),
  ...gsebMaterials.map(m=>urlEntry(m.seo_path,'monthly','0.86',m.updated || '2026-09-02')),
  ...authorityGuides.map(g=>urlEntry(g.path,'weekly','0.9',g.updated)),
  ...growthManifest.map(p=>urlEntry(p.path,'monthly',p.type==='mcqs'||p.type==='important-questions'?'0.82':'0.76',p.updated)),
  ...examTests.map(t=>urlEntry(`/tests/${t.slug}`,'monthly','0.75','2026-09-01')),
  ...localizedPilotPages.map((page)=>urlEntry(page.path,'weekly','0.86',page.updated)),
];

const xml=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>\n`;
await writeFile(new URL('../public/sitemap.xml',import.meta.url),xml,'utf8');
console.log(`Generated sitemap with ${entries.length} indexable URLs (${publishedCommerceResources.length} published college/competitive Commerce resources, ${commerceTools.length} Commerce calculator pages, ${toolClusters.length} Commerce topic clusters, ${localizedPilotPages.length} Hindi/Gujarati pilot pages, ${localSeoPages.length} Mehsana local pages, ${gsebMaterials.length} GSEB chapter pages).`);
