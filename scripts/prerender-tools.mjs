import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { commerceTools } from '../src/data/allCommerceTools.js';
import { toolClusters, getClusterTools } from '../src/data/toolClusters.js';
import { toolClusterEnhancements } from '../src/data/highIntentEnhancements.js';

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

function enhancementBody(enhancement = {}) {
  const formulaMap = enhancement.formulaMap?.length
    ? `<section><h2>Formula map</h2><ul>${enhancement.formulaMap.map(([label, formula, note]) => `<li><strong>${esc(label)}:</strong> ${esc(formula)} — ${esc(note)}</li>`).join('')}</ul></section>`
    : '';
  const worked = enhancement.workedExamples?.length
    ? `<section><h2>${enhancement.workedExamples.length} solved numericals with steps</h2><p>These are original learning problems prepared for practice and are not labelled as official CBSE previous-year questions.</p>${enhancement.workedExamples.map((item, index) => `<article><h3>Q${index + 1}. ${esc(item.title)} — ${esc(item.level)}</h3><p>${esc(item.question)}</p><ol>${item.working.map(step => `<li>${esc(step)}</li>`).join('')}</ol><p><strong>Answer: ${esc(item.answer)}</strong></p></article>`).join('')}</section>`
    : '';
  const selfTest = enhancement.selfTest?.length
    ? `<section><h2>Quick self-test</h2><ol>${enhancement.selfTest.map(([q, a]) => `<li>${esc(q)} <strong>Answer:</strong> ${esc(a)}</li>`).join('')}</ol></section>`
    : '';
  const related = enhancement.relatedLearning?.length
    ? `<section><h2>Continue the topic</h2><ul>${enhancement.relatedLearning.map(([path, label]) => `<li><a href="${esc(path)}">${esc(label)}</a></li>`).join('')}</ul></section>`
    : '';
  return `${formulaMap}${worked}${selfTest}${related}`;
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
const clusterLinks = toolClusters.map((cluster) => `<li><a href="/tools/topics/${esc(cluster.slug)}">${esc(cluster.title)}</a></li>`).join('');
const hubBody = `<main class="page-container section-padding" data-prerendered="commerce-tools"><nav aria-label="Breadcrumb"><a href="/">Home</a> / Commerce Tools</nav><article><p>Free Class 11 &amp; 12 Commerce problem solvers</p><h1>Free Commerce Calculators for Economics &amp; Accountancy</h1><p>${esc(hubDescription)}</p><section><h2>Study by topic</h2><ul>${clusterLinks}</ul></section><section><h2>Economics calculators</h2><ul>${byCategory('Economics')}</ul></section><section><h2>Accountancy ratio calculators</h2><ul>${byCategory('Accountancy')}</ul></section><p><a href="/cbse-notes">Free CBSE notes</a> · <a href="/test-series">Practice tests</a> · <a href="/book-demo">Free paper analysis / demo</a></p></article></main>`;
await writeRoute(hubPath, makeHtml({ path: hubPath, title: hubTitle, description: hubDescription, body: hubBody, structuredData: hubStructuredData }));

for (const cluster of toolClusters) {
  const path = `/tools/topics/${cluster.slug}`;
  const tools = getClusterTools(cluster);
  const enhancement = toolClusterEnhancements[cluster.slug] || {};
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'CollectionPage', '@id': `${BASE}${path}#webpage`, url: `${BASE}${path}`, name: cluster.h1, description: cluster.description, inLanguage: 'en-IN', isPartOf: { '@id': `${BASE}/#website` } },
      ...(enhancement.workedExamples?.length ? [{ '@type': 'LearningResource', '@id': `${BASE}${path}#worked-practice`, url: `${BASE}${path}`, name: enhancement.searchLabel || cluster.h1, description: cluster.description, isAccessibleForFree: true, inLanguage: 'en-IN', learningResourceType: ['Worked example','Calculator collection'], provider: { '@id': `${BASE}/#organization` } }] : []),
      { '@type': 'ItemList', name: cluster.title, itemListElement: tools.map((tool, index) => ({ '@type': 'ListItem', position: index + 1, name: tool.h1, url: `${BASE}/tools/${tool.slug}` })) },
      { '@type': 'FAQPage', mainEntity: cluster.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/` }, { '@type': 'ListItem', position: 2, name: 'Commerce Tools', item: `${BASE}/tools` }, { '@type': 'ListItem', position: 3, name: cluster.title, item: `${BASE}${path}` }] },
    ],
  };
  const body = `<main class="page-container section-padding" data-prerendered="commerce-tool-cluster"><nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/tools">Commerce Tools</a> / ${esc(cluster.title)}</nav><article><p>Free Commerce topic toolkit</p><h1>${esc(cluster.h1)}</h1><p>${esc(cluster.intro)}</p>${enhancementBody(enhancement)}<section><h2>Topics covered</h2><ul>${cluster.concepts.map((concept) => `<li>${esc(concept)}</li>`).join('')}</ul></section><section><h2>Calculators in this toolkit</h2><ul>${tools.map((tool) => `<li><a href="/tools/${esc(tool.slug)}">${esc(tool.h1)}</a> — ${esc(tool.formula)}</li>`).join('')}</ul></section><section><h2>Frequently asked questions</h2>${cluster.faq.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('')}</section><p><a href="/cbse-notes">Free CBSE notes</a> · <a href="/test-series">Practice tests</a> · <a href="/marks-recovery">Marks Recovery</a> · <a href="/book-demo">Free paper analysis / demo</a></p></article></main>`;
  await writeRoute(path, makeHtml({ path, title: cluster.title, description: cluster.description, body, structuredData }));
}

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

console.log(`Pre-rendered Commerce tools hub, ${toolClusters.length} topic clusters and ${commerceTools.length} calculator pages.`);
