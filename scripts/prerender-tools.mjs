import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { commerceTools } from '../src/data/allCommerceTools.js';

const BASE = 'https://www.smitsircommerce.in';
const SITE = 'Smit Sir Commerce';
const source = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const distRoot = new URL('../dist/', import.meta.url);

function esc(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

function seoTags({ path, title, description, structuredData }) {
  const fullTitle = `${title} | ${SITE}`;
  const url = `${BASE}${path}`;
  const robots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
  return `\n<meta name="description" content="${esc(description)}"><meta name="robots" content="${robots}"><meta name="googlebot" content="${robots}"><meta name="bingbot" content="${robots}"><link rel="canonical" href="${esc(url)}"><meta property="og:type" content="website"><meta property="og:site_name" content="${SITE}"><meta property="og:locale" content="en_IN"><meta property="og:title" content="${esc(fullTitle)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${esc(url)}"><meta property="og:image" content="${BASE}/og-image.jpg"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(fullTitle)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${BASE}/og-image.jpg"><script type="application/ld+json">${JSON.stringify(structuredData).replaceAll('<', '\\u003c')}</script>`;
}

function makeHtml({ path, title, description, body, structuredData }) {
  const tags = seoTags({ path, title, description, structuredData });
  return source
    .replace(/<title>.*?<\/title>/s, `<title>${esc(title)} | ${SITE}</title>`)
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

const hubPath = '/tools';
const hubTitle = 'Free Commerce Calculators — Economics & Accountancy Class 11 & 12';
const hubDescription = 'Free Class 11 and 12 Commerce calculators for MPC, MPS, consumption and saving functions, GDP and national income conversions, revenue, costs, money, elasticity and Accountancy ratios with step-by-step working.';
const hubStructuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'CollectionPage', '@id': `${BASE}/tools#webpage`, url: `${BASE}/tools`, name: 'Free Commerce Calculators for Class 11 & 12', description: hubDescription, inLanguage: 'en-IN', isPartOf: { '@id': `${BASE}/#website` } },
    { '@type': 'ItemList', name: 'Smit Sir Commerce free calculators', itemListElement: commerceTools.map((tool, index) => ({ '@type': 'ListItem', position: index + 1, name: tool.h1, url: `${BASE}/tools/${tool.slug}` })) },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/` }, { '@type': 'ListItem', position: 2, name: 'Commerce Tools', item: `${BASE}/tools` }] },
  ],
};
const byCategory = (category) => commerceTools.filter((tool) => tool.category === category).map((tool) => `<li><a href="/tools/${esc(tool.slug)}">${esc(tool.h1)}</a> — ${esc(tool.formula)}</li>`).join('');
const hubBody = `<main class="page-container section-padding" data-prerendered="commerce-tools"><nav aria-label="Breadcrumb"><a href="/">Home</a> / Commerce Tools</nav><article><p>Free Class 11 &amp; 12 Commerce problem solvers</p><h1>Free Commerce Calculators for Economics &amp; Accountancy</h1><p>${esc(hubDescription)}</p><section><h2>Economics calculators</h2><ul>${byCategory('Economics')}</ul></section><section><h2>Accountancy ratio calculators</h2><ul>${byCategory('Accountancy')}</ul></section><p><a href="/cbse-notes">Free CBSE notes</a> · <a href="/test-series">Practice tests</a> · <a href="/book-demo">Free paper analysis / demo</a></p></article></main>`;
await writeRoute(hubPath, makeHtml({ path: hubPath, title: hubTitle, description: hubDescription, body: hubBody, structuredData: hubStructuredData }));

for (const tool of commerceTools) {
  const path = `/tools/${tool.slug}`;
  const title = `${tool.title} — Free ${tool.classLevel} ${tool.category} Tool`;
  const faqs = [
    [`What formula does the ${tool.title} use?`, `This calculator uses: ${tool.formula}. The interactive page shows the working step by step.`],
    [`Is the ${tool.title} free?`, 'Yes. It is free to use and does not require a login.'],
    ['Can I use the calculator for exam preparation?', 'Yes. Use it to check numerical working and then practise writing the formula, substitution and final answer yourself.'],
  ];
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebApplication', '@id': `${BASE}${path}#calculator`, name: tool.h1, url: `${BASE}${path}`, applicationCategory: 'EducationalApplication', operatingSystem: 'Any', isAccessibleForFree: true, description: tool.description, offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' }, provider: { '@id': `${BASE}/#organization` } },
      { '@type': 'LearningResource', '@id': `${BASE}${path}#learning-resource`, name: tool.h1, description: tool.description, educationalLevel: tool.classLevel, learningResourceType: 'Calculator', teaches: tool.formula, isAccessibleForFree: true, inLanguage: 'en-IN', url: `${BASE}${path}` },
      { '@type': 'FAQPage', mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/` }, { '@type': 'ListItem', position: 2, name: 'Commerce Tools', item: `${BASE}/tools` }, { '@type': 'ListItem', position: 3, name: tool.title, item: `${BASE}${path}` }] },
    ],
  };
  const related = commerceTools.filter((item) => item.category === tool.category && item.slug !== tool.slug).slice(0, 7);
  const body = `<main class="page-container section-padding" data-prerendered="commerce-calculator"><nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/tools">Commerce Tools</a> / ${esc(tool.title)}</nav><article><p>${esc(tool.category)} · ${esc(tool.classLevel)}</p><h1>${esc(tool.h1)}</h1><p>${esc(tool.description)}</p><section><h2>Formula</h2><p><strong>${esc(tool.formula)}</strong></p></section><section><h2>Worked example</h2><p>${esc(tool.example)}</p><p>The interactive calculator on this page accepts your own question values and displays the final answer with step-by-step working.</p></section><section><h2>Frequently asked questions</h2>${faqs.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('')}</section><section><h2>Related ${esc(tool.category)} calculators</h2><ul>${related.map((item) => `<li><a href="/tools/${esc(item.slug)}">${esc(item.title)}</a></li>`).join('')}</ul></section><p><a href="/cbse-notes">Free CBSE notes</a> · <a href="/test-series">Practice tests</a> · <a href="/book-demo">Free paper analysis / demo</a></p></article></main>`;
  await writeRoute(path, makeHtml({ path, title, description: tool.description, body, structuredData }));
}

console.log(`Pre-rendered Commerce tools hub plus ${commerceTools.length} calculator pages.`);
