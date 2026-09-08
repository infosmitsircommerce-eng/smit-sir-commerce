import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { localActionPages } from '../src/data/localActionPages.js';

const BASE = 'https://www.smitsircommerce.in';
const SITE = 'Smit Sir Commerce';
const source = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const distRoot = new URL('../dist/', import.meta.url).pathname;
const robots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

function esc(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function jsonLd(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

function absolute(path) {
  return path.startsWith('http') ? path : `${BASE}${path}`;
}

function renderLinks(links = []) {
  if (!links.length) return '';
  return `<section class="silent-links"><h2>Open the useful pages</h2><ul>${links.map((link) => `<li><a href="${esc(link.href)}">${esc(link.label)}</a></li>`).join('')}</ul></section>`;
}

function renderSection(section) {
  const text = section.text ? `<p>${esc(section.text)}</p>` : '';
  const items = section.items?.length ? `<ul>${section.items.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>` : '';
  return `<section><h2>${esc(section.heading)}</h2>${text}${items}</section>`;
}

function renderFaq(faq = []) {
  if (!faq.length) return '';
  return `<section><h2>Quick answers</h2>${faq.map((item) => `<details><summary>${esc(item.q)}</summary><p>${esc(item.a)}</p></details>`).join('')}</section>`;
}

function replaceRoot(html, body) {
  const replacement = `<body>\n    <div id="root">${body}</div>\n  </body>`;
  if (/<body>[\s\S]*?<\/body>/i.test(html)) {
    return html.replace(/<body>[\s\S]*?<\/body>/i, replacement);
  }
  return html.replace('<div id="root"></div>', `<div id="root">${body}</div>`);
}

function renderPage(page) {
  const url = absolute(page.path);
  const fullTitle = `${page.title} | ${SITE}`;
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: page.title,
        description: page.description,
        inLanguage: 'en-IN',
        isPartOf: { '@id': `${BASE}/#website` },
        about: page.primaryKeyword,
      },
      {
        '@type': 'LocalBusiness',
        '@id': `${url}#local-business-context`,
        name: SITE,
        url: BASE,
        email: 'infosmitsircommerce@gmail.com',
        areaServed: {
          '@type': 'City',
          name: 'Mehsana',
          containedInPlace: {
            '@type': 'State',
            name: 'Gujarat',
            containedInPlace: { '@type': 'Country', name: 'India' },
          },
        },
        knowsAbout: ['Commerce tuition', 'Class 11 Commerce', 'Class 12 Commerce', 'Economics', 'Business Studies', 'GSEB Economics', 'CBSE Commerce'],
      },
      {
        '@type': 'LearningResource',
        '@id': `${url}#learning-resource`,
        name: page.title,
        description: page.description,
        educationalLevel: ['Class 11', 'Class 12'],
        learningResourceType: 'Study material',
        isAccessibleForFree: true,
        provider: { '@type': 'EducationalOrganization', name: SITE, url: BASE },
        teaches: page.primaryKeyword,
        audience: { '@type': 'EducationalAudience', educationalRole: 'student' },
      },
      ...(page.links?.length ? [{
        '@type': 'ItemList',
        '@id': `${url}#links`,
        name: `${page.title} links`,
        itemListElement: page.links.map((link, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: link.label,
          url: absolute(link.href),
        })),
      }] : []),
      ...(page.faq?.length ? [{
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: page.faq.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      }] : []),
    ],
  };

  const tags = `<meta name="description" content="${esc(page.description)}"><meta name="robots" content="${robots}"><meta name="googlebot" content="${robots}"><link rel="canonical" href="${url}"><link rel="alternate" type="text/plain" href="${BASE}/llms.txt" title="LLMS text summary for Smit Sir Commerce"><link rel="alternate" type="application/json" href="${BASE}/ai-summary.json" title="AI summary JSON for Smit Sir Commerce"><meta property="og:type" content="article"><meta property="og:site_name" content="${SITE}"><meta property="og:title" content="${esc(fullTitle)}"><meta property="og:description" content="${esc(page.description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${BASE}/og-image.jpg"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(fullTitle)}"><meta name="twitter:description" content="${esc(page.description)}"><meta name="twitter:image" content="${BASE}/og-image.jpg"><script type="application/ld+json">${jsonLd(schema)}</script>`;

  const body = `<main class="page-container section-padding" data-prerendered="local-action"><article><p style="font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#966313">Mehsana Commerce Resource</p><h1>${esc(page.h1)}</h1><p><strong>Best for:</strong> ${esc(page.intent)}</p><p>${esc(page.intro)}</p>${page.sections.map(renderSection).join('')}${renderLinks(page.links)}${renderFaq(page.faq)}<section><h2>Use this with the main website</h2><p>This page is a free local study route, not an official board publication. For more learning support, open <a href="/study-material">Study Material</a>, <a href="/cbse-notes">CBSE Notes</a>, <a href="/gseb-class-12-economics.html">GSEB Economics PDFs</a>, <a href="/tools">Commerce Tools</a> and <a href="/games">Commerce Games</a>.</p></section></article></main>`;

  const withHead = source
    .replace(/<title>.*?<\/title>/s, `<title>${esc(fullTitle)}</title>`)
    .replace(/<script type="module"[\s\S]*?<\/script>/g, '')
    .replace(/<link rel="modulepreload"[^>]*>/g, '')
    .replace(/<script id="vite-plugin-pwa:register-sw"[^>]*><\/script>/g, '')
    .replace('</head>', `${tags}\n</head>`);

  return replaceRoot(withHead, body);
}

for (const page of localActionPages) {
  const relative = page.path.replace(/^\//, '');
  const htmlPath = join(distRoot, relative);
  await mkdir(dirname(htmlPath), { recursive: true });
  await writeFile(htmlPath, renderPage(page), 'utf8');
}

console.log(`Pre-rendered ${localActionPages.length} Mehsana local action pages.`);
