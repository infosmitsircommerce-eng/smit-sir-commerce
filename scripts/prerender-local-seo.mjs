import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { localSeoPages } from '../src/data/localSeoPages.js';

const BASE = 'https://www.smitsircommerce.in';
const SITE = 'Smit Sir Commerce';
const source = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const distRoot = new URL('../dist/', import.meta.url);

function esc(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

function seoTags({ path, title, description, structuredData, imageAlt }) {
  const fullTitle = `${title} | ${SITE}`;
  const url = `${BASE}${path}`;
  const robots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
  return `\n<meta name="description" content="${esc(description)}"><meta name="robots" content="${robots}"><meta name="googlebot" content="${robots}"><meta name="bingbot" content="${robots}"><link rel="canonical" href="${esc(url)}"><meta property="og:type" content="website"><meta property="og:site_name" content="${SITE}"><meta property="og:locale" content="en_IN"><meta property="og:title" content="${esc(fullTitle)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${esc(url)}"><meta property="og:image" content="${BASE}/og-image.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${esc(imageAlt || title)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(fullTitle)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${BASE}/og-image.jpg"><meta name="twitter:image:alt" content="${esc(imageAlt || title)}"><script type="application/ld+json">${JSON.stringify(structuredData).replaceAll('<', '\\u003c')}</script>`;
}

function makeHtml({ path, title, description, body, structuredData, imageAlt }) {
  const fullTitle = `${title} | ${SITE}`;
  const tags = seoTags({ path, title, description, structuredData, imageAlt });
  return source
    .replace(/<title>.*?<\/title>/s, `<title>${esc(fullTitle)}</title>`)
    .replace('</head>', `${tags}\n</head>`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`);
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

const mainPath = '/commerce-coaching-mehsana';
const mainTitle = 'Commerce Tuition in Mehsana — Class 11 & 12 CBSE';
const mainDescription = 'Commerce tuition in Mehsana for CBSE Class 11 and 12. Learn Economics, Business Studies and Accountancy with structured teaching, tests, free paper analysis, revision resources and demo-class booking by Smit Sir Commerce.';
const mainFaqs = [
  ['Where is Smit Sir Commerce tuition available?', 'Smit Sir Commerce serves students in Mehsana, Gujarat, with offline Commerce tuition and also provides online learning options for students who cannot attend locally.'],
  ['Which classes are covered for Commerce tuition in Mehsana?', 'The tuition is focused on Class 11 and Class 12 Commerce students, with subject support for Economics, Business Studies, Accountancy and related Commerce preparation.'],
  ['Can I get help before deciding to join?', 'Yes. Students can request a free paper analysis and demo class first. Students who already attend another tuition do not need to leave it just to experience the teaching approach.'],
  ['Can I take a demo class before joining?', 'Yes. Students and parents can use the website to request a demo class before deciding on a batch.'],
  ['Are free CBSE Commerce notes available?', 'Yes. Smit Sir Commerce publishes free chapter-wise CBSE Commerce notes and practice resources that can be viewed from the website.'],
];
const mainStructuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebPage', '@id': `${BASE}${mainPath}#webpage`, url: `${BASE}${mainPath}`, name: 'Commerce Tuition in Mehsana for Class 11 & 12', description: mainDescription, inLanguage: 'en-IN', about: { '@id': `${BASE}${mainPath}#service` }, isPartOf: { '@id': `${BASE}/#website` } },
    { '@type': 'Service', '@id': `${BASE}${mainPath}#service`, name: 'Class 11 & 12 Commerce Tuition in Mehsana', serviceType: 'CBSE Class 11 and Class 12 Commerce tuition and coaching', provider: { '@id': `${BASE}/#organization` }, areaServed: { '@type': 'City', name: 'Mehsana' }, offers: { '@type': 'Offer', url: `${BASE}/book-demo`, description: 'Request a free paper analysis and demo class before joining a Commerce batch.' } },
    { '@type': 'FAQPage', mainEntity: mainFaqs.map(([question, answer]) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })) },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/` }, { '@type': 'ListItem', position: 2, name: 'Commerce Tuition in Mehsana', item: `${BASE}${mainPath}` }] },
  ],
};
const mainBody = `<main class="page-container section-padding" data-prerendered="local-seo"><nav aria-label="Breadcrumb"><a href="/">Home</a> / Commerce Tuition in Mehsana</nav><article><p>Mehsana, Gujarat · CBSE Class 11 &amp; 12 Commerce</p><h1>Commerce Tuition &amp; Coaching in Mehsana for Class 11 &amp; 12</h1><p>CBSE Commerce learning focused on concept clarity, exam-style practice and chapter-wise revision. Smit Sir Commerce supports Class 11 and Class 12 students studying Economics, Business Studies, Accountancy and related Commerce subjects.</p><p><a href="/book-demo">Get a free paper analysis + demo</a> · <a href="/cbse-notes">Free CBSE notes</a></p><section><h2>Already studying somewhere but still losing marks?</h2><p>You do not need to leave your current tuition. Bring your latest test paper for a free academic analysis, identify weak topics and experience the teaching approach before making any admission decision.</p></section><section><h2>Explore Commerce tuition options in Mehsana</h2><ul>${localSeoPages.map((page) => `<li><a href="${esc(page.path)}">${esc(page.h1)}</a></li>`).join('')}</ul></section><section><h2>Frequently asked questions</h2>${mainFaqs.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('')}</section></article></main>`;
await writeRoute(mainPath, makeHtml({ path: mainPath, title: mainTitle, description: mainDescription, body: mainBody, structuredData: mainStructuredData, imageAlt: 'Commerce Tuition in Mehsana — Smit Sir Commerce' }));

for (const page of localSeoPages) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebPage', '@id': `${BASE}${page.path}#webpage`, url: `${BASE}${page.path}`, name: page.h1, description: page.description, inLanguage: 'en-IN', isPartOf: { '@id': `${BASE}/#website` }, about: { '@id': `${BASE}${page.path}#service` } },
      { '@type': 'Service', '@id': `${BASE}${page.path}#service`, name: page.serviceName, serviceType: page.serviceType, provider: { '@id': `${BASE}/#organization` }, areaServed: { '@type': 'City', name: 'Mehsana', containedInPlace: { '@type': 'State', name: 'Gujarat' } }, offers: { '@type': 'Offer', url: `${BASE}/book-demo`, description: 'Request a free paper analysis and demo class before choosing a Commerce batch.' } },
      { '@type': 'FAQPage', mainEntity: page.faqs.map(([question, answer]) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })) },
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/` }, { '@type': 'ListItem', position: 2, name: 'Commerce Tuition in Mehsana', item: `${BASE}${mainPath}` }, { '@type': 'ListItem', position: 3, name: page.h1, item: `${BASE}${page.path}` }] },
    ],
  };
  const related = localSeoPages.filter((item) => item.path !== page.path);
  const body = `<main class="page-container section-padding" data-prerendered="local-keyword-seo"><nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="${mainPath}">Commerce Tuition in Mehsana</a> / ${esc(page.h1)}</nav><article><p>${esc(page.eyebrow)}</p><h1>${esc(page.h1)}</h1><p>${esc(page.intro)}</p><p><a href="/book-demo">Get a free paper analysis + demo</a> · <a href="/cbse-notes">Free CBSE Commerce notes</a></p><section><h2>${esc(page.sectionTitle)}</h2><p>${esc(page.sectionText)}</p><ul>${page.focus.map(([title, text]) => `<li><strong>${esc(title)}:</strong> ${esc(text)}</li>`).join('')}</ul></section><section><h2>Questions students and parents ask</h2>${page.faqs.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('')}</section><section><h2>Related Commerce tuition in Mehsana</h2><ul>${related.map((item) => `<li><a href="${esc(item.path)}">${esc(item.h1)}</a></li>`).join('')}</ul></section><p><a href="/study-material">Study material</a> · <a href="/test-series">Commerce tests</a> · <a href="/contact">Contact Smit Sir Commerce</a></p></article></main>`;
  await writeRoute(page.path, makeHtml({ path: page.path, title: page.title, description: page.description, body, structuredData, imageAlt: `${page.h1} — Smit Sir Commerce` }));
}

console.log(`Pre-rendered Mehsana local Commerce tuition landing page plus ${localSeoPages.length} local keyword pages.`);
