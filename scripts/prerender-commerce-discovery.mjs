import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fetchPublishedCommerceResources } from './commerce-resource-manifest.mjs';
import {
  deriveCommerceDiscoveryCollections,
  filterResourcesForCollection,
  collegeSemesterPath,
  collegeSubjectPath,
} from '../src/lib/commerceDiscovery.js';

const BASE = 'https://www.smitsircommerce.in';
const SITE = 'Smit Sir Commerce';
const source = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const distRoot = new URL('../dist/', import.meta.url);
const resources = await fetchPublishedCommerceResources();
const collections = deriveCommerceDiscoveryCollections(resources);

function esc(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function uniq(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b), undefined, { numeric: true }));
}

function parentFor(collection, matches) {
  const sample = matches[0];
  if (collection.type === 'college-subject') return collegeSemesterPath(sample);
  if (collection.type === 'college-semester') return `/college/${collection.path.split('/')[2]}/${collection.path.split('/')[3]}`;
  if (collection.type === 'college-degree') return sample?.degree === 'B.Com' ? '/college-commerce/bcom' : '/college-commerce/mcom';
  if (collection.type === 'competitive-unit') {
    if (collection.exam === 'UGC NET Commerce') return '/ugc-net-commerce';
    if (collection.exam === 'GSET Commerce') return '/gset-commerce';
    return '/commerce-exams';
  }
  return '/commerce-learning';
}

function breadcrumbName(collection) {
  if (collection.type === 'college-degree') return collection.degree;
  if (collection.type === 'college-semester') return `Semester ${collection.semester}`;
  if (collection.type === 'college-subject') return collection.subject;
  if (collection.type === 'competitive-unit') return collection.unit ? `Unit ${collection.unit}` : 'Official syllabus';
  return collection.title;
}

function resourceList(matches) {
  return '<ul>' + matches.map((resource) =>
    '<li><a href="' + esc(resource.path) + '">' + esc(resource.title) + '</a> — ' +
    esc([resource.resourceType, resource.subject, resource.academicYear].filter(Boolean).join(' · ')) +
    '</li>'
  ).join('') + '</ul>';
}

function drilldown(collection, matches) {
  if (collection.type === 'college-degree') {
    const semesters = uniq(matches.map((item) => Number(item.semester)));
    return '<h2>Choose semester</h2><ul>' + semesters.map((semester) => {
      const sample = matches.find((item) => Number(item.semester) === semester);
      const count = matches.filter((item) => Number(item.semester) === semester).length;
      return '<li><a href="' + esc(collegeSemesterPath(sample)) + '">Semester ' + semester + '</a> — ' + count + ' published resource' + (count === 1 ? '' : 's') + '</li>';
    }).join('') + '</ul>';
  }

  if (collection.type === 'college-semester') {
    const subjects = uniq(matches.map((item) => item.subject));
    return '<h2>Choose subject</h2><ul>' + subjects.map((subject) => {
      const sample = matches.find((item) => item.subject === subject);
      const count = matches.filter((item) => item.subject === subject).length;
      return '<li><a href="' + esc(collegeSubjectPath(sample)) + '">' + esc(subject) + '</a> — ' + count + ' published resource' + (count === 1 ? '' : 's') + '</li>';
    }).join('') + '</ul>';
  }

  return '';
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

for (const collection of collections) {
  const matches = filterResourcesForCollection(resources, collection);
  if (!matches.length) continue;

  const canonical = BASE + collection.path;
  const fullTitle = collection.title + ' | ' + SITE;
  const parent = parentFor(collection, matches);
  const parentLabel = collection.type?.startsWith('college') ? 'College Commerce' : 'Commerce Exams';

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': canonical + '#collection',
        url: canonical,
        name: collection.title,
        description: collection.description,
        inLanguage: 'en-IN',
        isPartOf: { '@id': BASE + '/#website' },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: matches.length,
          itemListElement: matches.map((resource, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: BASE + resource.path,
            name: resource.title,
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE + '/' },
          { '@type': 'ListItem', position: 2, name: parentLabel, item: BASE + parent },
          { '@type': 'ListItem', position: 3, name: breadcrumbName(collection), item: canonical },
        ],
      },
    ],
  };

  const tags = [
    '<meta name="description" content="' + esc(collection.description) + '">',
    '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">',
    '<meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">',
    '<link rel="canonical" href="' + esc(canonical) + '">',
    '<meta property="og:type" content="website">',
    '<meta property="og:site_name" content="' + SITE + '">',
    '<meta property="og:title" content="' + esc(fullTitle) + '">',
    '<meta property="og:description" content="' + esc(collection.description) + '">',
    '<meta property="og:url" content="' + esc(canonical) + '">',
    '<meta property="og:image" content="' + BASE + '/og-image.jpg">',
    '<meta name="twitter:card" content="summary_large_image">',
    '<meta name="twitter:title" content="' + esc(fullTitle) + '">',
    '<meta name="twitter:description" content="' + esc(collection.description) + '">',
    '<script type="application/ld+json">' + JSON.stringify(schema).replaceAll('<', '\\u003c') + '</script>',
  ].join('\n');

  const body =
    '<main class="page-container section-padding" data-prerendered="commerce-discovery"><nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="' + esc(parent) + '">' + esc(parentLabel) + '</a> / ' + esc(breadcrumbName(collection)) + '</nav><article>' +
    '<h1>' + esc(collection.title) + '</h1>' +
    '<p>' + esc(collection.description) + '</p>' +
    '<p><strong>' + matches.length + ' published resource' + (matches.length === 1 ? '' : 's') + '</strong> in this collection. Empty university, semester, subject and unit combinations are not published as search pages.</p>' +
    drilldown(collection, matches) +
    '<h2>Published resources</h2>' + resourceList(matches) +
    '<h2>Explore more Commerce material</h2><p><a href="' + esc(parent) + '">Back to ' + esc(parentLabel) + '</a> · <a href="/commerce-learning">Commerce Learning Hub</a></p>' +
    '</article></main>';

  const html = source
    .replace(/<title>.*?<\/title>/s, '<title>' + esc(fullTitle) + '</title>')
    .replace('</head>', tags + '\n</head>')
    .replace('<div id="root"></div>', '<div id="root">' + body + '</div>');

  await writeRoute(collection.path, html);
}

console.log('Pre-rendered ' + collections.length + ' live Commerce discovery collection pages.');
