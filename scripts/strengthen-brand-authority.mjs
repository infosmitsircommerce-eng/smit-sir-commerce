import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { localTuitionService } from '../src/data/localTuitionService.js';

const dist = new URL('../dist/', import.meta.url);
const BASE = 'https://www.smitsircommerce.in';
const SITE = 'Smit Sir Commerce';

const brandGraph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${BASE}/#website`,
      url: `${BASE}/`,
      name: SITE,
      alternateName: ['Smit Sir Commerce Classes', 'Smit Sir Commerce Notes'],
      description: 'Official Smit Sir Commerce website with free Commerce notes, PDFs, quizzes, practice resources and calculators for CBSE and GSEB students.',
      publisher: { '@id': `${BASE}/#organization` },
      inLanguage: 'en-IN',
    },
    {
      '@type': 'EducationalOrganization',
      '@id': `${BASE}/#organization`,
      name: SITE,
      alternateName: ['Smit Sir Commerce Classes', 'Smit Sir Commerce Notes'],
      url: `${BASE}/`,
      logo: `${BASE}/favicon.svg`,
      image: `${BASE}/og-image.jpg`,
      sameAs: [localTuitionService.mapsUrl],
      founder: { '@id': `${BASE}/about#smit-thaker` },
      areaServed: {
        '@type': 'City',
        name: 'Mehsana',
        containedInPlace: { '@type': 'State', name: 'Gujarat' },
      },
    },
    {
      '@type': 'Person',
      '@id': `${BASE}/about#smit-thaker`,
      name: 'Smit Thaker',
      alternateName: 'Smit Sir',
      url: `${BASE}/about`,
      image: `${BASE}/teacher.jpg`,
      jobTitle: 'Commerce Educator',
      worksFor: { '@id': `${BASE}/#organization` },
      mainEntityOfPage: { '@id': `${BASE}/about#webpage` },
      knowsAbout: ['Economics', 'Business Studies', 'Entrepreneurship', 'Physical Education', 'Commerce education'],
    },
    {
      '@type': 'AboutPage',
      '@id': `${BASE}/about#webpage`,
      url: `${BASE}/about`,
      name: 'About Smit Sir Commerce',
      about: [{ '@id': `${BASE}/#organization` }, { '@id': `${BASE}/about#smit-thaker` }],
      isPartOf: { '@id': `${BASE}/#website` },
    },
    {
      '@type': 'ContactPage',
      '@id': `${BASE}/contact#webpage`,
      url: `${BASE}/contact`,
      name: 'Contact Smit Sir Commerce',
      about: { '@id': `${BASE}/#organization` },
      isPartOf: { '@id': `${BASE}/#website` },
    },
  ],
};

const schemaTag = `<script type="application/ld+json" data-brand-authority="official">${JSON.stringify(brandGraph).replaceAll('<', '\\u003c')}</script>`;
const targets = ['index.html', 'about.html', join('about', 'index.html'), 'contact.html', join('contact', 'index.html')];

function patchHead(html) {
  html = html.replace(
    /<script\s+type=["']application\/ld\+json["'](?![^>]*data-brand-authority)[^>]*>([\s\S]*?)<\/script>/gi,
    (tag, json) => {
      try {
        const value = JSON.parse(json);
        const nodes = Array.isArray(value?.['@graph']) ? value['@graph'] : [value];
        const isDuplicateBrandGraph = nodes.some((node) =>
          node?.['@id'] === `${BASE}/#website` || node?.['@id'] === `${BASE}/#organization`
        );
        return isDuplicateBrandGraph ? '' : tag;
      } catch {
        return tag;
      }
    },
  );
  const oldSchema = /<script\s+type=["']application\/ld\+json["']\s+data-brand-authority=["']official["'][\s\S]*?<\/script>/i;
  html = oldSchema.test(html) ? html.replace(oldSchema, schemaTag) : html.replace('</head>', `${schemaTag}\n</head>`);

  const metas = [
    ['application-name', SITE],
    ['author', 'Smit Thaker — Smit Sir Commerce'],
    ['publisher', SITE],
  ];
  for (const [name, content] of metas) {
    const pattern = new RegExp(`<meta\\s+name=["']${name}["'][^>]*>`, 'i');
    const tag = `<meta name="${name}" content="${content}">`;
    html = pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', `${tag}\n</head>`);
  }

  const authorPattern = /<link\s+rel=["']author["'][^>]*>/i;
  const authorTag = `<link rel="author" href="${BASE}/about">`;
  return authorPattern.test(html) ? html.replace(authorPattern, authorTag) : html.replace('</head>', `${authorTag}\n</head>`);
}

let patched = 0;
for (const relative of targets) {
  const file = join(dist.pathname, relative);
  try {
    const original = await readFile(file, 'utf8');
    const next = patchHead(original);
    if (next !== original) {
      await writeFile(file, next, 'utf8');
      patched += 1;
    }
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }
}

console.log(`Brand authority pass: ${patched} official homepage/about/contact HTML files strengthened.`);
