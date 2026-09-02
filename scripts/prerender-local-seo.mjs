import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const BASE = 'https://www.smitsircommerce.in';
const SITE = 'Smit Sir Commerce';
const PATH = '/commerce-coaching-mehsana';
const TITLE = 'Commerce Coaching in Mehsana — Class 11 & 12 CBSE';
const DESCRIPTION = 'Commerce coaching in Mehsana for CBSE Class 11 and 12. Learn Economics, Business Studies and Accountancy with chapter-wise notes, tests, doubt solving and demo-class booking by Smit Sir Commerce.';
const source = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const distRoot = new URL('../dist/', import.meta.url);

const faqs = [
  ['Where is Smit Sir Commerce coaching available?', 'Smit Sir Commerce serves students in Mehsana, Gujarat, with offline Commerce coaching and also provides online learning options for students who cannot attend locally.'],
  ['Which classes are covered for Commerce coaching in Mehsana?', 'The coaching is focused on Class 11 and Class 12 Commerce students, with subject support for Economics, Business Studies, Accountancy and related Commerce preparation.'],
  ['Can I take a demo class before joining?', 'Yes. Students and parents can use the website to request a demo class before deciding on a batch.'],
  ['Are free CBSE Commerce notes available?', 'Yes. Smit Sir Commerce publishes free chapter-wise CBSE Commerce notes and practice resources that can be viewed from the website.'],
  ['Is online Commerce coaching also available?', 'Yes. Students outside Mehsana or those who prefer remote learning can explore the online batch option on the website.'],
];

function esc(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${BASE}${PATH}#webpage`,
      url: `${BASE}${PATH}`,
      name: 'Commerce Coaching in Mehsana for Class 11 & 12',
      description: DESCRIPTION,
      inLanguage: 'en-IN',
      about: { '@id': `${BASE}${PATH}#service` },
      isPartOf: { '@id': `${BASE}/#website` },
    },
    {
      '@type': 'EducationalOrganization',
      '@id': `${BASE}/#organization`,
      name: SITE,
      url: `${BASE}/`,
      areaServed: {
        '@type': 'City',
        name: 'Mehsana',
        containedInPlace: { '@type': 'State', name: 'Gujarat' },
      },
      knowsAbout: ['CBSE Commerce', 'Economics', 'Business Studies', 'Accountancy', 'Entrepreneurship'],
    },
    {
      '@type': 'Service',
      '@id': `${BASE}${PATH}#service`,
      name: 'Class 11 & 12 Commerce Coaching in Mehsana',
      serviceType: 'CBSE Class 11 and Class 12 Commerce coaching',
      provider: { '@id': `${BASE}/#organization` },
      areaServed: { '@type': 'City', name: 'Mehsana' },
      offers: { '@type': 'Offer', url: `${BASE}/book-demo`, description: 'Request a demo class before joining a Commerce batch.' },
    },
    {
      '@type': 'FAQPage',
      mainEntity: faqs.map(([question, answer]) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: { '@type': 'Answer', text: answer },
      })),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/` },
        { '@type': 'ListItem', position: 2, name: 'Commerce Coaching in Mehsana', item: `${BASE}${PATH}` },
      ],
    },
  ],
};

function body() {
  return `<main class="page-container section-padding" data-prerendered="local-seo"><nav aria-label="Breadcrumb"><a href="/">Home</a> / Commerce Coaching in Mehsana</nav><article><p>Mehsana, Gujarat · CBSE Class 11 &amp; 12 Commerce</p><h1>Commerce Coaching in Mehsana for Class 11 &amp; 12</h1><p>CBSE Commerce learning focused on concept clarity, exam-style practice and chapter-wise revision. Smit Sir Commerce supports Class 11 and Class 12 students studying Economics, Business Studies, Accountancy and related Commerce subjects.</p><p><a href="/book-demo">Book a demo class</a> · <a href="/offline-batch">Offline Commerce batch in Mehsana</a> · <a href="/online-batch">Online Commerce coaching</a></p><section><h2>Class 11 and Class 12 Commerce subjects</h2><ul><li>Economics — concepts, diagrams, numericals and revision.</li><li>Business Studies — chapter explanations, case studies and answer-writing practice.</li><li>Accountancy — step-by-step numerical practice and working notes.</li><li>Entrepreneurship — concepts, application questions and exam revision.</li></ul></section><section><h2>Why students in Mehsana can use Smit Sir Commerce</h2><ul><li>Commerce-focused teaching for Class 11 and Class 12.</li><li>Chapter-wise notes and revision resources.</li><li>Tests and exam-oriented practice.</li><li>Doubt solving and concept reinforcement.</li><li>Offline learning in Mehsana with online support available.</li></ul></section><section><h2>Free CBSE Commerce resources</h2><p>Students can use the website between classes for notes, practice questions and tests. <a href="/cbse-notes">Browse free CBSE Commerce notes</a>, <a href="/cbse-practice">chapter practice</a> and <a href="/test-series">Commerce tests</a>.</p></section><section><h2>Frequently asked questions about Commerce coaching in Mehsana</h2>${faqs.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('')}</section><section><h2>Start with a demo class</h2><p>Students and parents can first understand the teaching approach before choosing a batch. <a href="/book-demo">Request a Commerce demo class</a>.</p></section><p><a href="/about">About Smit Sir</a> · <a href="/contact">Contact Smit Sir Commerce</a> · <a href="/study-material">Study material</a></p></article></main>`;
}

function html() {
  const fullTitle = `${TITLE} | ${SITE}`;
  const url = `${BASE}${PATH}`;
  const robots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
  const tags = `\n<meta name="description" content="${esc(DESCRIPTION)}"><meta name="robots" content="${robots}"><meta name="googlebot" content="${robots}"><meta name="bingbot" content="${robots}"><link rel="canonical" href="${esc(url)}"><meta property="og:type" content="website"><meta property="og:site_name" content="${SITE}"><meta property="og:locale" content="en_IN"><meta property="og:title" content="${esc(fullTitle)}"><meta property="og:description" content="${esc(DESCRIPTION)}"><meta property="og:url" content="${esc(url)}"><meta property="og:image" content="${BASE}/og-image.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Commerce Coaching in Mehsana — Smit Sir Commerce"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(fullTitle)}"><meta name="twitter:description" content="${esc(DESCRIPTION)}"><meta name="twitter:image" content="${BASE}/og-image.jpg"><meta name="twitter:image:alt" content="Commerce Coaching in Mehsana — Smit Sir Commerce"><script type="application/ld+json">${JSON.stringify(structuredData).replaceAll('<', '\\u003c')}</script>`;
  return source
    .replace(/<title>.*?<\/title>/s, `<title>${esc(fullTitle)}</title>`)
    .replace('</head>', `${tags}\n</head>`)
    .replace('<div id="root"></div>', `<div id="root">${body()}</div>`);
}

async function writeRoute(path, content) {
  const relative = path.replace(/^\//, '');
  const clean = join(distRoot.pathname, `${relative}.html`);
  const directory = join(distRoot.pathname, relative, 'index.html');
  await mkdir(dirname(clean), { recursive: true });
  await mkdir(dirname(directory), { recursive: true });
  await writeFile(clean, content, 'utf8');
  await writeFile(directory, content, 'utf8');
}

await writeRoute(PATH, html());
console.log('Pre-rendered Mehsana local Commerce coaching landing page.');
