import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const BASE = 'https://www.smitsircommerce.in';
const SITE = 'Smit Sir Commerce';
const source = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const distRoot = new URL('../dist/', import.meta.url);

function esc(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

async function renderPage({ path, title, description, body, structuredData }) {
  const fullTitle = `${title} | ${SITE}`;
  const url = `${BASE}${path}`;
  const robots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
  const tags = `<meta name="description" content="${esc(description)}"><meta name="robots" content="${robots}"><meta name="googlebot" content="${robots}"><link rel="canonical" href="${url}"><meta property="og:type" content="website"><meta property="og:site_name" content="${SITE}"><meta property="og:locale" content="en_IN"><meta property="og:title" content="${esc(fullTitle)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${BASE}/og-image.jpg"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(fullTitle)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${BASE}/og-image.jpg"><script type="application/ld+json">${JSON.stringify(structuredData).replaceAll('<', '\\u003c')}</script>`;

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
}

const demoPath = '/book-demo';
const demoTitle = 'Free Commerce Paper Analysis & Demo in Mehsana';
const demoDescription = 'Class 11 and 12 Commerce students in Mehsana can get a free test-paper analysis, weak-topic plan and demo class with Smit Sir Commerce for Economics, Business Studies, Entrepreneurship and Physical Education.';
await renderPage({
  path: demoPath,
  title: demoTitle,
  description: demoDescription,
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${BASE}${demoPath}#webpage`,
        url: `${BASE}${demoPath}`,
        name: demoTitle,
        description: demoDescription,
        inLanguage: 'en-IN',
        isPartOf: { '@id': `${BASE}/#website` },
      },
      {
        '@type': 'Service',
        '@id': `${BASE}${demoPath}#service`,
        name: 'Free Commerce Paper Analysis and Demo Class',
        serviceType: 'Commerce academic diagnostic and demo class',
        provider: { '@id': `${BASE}/#organization` },
        areaServed: { '@type': 'City', name: 'Mehsana' },
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR', url: `${BASE}${demoPath}` },
      },
    ],
  },
  body: `<main class="page-container section-padding" data-prerendered="conversion"><article><p>Mehsana · Class 11 &amp; 12 · Free academic starting point</p><h1>Free Commerce Paper Analysis &amp; Demo in Mehsana</h1><p>Already enrolled in another tuition? You do not need to leave it. Bring your latest test paper, identify where marks are being lost and understand which weak topics need attention before making any admission decision.</p><h2>What students can get</h2><ul><li>Free test-paper and mistake analysis</li><li>Weak-topic action plan</li><li>Free demo class with Smit Sir</li><li>Teaching support in Economics, Business Studies, Entrepreneurship and Physical Education</li></ul><h2>My teaching commitment</h2><p>If an enrolled student regularly attends, completes the required work and tests, follows the agreed study plan, and still fails the subject taught by Smit Sir, the tuition fee for that subject is refunded according to written eligibility terms shared before enrolment. This is not a marks guarantee; it is a commitment for students who sincerely follow the academic system.</p><p><a href="/contact">Send an enquiry</a> · <a href="/commerce-coaching-mehsana">Commerce tuition in Mehsana</a></p></article></main>`,
});

const packPath = '/free-commerce-study-pack';
const packTitle = 'Free Commerce Study Pack — Class 11 & 12 CBSE + GSEB';
const packDescription = 'Free Commerce study pack for Class 11 and 12 students with CBSE and GSEB notes, chapter-wise practice, Economics and Accountancy calculators, and a free paper-analysis option.';
const packLinks = [
  ['/cbse/class-11/microeconomics-notes', 'Class 11 Microeconomics Notes'],
  ['/cbse/class-12/business-studies-notes', 'Class 12 Business Studies Notes'],
  ['/cbse/class-12/macroeconomics-notes', 'Class 12 Macroeconomics Notes'],
  ['/gseb-class-12-economics.html', 'GSEB Class 12 Economics Notes'],
  ['/cbse-practice', 'Chapter-wise Commerce Practice'],
  ['/tools', '41 Commerce Calculators'],
  ['/downloads/class-12-economics-quick-revision-pack.pdf', 'Class 12 Economics Quick Revision PDF'],
];
await renderPage({
  path: packPath,
  title: packTitle,
  description: packDescription,
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${BASE}${packPath}#webpage`,
        url: `${BASE}${packPath}`,
        name: packTitle,
        description: packDescription,
        isAccessibleForFree: true,
        inLanguage: 'en-IN',
        isPartOf: { '@id': `${BASE}/#website` },
      },
      {
        '@type': 'ItemList',
        name: 'Free Commerce learning resources',
        itemListElement: packLinks.map(([href, name], index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name,
          url: `${BASE}${href}`,
        })),
      },
    ],
  },
  body: `<main class="page-container section-padding" data-prerendered="conversion"><article><p>Free · No sign-up required · Class 11 &amp; 12 Commerce</p><h1>Free Commerce Study Pack — CBSE + GSEB</h1><p>Use one page to reach currently published Commerce notes, chapter practice and calculators. Open the resource you need, study it with your prescribed textbook, and share the pack with a classmate if it is useful.</p><h2>What is inside</h2><ul>${packLinks.map(([href, name]) => `<li><a href="${href}">${esc(name)}</a></li>`).join('')}</ul><h2>Marks still not improving?</h2><p>Students in Mehsana can also request a free paper analysis and demo with Smit Sir for Economics, Business Studies, Entrepreneurship and Physical Education. Accountancy calculators on the website are learning resources.</p><p><a href="/book-demo">Request free paper analysis</a> · <a href="/marks-recovery">Use Marks Recovery</a></p></article></main>`,
});

console.log('Pre-rendered free Commerce paper analysis + free study pack conversion pages.');
