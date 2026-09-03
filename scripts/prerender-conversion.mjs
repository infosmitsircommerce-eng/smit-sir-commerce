import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const BASE = 'https://www.smitsircommerce.in';
const SITE = 'Smit Sir Commerce';
const path = '/book-demo';
const title = 'Free Commerce Paper Analysis & Demo in Mehsana';
const description = 'Class 11 and 12 Commerce students in Mehsana can get a free test-paper analysis, weak-topic plan and demo class with Smit Sir Commerce for Economics, Business Studies, Accountancy, Entrepreneurship and Physical Education.';
const source = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const distRoot = new URL('../dist/', import.meta.url);

function esc(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

const fullTitle = `${title} | ${SITE}`;
const url = `${BASE}${path}`;
const robots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name: title,
      description,
      inLanguage: 'en-IN',
      isPartOf: { '@id': `${BASE}/#website` },
    },
    {
      '@type': 'Service',
      '@id': `${url}#service`,
      name: 'Free Commerce Paper Analysis and Demo Class',
      serviceType: 'Commerce academic diagnostic and demo class',
      provider: { '@id': `${BASE}/#organization` },
      areaServed: { '@type': 'City', name: 'Mehsana' },
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR', url },
    },
  ],
};

const tags = `<meta name="description" content="${esc(description)}"><meta name="robots" content="${robots}"><meta name="googlebot" content="${robots}"><link rel="canonical" href="${url}"><meta property="og:type" content="website"><meta property="og:site_name" content="${SITE}"><meta property="og:locale" content="en_IN"><meta property="og:title" content="${esc(fullTitle)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${BASE}/og-image.jpg"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(fullTitle)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${BASE}/og-image.jpg"><script type="application/ld+json">${JSON.stringify(structuredData).replaceAll('<', '\\u003c')}</script>`;

const body = `<main class="page-container section-padding" data-prerendered="conversion"><article><p>Mehsana · Class 11 &amp; 12 · Free academic starting point</p><h1>Free Commerce Paper Analysis &amp; Demo in Mehsana</h1><p>Already enrolled in another tuition? You do not need to leave it. Bring your latest test paper, identify where marks are being lost and understand which weak topics need attention before making any admission decision.</p><h2>What students can get</h2><ul><li>Free test-paper and mistake analysis</li><li>Weak-topic action plan</li><li>Free demo class with Smit Sir</li><li>Support for Economics, Business Studies, Accountancy, Entrepreneurship and Physical Education</li></ul><h2>My teaching commitment</h2><p>If an enrolled student regularly attends, completes the required work and tests, follows the agreed study plan, and still fails the subject taught by Smit Sir, the tuition fee for that subject is refunded according to written eligibility terms shared before enrolment. This is not a marks guarantee; it is a commitment for students who sincerely follow the academic system.</p><p><a href="tel:+916353709585">Call Smit Sir: 63537 09585</a> · <a href="/commerce-coaching-mehsana">Commerce tuition in Mehsana</a></p></article></main>`;

const html = source
  .replace(/<title>.*?<\/title>/s, `<title>${esc(fullTitle)}</title>`)
  .replace('</head>', `${tags}\n</head>`)
  .replace('<div id="root"></div>', `<div id="root">${body}</div>`);

const relative = path.replace(/^\//, '');
const clean = join(distRoot.pathname, `${relative}.html`);
const directory = join(distRoot.pathname, relative, 'index.html');
await mkdir(dirname(clean), { recursive: true });
await mkdir(dirname(directory), { recursive: true });
await writeFile(clean, html, 'utf8');
await writeFile(directory, html, 'utf8');
console.log('Pre-rendered free Commerce paper analysis + demo conversion page.');
