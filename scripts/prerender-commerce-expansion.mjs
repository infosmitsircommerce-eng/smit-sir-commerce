import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { commerceExamUnits } from '../src/data/commerceExpansion.js';

const BASE = 'https://www.smitsircommerce.in';
const SITE = 'Smit Sir Commerce';
const source = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const distRoot = new URL('../dist/', import.meta.url);

function esc(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function buildHtml(page) {
  const fullTitle = page.title + ' | ' + SITE;
  const canonical = BASE + page.path;
  const robots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': canonical + '#collection',
        url: canonical,
        name: page.title,
        description: page.description,
        inLanguage: 'en-IN',
        isPartOf: { '@id': BASE + '/#website' },
        publisher: { '@id': BASE + '/#organization' },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE + '/' },
          { '@type': 'ListItem', position: 2, name: page.title, item: canonical },
        ],
      },
    ],
  };

  const tags = [
    '<meta name="description" content="' + esc(page.description) + '">',
    '<meta name="robots" content="' + robots + '">',
    '<meta name="googlebot" content="' + robots + '">',
    '<meta name="bingbot" content="' + robots + '">',
    '<link rel="canonical" href="' + esc(canonical) + '">',
    '<meta property="og:type" content="website">',
    '<meta property="og:site_name" content="' + SITE + '">',
    '<meta property="og:locale" content="en_IN">',
    '<meta property="og:title" content="' + esc(fullTitle) + '">',
    '<meta property="og:description" content="' + esc(page.description) + '">',
    '<meta property="og:url" content="' + esc(canonical) + '">',
    '<meta property="og:image" content="' + BASE + '/og-image.jpg">',
    '<meta name="twitter:card" content="summary_large_image">',
    '<meta name="twitter:title" content="' + esc(fullTitle) + '">',
    '<meta name="twitter:description" content="' + esc(page.description) + '">',
    '<meta name="twitter:image" content="' + BASE + '/og-image.jpg">',
    '<script type="application/ld+json">' + JSON.stringify(schema).replaceAll('<', '\\u003c') + '</script>',
  ].join('\n');

  return source
    .replace(/<title>.*?<\/title>/s, '<title>' + esc(fullTitle) + '</title>')
    .replace('</head>', tags + '\n</head>')
    .replace('<div id="root"></div>', '<div id="root">' + page.body + '</div>');
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

const units = commerceExamUnits.map((unit, index) =>
  '<li><strong>Unit ' + (index + 1) + ':</strong> ' + esc(unit) + '</li>'
).join('');

const explore = '<nav aria-label="Commerce learning pathways"><h2>Explore the Commerce journey</h2><ul>' +
  '<li><a href="/cbse-notes">Class 11 & 12 Commerce notes</a></li>' +
  '<li><a href="/college-commerce">B.Com & M.Com roadmap</a></li>' +
  '<li><a href="/commerce-exams">Commerce competitive exams</a></li>' +
  '<li><a href="/ugc-net-commerce">UGC NET Commerce</a></li>' +
  '<li><a href="/gset-commerce">GSET Commerce</a></li>' +
  '<li><a href="/tools">Commerce calculators and tools</a></li>' +
  '</ul></nav>';

