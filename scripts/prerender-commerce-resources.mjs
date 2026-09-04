import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fetchPublishedCommerceResources } from './commerce-resource-manifest.mjs';
import { commerceResourceContext, resourceSeoTitle } from '../src/lib/commerceResourceModel.js';

const BASE = 'https://www.smitsircommerce.in';
const SITE = 'Smit Sir Commerce';
const source = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const distRoot = new URL('../dist/', import.meta.url);
const resources = await fetchPublishedCommerceResources();

function esc(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function parentPath(resource) {
  if (resource.stage === 'college') {
    if (resource.degree === 'B.Com') return '/college-commerce/bcom';
    if (resource.degree === 'M.Com') return '/college-commerce/mcom';
    return '/college-commerce';
  }
  if (resource.stage === 'competitive') {
    if (resource.exam === 'UGC NET Commerce') return '/ugc-net-commerce';
    if (resource.exam === 'GSET Commerce') return '/gset-commerce';
    return '/commerce-exams';
  }
  return '/study-material';
}

function parentLabel(resource) {
  if (resource.stage === 'college') return resource.degree || 'College Commerce';
  if (resource.stage === 'competitive') return resource.exam || 'Commerce Exams';
  return 'Study Material';
}

async function writeRoute(path, html) {
  const relative = path.replace(/^\//, '');
  const clean = join(distRoot.pathname, relative + '.html');
  const directory = join(distRoot.pathname, relative, 'index.html');
  await mkdir(dirname(clean), { recursive: true });
  await mkdir(dirname(directory), { recursive: true });
  await writeFile(clean, html, 'utf8');
  await writeFile(directory, html, 'utf8');
}

for (const resource of resources) {
  if (!resource.path || !resource.title || !resource.description) continue;

  const canonical = BASE + resource.path;
  const title = resource.seoTitle || resourceSeoTitle(resource);
  const fullTitle = title + ' | ' + SITE;
  const description = resource.seoDescription || resource.description;
  const fileUrl = resource.fileUrl || resource.externalUrl || '';
  const context = commerceResourceContext(resource);
  const sourceLabel = resource.sourceLabel || (resource.isOfficial ? (resource.exam || resource.university || 'Official source') : 'Smit Sir Commerce resource library');
  const robots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    '@id': canonical + '#resource',
    url: canonical,
    name: resource.title,
    description,
    learningResourceType: resource.resourceType,
    educationalLevel: context,
    inLanguage: resource.language || 'en-IN',
    isAccessibleForFree: resource.isFree !== false,
    ...(fileUrl ? { associatedMedia: { '@type': 'MediaObject', contentUrl: fileUrl } } : {}),
    ...(resource.sourceLabel ? { publisher: { '@type': 'Organization', name: resource.sourceLabel } } : {}),
  };

  const tags = [
    '<meta name="description" content="' + esc(description) + '">',
    '<meta name="robots" content="' + robots + '">',
    '<meta name="googlebot" content="' + robots + '">',
    '<meta name="bingbot" content="' + robots + '">',
    '<link rel="canonical" href="' + esc(canonical) + '">',
    '<meta property="og:type" content="article">',
    '<meta property="og:site_name" content="' + SITE + '">',
    '<meta property="og:title" content="' + esc(fullTitle) + '">',
    '<meta property="og:description" content="' + esc(description) + '">',
    '<meta property="og:url" content="' + esc(canonical) + '">',
    '<meta property="og:image" content="' + BASE + '/og-image.jpg">',
    '<meta name="twitter:card" content="summary_large_image">',
    '<meta name="twitter:title" content="' + esc(fullTitle) + '">',
    '<meta name="twitter:description" content="' + esc(description) + '">',
    '<meta name="twitter:image" content="' + BASE + '/og-image.jpg">',
    '<script type="application/ld+json">' + JSON.stringify(schema).replaceAll('<', '\\u003c') + '</script>',
  ].join('\n');

  const topics = Array.isArray(resource.keyTopics) && resource.keyTopics.length
    ? '<h2>Topics covered</h2><ul>' + resource.keyTopics.map((topic) => '<li>' + esc(topic) + '</li>').join('') + '</ul>'
    : '';
  const guidance = resource.notes ? '<h2>Study guidance</h2><p>' + esc(resource.notes).replaceAll('\n', '<br>') + '</p>' : '';
  const fileLink = fileUrl
    ? '<p><a href="' + esc(fileUrl) + '">' + (resource.fileUrl ? 'Open or download the PDF' : 'Open the verified source') + '</a>.</p>'
    : '';

  const body =
    '<main class="page-container section-padding" data-prerendered="commerce-resource"><nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="' + esc(parentPath(resource)) + '">' + esc(parentLabel(resource)) + '</a> / ' + esc(resource.title) + '</nav><article>' +
    '<h1>' + esc(resource.title) + '</h1>' +
    '<p><strong>' + esc(resource.resourceType) + '</strong> · ' + esc(context) + '</p>' +
    '<p>' + esc(description) + '</p>' +
    '<p><strong>Source:</strong> ' + esc(sourceLabel) + (resource.academicYear ? ' · <strong>Academic year:</strong> ' + esc(resource.academicYear) : '') + (resource.subjectCode ? ' · <strong>Subject code:</strong> ' + esc(resource.subjectCode) : '') + '</p>' +
    fileLink + topics + guidance +
    '<h2>Continue learning</h2><p><a href="' + esc(parentPath(resource)) + '">Back to ' + esc(parentLabel(resource)) + '</a> · <a href="/commerce-learning">Commerce Learning Hub</a></p>' +
    '</article></main>';

  const html = source
    .replace(/<title>.*?<\/title>/s, '<title>' + esc(fullTitle) + '</title>')
    .replace('</head>', tags + '\n</head>')
    .replace('<div id="root"></div>', '<div id="root">' + body + '</div>');

  await writeRoute(resource.path, html);
}

console.log('Pre-rendered ' + resources.length + ' published Commerce resource pages.');
