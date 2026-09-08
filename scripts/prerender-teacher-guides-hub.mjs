import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { teacherContentGuides } from '../src/data/teacherContentGuides.js';

const BASE = 'https://www.smitsircommerce.in';
const SITE = 'Smit Sir Commerce';
const source = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const distRoot = new URL('../dist/', import.meta.url);

function esc(value) {
  return String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
}

function groupsHtml() {
  const groups = [
    ['GSEB Class 12 Economics', teacherContentGuides.filter((g) => g.path.startsWith('/gseb/'))],
    ['CBSE Class 12 Economics', teacherContentGuides.filter((g) => g.path.startsWith('/cbse/class-12/national-income') || g.path.startsWith('/class-12-economics-'))],
    ['CBSE Class 12 Business Studies', teacherContentGuides.filter((g) => g.path.startsWith('/cbse/class-12/business-studies-'))],
    ['Class 12 Commerce Revision Plans', teacherContentGuides.filter((g) => g.path.startsWith('/class-12-commerce-'))],
  ];

  return groups.map(([title, guides]) => `<section><h2>${esc(title)}</h2><ul>${guides.map((guide) => `<li><a href="${esc(guide.path)}"><strong>${esc(guide.shortTitle)}</strong></a> — ${esc(guide.description)}</li>`).join('')}</ul></section>`).join('');
}

const path = '/teacher-guides';
const title = 'Smit Sir Teacher Guides — Economics, Business Studies & Revision';
const description = 'Free teacher-prepared Commerce guides for GSEB and CBSE students: Economics mistakes, numericals, diagrams, Business Studies case studies and revision plans.';
const canonical = `${BASE}${path}`;
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Smit Sir Teacher Guides',
  url: canonical,
  description,
  hasPart: teacherContentGuides.map((guide) => ({
    '@type': 'LearningResource',
    name: guide.title,
    url: `${BASE}${guide.path}`,
  })),
};

const body = `<main class="page-container section-padding" data-prerendered="teacher-guides-hub"><nav aria-label="Breadcrumb"><a href="/">Home</a> / Teacher Guides</nav><article><h1>Commerce explained like a teacher would explain it after class.</h1><p>These teacher-prepared guides focus on real student problems: confusing concepts, repeated mistakes, numerical methods, case-study clues, answer presentation and exam revision.</p><p><a href="/study-material">Study Material</a> · <a href="/book-demo">Free Paper Analysis + Demo</a></p>${groupsHtml()}<section><h2>The method behind every guide</h2><p>Understand the concept, identify the common mistake, practise without notes, check the explanation and repeat only the weak area. The goal is not to read more pages; it is to remember and apply more of what you study.</p></section></article></main>`;

const robots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
const tags = `<meta name="description" content="${esc(description)}"><meta name="robots" content="${robots}"><meta name="googlebot" content="${robots}"><link rel="canonical" href="${canonical}"><meta property="og:type" content="website"><meta property="og:site_name" content="${SITE}"><meta property="og:title" content="${esc(title)} | ${SITE}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${BASE}/og-image.jpg"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)} | ${SITE}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${BASE}/og-image.jpg"><script type="application/ld+json">${JSON.stringify(structuredData).replaceAll('<','\\u003c')}</script>`;

const html = source
  .replace(/<title>.*?<\/title>/s, `<title>${esc(title)} | ${SITE}</title>`)
  .replace('</head>', `${tags}</head>`)
  .replace('<div id="root"></div>', `<div id="root">${body}</div>`);

const relative = path.replace(/^\//,'');
const clean = join(distRoot.pathname, `${relative}.html`);
const directory = join(distRoot.pathname, relative, 'index.html');
await mkdir(dirname(clean), { recursive: true });
await mkdir(dirname(directory), { recursive: true });
await writeFile(clean, html, 'utf8');
await writeFile(directory, html, 'utf8');

console.log(`Pre-rendered Teacher Guides hub with ${teacherContentGuides.length} teacher-led resources.`);