const pages = [
  {
    path: '/commerce-learning',
    title: 'Commerce Learning Hub — School, College & Competitive Exams',
    description: 'A growing Commerce learning platform for Class 11 & 12, B.Com, M.Com, UGC NET Commerce and GSET Commerce with notes, PDFs, practice and tools.',
    body: '<main class="page-container section-padding" data-prerendered="commerce-expansion"><article><h1>Commerce learning from school to college and competitive exams</h1><p>Smit Sir Commerce is being organised as a broader Commerce learning platform rather than only a Class 11 and 12 website. The strongest published library remains school Commerce, while dedicated college and competitive-exam sections are being prepared for future uploads.</p><h2>Three learning stages</h2><p><strong>School Commerce:</strong> Class 11 and 12 notes, practice, tests and tools. <strong>College Commerce:</strong> B.Com and M.Com semester structures that will receive university-specific material. <strong>Competitive Commerce:</strong> UGC NET and GSET Commerce hubs for syllabus, unit notes, MCQs, previous papers and mock tests.</p><p>Smit Sir personally specialises in Class 11 and 12 Commerce teaching. The wider resource platform can cover additional Commerce stages without claiming that every listed subject is personally taught.</p>' + explore + '</article></main>',
  },
  {
    path: '/college-commerce',
    title: 'College Commerce Study Material — B.Com & M.Com',
    description: 'College Commerce study-material hub for B.Com semesters 1–6 and M.Com semesters 1–4, with university-specific notes, MCQs, PYQs and revision resources planned.',
    body: '<main class="page-container section-padding" data-prerendered="commerce-expansion"><article><h1>B.Com and M.Com college Commerce resource hub</h1><p>The college section is structured before the files arrive so future material can be placed correctly by degree, university, semester, subject and academic year. B.Com is organised across six semester slots and M.Com across four semester slots.</p><h2>Why university mapping matters</h2><p>Subject names and semester structures can differ across universities, electives, NEP or CBCS frameworks and academic years. For that reason, Smit Sir Commerce will not pretend that one generic subject list is an official syllabus for every college. The B.Com and M.Com roadmap pages are visible to users while individual subject pages will be activated only when genuine material is uploaded.</p><p><a href="/college-commerce/bcom">View the B.Com semester roadmap</a> · <a href="/college-commerce/mcom">View the M.Com semester roadmap</a></p>' + explore + '</article></main>',
  },
  {
    path: '/commerce-exams',
    title: 'Commerce Competitive Exams — UGC NET & GSET',
    description: 'Commerce competitive-exam hub for UGC NET Commerce and GSET Commerce with syllabus structure, unit-wise notes, MCQs, previous papers, mock tests and revision.',
    body: '<main class="page-container section-padding" data-prerendered="commerce-expansion"><article><h1>UGC NET and GSET Commerce preparation hub</h1><p>This section separates exam-specific information while allowing overlapping Commerce concepts to share one strong learning resource. UGC NET Commerce and GSET Commerce each receive their own syllabus, previous-paper and mock-test pathways.</p><h2>Commerce unit map</h2><ol>' + units + '</ol><p>The resource library is being built for official syllabus documents, unit-wise notes, MCQs, previous papers, mock tests and revision sheets. Materials will be marked available only when they have actually been uploaded.</p>' + explore + '</article></main>',
  },
  {
    path: '/ugc-net-commerce',
    title: 'UGC NET Commerce — Syllabus, Notes, MCQs & PYQs',
    description: 'UGC NET Commerce subject 08/008 preparation hub with Paper 1, Commerce syllabus structure, unit-wise notes, MCQs, previous papers, mock tests and revision.',
    body: '<main class="page-container section-padding" data-prerendered="commerce-expansion"><article><h1>UGC NET Commerce preparation — subject 08 / 008</h1><p>The UGC subject list identifies Commerce as subject code 08, while NTA answer-key material displays it as 008. This page is reserved for Paper 1 plus the Commerce subject preparation library.</p><h2>Commerce subject units</h2><ol>' + units + '</ol><p>Future resources will include the official syllabus PDF, unit-wise notes, MCQs, previous papers, mock tests and revision. Paper 1 material will remain clearly separated from Commerce subject material.</p>' + explore + '</article></main>',
  },
  {
    path: '/gset-commerce',
    title: 'GSET Commerce — Syllabus, Notes, MCQs & PYQs',
    description: 'GSET Commerce code 17 preparation hub with official syllabus structure, unit-wise notes, MCQs, previous papers, mock tests and revision.',
    body: '<main class="page-container section-padding" data-prerendered="commerce-expansion"><article><h1>GSET Commerce preparation — subject code 17</h1><p>The official Gujarat State Eligibility Test Commerce syllabus identifies Commerce as code 17. This page is structured for syllabus, unit-wise notes, MCQs, previous papers, mock tests and revision material.</p><h2>GSET Commerce units</h2><ol>' + units + '</ol><p>The visible structure is ready now, while resource links will be activated progressively as verified PDFs and practice material are uploaded.</p>' + explore + '</article></main>',
  },
];

for (const page of pages) {
  await writeRoute(page.path, buildHtml(page));
}

console.log('Pre-rendered ' + pages.length + ' school-college-competitive Commerce expansion pages.');
