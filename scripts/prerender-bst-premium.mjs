import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import {
  CBSE_12_BST_FREE_PREVIEWS,
  CBSE_12_BST_PREMIUM_CHAPTERS,
  CBSE_12_BST_TOTAL_PAGES,
  cbse12BusinessStudiesPremiumMaterials,
} from '../src/data/cbse12BusinessStudiesPremium.js';

const BASE = 'https://www.smitsircommerce.in';
const PATH = '/premium/cbse-12-business-studies';
const TITLE = 'CBSE Class 12 Business Studies Premium Master Notes';
const FULL_TITLE = `${TITLE} | Smit Sir Commerce`;
const DESCRIPTION = `Browse all ${CBSE_12_BST_PREMIUM_CHAPTERS} detailed Smit Sir Commerce CBSE Class 12 Business Studies Premium Master chapters — ${CBSE_12_BST_TOTAL_PAGES} pages with theory, case studies, MCQs, model answers and exam-writing guidance.`;
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

const chapterItems = cbse12BusinessStudiesPremiumMaterials
  .map((chapter) => {
    const preview = chapter.freeQuickNotes
      ? ` <a href="${esc(chapter.freeQuickNotes)}">Open the free ${chapter.freeQuickPages}-page quick-note preview</a>.`
      : '';
    return `<li><strong>Chapter ${chapter.chapterNumber}: ${esc(chapter.title)}</strong> — ${chapter.pages} Premium pages.${preview}</li>`;
  })
  .join('');

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      '@id': `${BASE}${PATH}#webpage`,
      url: `${BASE}${PATH}`,
      name: TITLE,
      description: DESCRIPTION,
      inLanguage: 'en-IN',
      educationalLevel: 'CBSE Class 12',
      about: 'Business Studies',
      isAccessibleForFree: false,
      isPartOf: { '@id': `${BASE}/#website` },
      publisher: { '@id': `${BASE}/#organization` },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/` },
        { '@type': 'ListItem', position: 2, name: 'Premium', item: `${BASE}/premium` },
        { '@type': 'ListItem', position: 3, name: 'CBSE Class 12 Business Studies Premium', item: `${BASE}${PATH}` },
      ],
    },
    {
      '@type': 'ItemList',
      name: 'CBSE Class 12 Business Studies Premium Master chapters',
      numberOfItems: CBSE_12_BST_PREMIUM_CHAPTERS,
      itemListElement: cbse12BusinessStudiesPremiumMaterials.map((chapter, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'LearningResource',
          name: `Chapter ${chapter.chapterNumber}: ${chapter.title}`,
          educationalLevel: 'CBSE Class 12',
          learningResourceType: 'Premium study notes',
          isAccessibleForFree: false,
          url: `${BASE}${PATH}?chapter=${encodeURIComponent(chapter.resourceKey)}`,
        },
      })),
    },
  ],
};

const robots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
const tags = [
  `<meta name="description" content="${esc(DESCRIPTION)}">`,
  `<meta name="robots" content="${robots}">`,
  `<meta name="googlebot" content="${robots}">`,
  `<meta name="bingbot" content="${robots}">`,
  `<link rel="canonical" href="${BASE}${PATH}">`,
  '<meta property="og:type" content="website">',
  '<meta property="og:site_name" content="Smit Sir Commerce">',
  '<meta property="og:locale" content="en_IN">',
  `<meta property="og:title" content="${esc(FULL_TITLE)}">`,
  `<meta property="og:description" content="${esc(DESCRIPTION)}">`,
  `<meta property="og:url" content="${BASE}${PATH}">`,
  `<meta property="og:image" content="${BASE}/og-image.jpg">`,
  '<meta name="twitter:card" content="summary_large_image">',
  `<meta name="twitter:title" content="${esc(FULL_TITLE)}">`,
  `<meta name="twitter:description" content="${esc(DESCRIPTION)}">`,
  `<meta name="twitter:image" content="${BASE}/og-image.jpg">`,
  `<script type="application/ld+json">${JSON.stringify(structuredData).replaceAll('<', '\\u003c')}</script>`,
].join('\n');

const body = `<main class="page-container section-padding" data-prerendered="bst-premium-library"><article><nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/premium">Premium</a> / CBSE Class 12 Business Studies</nav><p><strong>CBSE · Class 12 · Business Studies · Premium Master</strong></p><h1>CBSE Class 12 Business Studies Premium Master Notes</h1><p>This Premium library contains ${CBSE_12_BST_PREMIUM_CHAPTERS} detailed Business Studies chapters across ${CBSE_12_BST_TOTAL_PAGES} pages. The library combines theory, case-study decoding, MCQs, model answers and board-exam writing guidance.</p><h2>Chapter-wise Premium Master library</h2><ol>${chapterItems}</ol><h2>How access works</h2><p>You can inspect the chapter titles, page counts and available free previews before buying. Detailed Premium PDFs open only after a signed-in student account has eligible Complete Commerce access. Public free notes and practice remain available without Premium.</p><p>${CBSE_12_BST_FREE_PREVIEWS} chapter quick-note preview${CBSE_12_BST_FREE_PREVIEWS === 1 ? ' is' : 's are'} currently linked from this library.</p><h2>Continue studying Business Studies</h2><ul><li><a href="/cbse/class-12/business-studies-notes">Free Class 12 Business Studies notes</a></li><li><a href="/cbse/class-12/business-studies-case-study-questions">Business Studies case-study questions</a></li><li><a href="/cbse/class-12/business-studies-mcq">Business Studies MCQs</a></li><li><a href="/premium">Compare Complete Commerce Premium</a></li><li><a href="/study-material">Browse all study material</a></li></ul></article></main>`;

const html = source
  .replace(/<title>.*?<\/title>/is, `<title>${esc(FULL_TITLE)}</title>`)
  .replace('</head>', `${tags}\n</head>`)
  .replace('<div id="root"></div>', `<div id="root">${body}</div>`);

const relative = PATH.replace(/^\//, '');
const flat = join(distRoot.pathname, `${relative}.html`);
const nested = join(distRoot.pathname, relative, 'index.html');
await mkdir(dirname(flat), { recursive: true });
await mkdir(dirname(nested), { recursive: true });
await writeFile(flat, html, 'utf8');
await writeFile(nested, html, 'utf8');
console.log(`Prerendered ${PATH} with ${CBSE_12_BST_PREMIUM_CHAPTERS} Business Studies Premium chapters.`);
