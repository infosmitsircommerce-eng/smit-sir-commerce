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
import { deriveCommerceDiscoveryCollections } from '../src/lib/commerceDiscovery.js';

const BASE = 'https://www.smitsircommerce.in';
const publishedCommerceResources = await fetchPublishedCommerceResources();
const degreeState = publishedDegreeState(publishedCommerceResources);
const commerceDiscoveryCollections = deriveCommerceDiscoveryCollections(publishedCommerceResources);
const basePages = [
  ['/', 'weekly', '1.0'], ['/commerce-learning', 'weekly', '0.98'], ['/college-commerce', 'weekly', '0.85'], ['/commerce-exams', 'weekly', '0.9'], ['/ugc-net-commerce', 'weekly', '0.9'], ['/gset-commerce', 'weekly', '0.9'], ['/courses', 'weekly', '0.82'], ['/study-material', 'weekly', '1.0'],
  ['/free-commerce-notes.html', 'weekly', '0.99'], ['/cbse-commerce-notes.html', 'weekly', '0.98'], ['/gseb-class-12-economics-notes-pdf.html', 'weekly', '0.98'], ['/free-commerce-tools.html', 'weekly', '0.94'],
  ['/cbse-notes', 'weekly', '1.0'], ['/cbse-practice', 'weekly', '0.95'], ['/cbse-pyq', 'weekly', '0.9'],
  ['/free-commerce-study-pack', 'weekly', '0.92'], ['/marks-recovery', 'weekly', '0.86'], ['/tools', 'weekly', '0.96'], ['/commerce-coaching-mehsana', 'weekly', '0.92'],
  ['/gseb-class-12-economics.html', 'weekly', '0.98'], ['/gseb-class-12-economics-practice.html', 'weekly', '0.92'],
  ['/quizzes', 'weekly', '0.7'], ['/test-series', 'weekly', '0.72'], ['/exam-mode', 'weekly', '0.75'],
  ['/daily-practice', 'weekly', '0.9'], ['/study-coach', 'weekly', '0.72'], ['/study-tools', 'weekly', '0.8'],
  ['/live-classes', 'weekly', '0.55'], ['/online-batch', 'monthly', '0.55'], ['/offline-batch', 'monthly', '0.55'],
  ['/about', 'monthly', '0.6'], ['/contact', 'monthly', '0.76'],
  ['/faq', 'monthly', '0.6'], ['/privacy', 'yearly', '0.3'], ['/terms', 'yearly', '0.3'], ['/access-policy', 'yearly', '0.4'],
];

const activeCollegePages = [
  ...(degreeState.bcom ? [['/college-commerce/bcom', 'weekly', '0.88']] : []),
  ...(degreeState.mcom ? [['/college-commerce/mcom', 'weekly', '0.88']] : []),
];

function toAbsoluteUrl(path) {
  return path.startsWith('http') ? path : `${BASE}${path}`;
}

function xmlEscape(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function urlEntry(path, changefreq, priority, lastmod='') {
  const alternates = path.startsWith('http') ? [] : (localizedAlternatesByPath[path] || []);
  return [
    '  <url>',
    `    <loc>${xmlEscape(toAbsoluteUrl(path))}</loc>`,
    lastmod ? `    <lastmod>${xmlEscape(lastmod)}</lastmod>` : '',
    ...alternates.map((item) => `    <xhtml:link rel="alternate" hreflang="${xmlEscape(item.hreflang)}" href="${xmlEscape(item.href)}" />`),
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].filter(Boolean).join('\n');
}

const entries=[
  ...basePages.map(([p,f,pr])=>urlEntry(p,f,pr)),
  ...activeCollegePages.map(([p,f,pr])=>urlEntry(p,f,pr)),
  ...publishedCommerceResources.map((resource)=>urlEntry(resource.path,'weekly','0.86',String(resource.updatedAt || '').slice(0,10))),
  ...commerceDiscoveryCollections.map((collection)=>urlEntry(collection.path,'weekly',collection.type === 'college-subject' ? '0.84' : '0.82',String(publishedCommerceResources.find((resource)=>collection.resources?.includes(resource.slug))?.updatedAt || '').slice(0,10))),
  ...toolClusters.map(cluster=>urlEntry(`/tools/topics/${cluster.slug}`,'weekly','0.96','2026-09-03')),
  ...commerceTools.map(tool=>urlEntry(`/tools/${tool.slug}`,'monthly','0.92','2026-09-03')),
  ...localSeoPages.map(page=>urlEntry(page.path,'weekly','0.95','2026-09-03')),
  ...seoHubs.map(h=>urlEntry(h.path,'weekly','0.92','2026-09-06')),
  ...seoMaterials.map(m=>urlEntry(m.seo_path,'monthly','0.82',m.updated)),
  ...gsebMaterials.map(m=>urlEntry(m.seo_path,'weekly','0.9',m.updated || '2026-09-06')),
  ...authorityGuides.map(g=>urlEntry(g.path,'weekly','0.9',g.updated)),
  ...growthManifest.filter((p)=>p.indexable).map(p=>urlEntry(p.path,'monthly','0.82',p.updated)),
  ...examTests.map(t=>urlEntry(`/tests/${t.slug}`,'monthly','0.75','2026-09-01')),
  ...localizedPilotPages.map((page)=>urlEntry(page.path,'weekly','0.86',page.updated)),
];

const uniqueEntries = [...new Map(entries.map((entry) => [entry.match(/<loc>(.*?)<\/loc>/)?.[1] || entry, entry])).values()];

const xml=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${uniqueEntries.join('\n')}\n</urlset>\n`;
await writeFile(new URL('../public/sitemap.xml',import.meta.url),xml,'utf8');
console.log(`Generated sitemap with ${uniqueEntries.length} unique indexable HTML URLs (${publishedCommerceResources.length} published college/competitive Commerce resources, ${commerceDiscoveryCollections.length} live discovery collection pages, ${commerceTools.length} Commerce calculator pages, ${toolClusters.length} Commerce topic clusters, ${localizedPilotPages.length} Hindi/Gujarati pilot pages, ${localSeoPages.length} Mehsana local pages and ${gsebMaterials.length} GSEB chapter pages).`);
