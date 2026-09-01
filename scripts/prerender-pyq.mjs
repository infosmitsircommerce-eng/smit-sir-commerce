import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { seoHubs, getHubMaterials } from '../src/data/seoMaterials.js';

const BASE = 'https://www.smitsircommerce.in';
const PATH = '/cbse-pyq';
const TITLE = 'CBSE Commerce PYQ & Sample Paper Practice';
const DESCRIPTION = 'Prepare for CBSE Class 11 and 12 Commerce with chapter notes, important questions and a growing PYQ and sample-paper practice library.';
const source = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const distRoot = new URL('../dist/', import.meta.url);

const escapeHtml = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');

const body = `<main class="page-container section-padding" data-prerendered="cbse-pyq"><nav aria-label="Breadcrumb"><a href="/">Home</a> / CBSE PYQ &amp; Sample Paper Preparation</nav><article><h1>CBSE Commerce PYQ &amp; Sample Paper Preparation</h1><p>This exam-preparation hub is being built carefully. Verified previous-year questions and official or sample-paper references will be clearly distinguished from original practice questions.</p><h2>Prepare subject by subject</h2><ul>${seoHubs.map((hub) => `<li><a href="${escapeHtml(hub.path)}">Class ${hub.classLevel} ${escapeHtml(hub.subject)} notes</a> — ${getHubMaterials(hub.id).length} published chapters available for revision</li>`).join('')}</ul><h2>What students can use now</h2><ul><li><a href="/cbse-notes">Free chapter-wise CBSE Commerce notes</a></li><li><a href="/cbse-practice">Chapter practice: MCQs, important questions, revision and more</a></li><li><a href="/exam-mode">Timed Exam Mode</a></li><li><a href="/test-series">Commerce test series</a></li></ul><h2>What is coming next</h2><p>Verified previous-year questions, year filters, subject filters, chapter mapping and answer guidance. Original learning questions will never be mislabelled as official CBSE previous-year questions.</p><p><a href="/book-demo">Book a free demo class</a> if you want guided preparation.</p></article></main>`;

const schema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: TITLE,
  description: DESCRIPTION,
  url: `${BASE}${PATH}`,
  isAccessibleForFree: true,
  inLanguage: 'en-IN',
};

const fullTitle = `${TITLE} | Smit Sir Commerce`;
const url = `${BASE}${PATH}`;
const tags = `\n<meta name="description" content="${escapeHtml(DESCRIPTION)}" />\n<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />\n<link rel="canonical" href="${url}" />\n<meta property="og:type" content="website" />\n<meta property="og:site_name" content="Smit Sir Commerce" />\n<meta property="og:title" content="${escapeHtml(fullTitle)}" />\n<meta property="og:description" content="${escapeHtml(DESCRIPTION)}" />\n<meta property="og:url" content="${url}" />\n<meta property="og:image" content="${BASE}/og-image.jpg" />\n<meta name="twitter:card" content="summary_large_image" />\n<meta name="twitter:title" content="${escapeHtml(fullTitle)}" />\n<meta name="twitter:description" content="${escapeHtml(DESCRIPTION)}" />\n<script type="application/ld+json">${JSON.stringify(schema).replaceAll('<', '\\u003c')}</script>`;
const html = source.replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(fullTitle)}</title>`).replace('</head>', `${tags}\n</head>`).replace('<div id="root"></div>', `<div id="root">${body}</div>`);

const relative = PATH.replace(/^\//, '');
const cleanFile = join(distRoot.pathname, `${relative}.html`);
const directoryFile = join(distRoot.pathname, relative, 'index.html');
await mkdir(dirname(cleanFile), { recursive: true });
await mkdir(dirname(directoryFile), { recursive: true });
await writeFile(cleanFile, html, 'utf8');
await writeFile(directoryFile, html, 'utf8');
console.log('Pre-rendered CBSE PYQ preparation hub.');
