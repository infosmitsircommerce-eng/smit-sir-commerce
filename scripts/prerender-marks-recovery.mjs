import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const BASE = 'https://www.smitsircommerce.in';
const SITE = 'Smit Sir Commerce';
const path = '/marks-recovery';
const title = 'Commerce Marks Leak & Recovery Engine — Free Class 11 & 12 Diagnostic';
const description = 'Find why you are losing marks in Commerce, calculate a Commerce Readiness Score and get a personalised 5-day recovery plan for Economics, Business Studies and Accountancy.';
const source = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const distRoot = new URL('../dist/', import.meta.url);
const esc = (value) => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
const url = `${BASE}${path}`;
const robots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebApplication', '@id': `${url}#app`, name: 'Commerce Marks Leak & Recovery Engine', url, applicationCategory: 'EducationalApplication', operatingSystem: 'Any', isAccessibleForFree: true, description, offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' }, provider: { '@id': `${BASE}/#organization` } },
    { '@type': 'LearningResource', name: 'Commerce Marks Recovery Diagnostic', url, learningResourceType: 'Diagnostic assessment', educationalLevel: ['Class 11','Class 12'], isAccessibleForFree: true, teaches: ['Error analysis','Weak-topic identification','Exam recovery planning'] },
    { '@type': 'FAQPage', mainEntity: [
      { '@type': 'Question', name: 'What is a marks leak?', acceptedAnswer: { '@type': 'Answer', text: 'A marks leak is a repeatable reason marks are being lost, such as a concept gap, formula mistake, question interpretation, answer structure, time pressure or a careless error.' } },
      { '@type': 'Question', name: 'Is the Commerce Readiness Score a predicted board mark?', acceptedAnswer: { '@type': 'Answer', text: 'No. It is a study-planning estimate based on the score and mistake information entered by the student. It is not a board-exam prediction or guarantee.' } },
      { '@type': 'Question', name: 'Does the tool require a login?', acceptedAnswer: { '@type': 'Answer', text: 'No. Detailed diagnostic history is stored in the student’s browser. Anonymous aggregate events can be used to understand common Commerce mistake patterns.' } }
    ] },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type':'ListItem', position:1, name:'Home', item:`${BASE}/` }, { '@type':'ListItem', position:2, name:'Marks Recovery', item:url }] }
  ]
};
const tags = `<meta name="description" content="${esc(description)}"><meta name="robots" content="${robots}"><meta name="googlebot" content="${robots}"><meta name="bingbot" content="${robots}"><link rel="canonical" href="${url}"><meta property="og:type" content="website"><meta property="og:site_name" content="${SITE}"><meta property="og:locale" content="en_IN"><meta property="og:title" content="${esc(title)} | ${SITE}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${BASE}/og-image.jpg"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)} | ${SITE}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${BASE}/og-image.jpg"><script type="application/ld+json">${JSON.stringify(structuredData).replaceAll('<','\\u003c')}</script>`;
const body = `<main class="page-container section-padding" data-prerendered="marks-recovery"><nav aria-label="Breadcrumb"><a href="/">Home</a> / Marks Recovery</nav><article><p>Free Commerce diagnostic for Class 11 &amp; 12</p><h1>Commerce Marks Leak &amp; Recovery Engine</h1><p>${esc(description)}</p><section><h2>Find why marks are being lost</h2><ul><li>Concept gaps</li><li>Formula and calculation mistakes</li><li>Question interpretation errors</li><li>Answer structure and missing keywords</li><li>Time pressure and incomplete answers</li><li>Careless or weak-revision mistakes</li></ul></section><section><h2>What the free diagnostic creates</h2><ul><li>A Commerce Readiness Score for study planning</li><li>A marks-leak map based on the student’s own checked paper</li><li>Weak-topic links to relevant calculators, notes and practice</li><li>A focused 5-day recovery plan</li><li>A retest step to measure marks recovered</li></ul></section><section><h2>Subjects supported in the first version</h2><ul><li>Class 11 Economics</li><li>Class 12 Economics</li><li>Class 12 Business Studies</li><li>Class 12 Accountancy</li></ul></section><section><h2>Privacy-first diagnostic</h2><p>Detailed marks history stays in the student’s browser. No name, phone number or answer sheet is required. Anonymous aggregate categories can be used to understand common Commerce mistake patterns.</p></section><section><h2>Frequently asked questions</h2><h3>Is the readiness score a board-exam prediction?</h3><p>No. It is a study-planning estimate and not a marks guarantee.</p><h3>What should I do after the report?</h3><p>Follow the weak-topic recovery links, complete the five-day sprint and then take a comparable retest to measure recovered marks.</p></section><p><a href="/tools">Free Commerce calculators</a> · <a href="/cbse-notes">Free CBSE notes</a> · <a href="/book-demo?source=marks-recovery">Free human paper analysis</a></p></article></main>`;
const html = source.replace(/<title>.*?<\/title>/s, `<title>${esc(title)} | ${SITE}</title>`).replace('</head>', `${tags}\n</head>`).replace('<div id="root"></div>', `<div id="root">${body}</div>`);
const relative = path.replace(/^\//,'');
for (const file of [join(distRoot.pathname, `${relative}.html`), join(distRoot.pathname, relative, 'index.html')]) { await mkdir(dirname(file), { recursive: true }); await writeFile(file, html, 'utf8'); }
console.log('Pre-rendered Commerce Marks Leak & Recovery Engine.');
