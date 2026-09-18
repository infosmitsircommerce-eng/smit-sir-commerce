import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { silentSearchPages } from '../src/data/silentSearchPages.js';

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

function cleanPublicPath(path) {
  return path?.endsWith('.html') ? path.slice(0, -5) : path;
}

function canonicalPathFor(page) {
  const mainChapterLink = page.links?.find(
    (link) => link.label === 'Open main chapter page',
  )?.href;
  return cleanPublicPath(page.canonicalHub || mainChapterLink || page.path);
}

function stripSpaRuntime(html) {
  return html
    .replace(/\s*<script type="module"[^>]*src="\/assets\/index-[^"]+\.js"><\/script>/g, '')
    .replace(/\s*<link rel="modulepreload"[^>]*href="\/assets\/[^"]+">/g, '')
    .replace(/\s*<script id="vite-plugin-pwa:register-sw"[^>]*><\/script>/g, '');
}

function renderLinks(links = []) {
  if (!links.length) return '';
  return `<section class="resource-links"><h2>Continue with these study resources</h2><ul>${links.map((link) => `<li><a href="${esc(cleanPublicPath(link.href))}">${esc(link.label)}</a></li>`).join('')}</ul></section>`;
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
  const pageUrl = absolute(cleanPublicPath(page.path));
  const canonicalUrl = absolute(canonicalPathFor(page));
  const fullTitle = `${page.title} | ${SITE}`;
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: page.title,
        description: page.description,
        inLanguage: 'en-IN',
        isPartOf: { '@id': `${BASE}/#website` },
        about: page.primaryKeyword,
      },
      {
        '@type': 'LearningResource',
        '@id': `${canonicalUrl}#learning-resource`,
        name: page.title,
        description: page.description,
        educationalLevel: 'Class 12',
        learningResourceType: 'Study material',
        isAccessibleForFree: true,
        provider: { '@type': 'EducationalOrganization', name: SITE, url: BASE, logo: `${BASE}/og-image.jpg` },
        teaches: page.primaryKeyword,
        audience: { '@type': 'EducationalAudience', educationalRole: 'student' },
      },
      ...(page.faq?.length ? [{
        '@type': 'FAQPage',
        '@id': `${canonicalUrl}#faq`,
        mainEntity: page.faq.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      }] : []),
    ],
  };

  const tags = `<meta name="description" content="${esc(page.description)}"><meta name="robots" content="${robots}"><meta name="googlebot" content="${robots}"><link rel="canonical" href="${canonicalUrl}"><link rel="alternate" type="text/plain" href="${BASE}/llms.txt" title="LLMS text summary for Smit Sir Commerce"><link rel="alternate" type="application/json" href="${BASE}/ai-summary.json" title="AI summary JSON for Smit Sir Commerce"><meta property="og:type" content="article"><meta property="og:site_name" content="${SITE}"><meta property="og:title" content="${esc(fullTitle)}"><meta property="og:description" content="${esc(page.description)}"><meta property="og:url" content="${canonicalUrl}"><meta property="og:image" content="${BASE}/og-image.jpg"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(fullTitle)}"><meta name="twitter:description" content="${esc(page.description)}"><meta name="twitter:image" content="${BASE}/og-image.jpg"><script type="application/ld+json">${jsonLd(schema)}</script>`;

  const body = `<main class="page-container section-padding" data-prerendered="student-resource" data-public-url="${esc(pageUrl)}"><article><p style="font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#966313">Free Commerce Study Guide</p><h1>${esc(page.h1)}</h1><p><strong>Useful for:</strong> ${esc(page.intent)}</p><p>${esc(page.intro)}</p>${page.sections.map(renderSection).join('')}${renderLinks(page.links)}${renderFaq(page.faq)}<section><h2>More free Commerce help</h2><p><a href="/study-material">Study Material</a> · <a href="/cbse-notes">CBSE Notes</a> · <a href="/gseb-class-12-economics">GSEB Economics PDFs</a> · <a href="/tools">Commerce Tools</a> · <a href="/games">Commerce Games</a></p></section></article></main>`;

  const withHead = stripSpaRuntime(source)
    .replace(/<title>.*?<\/title>/s, `<title>${esc(fullTitle)}</title>`)
    .replace('</head>', `${tags}\n</head>`);

  return replaceRoot(withHead, body);
}

const renderablePages = silentSearchPages.filter((page) => !page.path.startsWith('/gseb-class-12-economics-chapter-'));

for (const page of renderablePages) {
  const publicPath = cleanPublicPath(page.path);
  const relative = publicPath.replace(/^\//, '');
  const flatPath = join(distRoot, relative + '.html');
  const directoryPath = join(distRoot, relative, 'index.html');
  const html = renderPage(page);
  await mkdir(dirname(flatPath), { recursive: true });
  await mkdir(dirname(directoryPath), { recursive: true });
  await writeFile(flatPath, html, 'utf8');
  await writeFile(directoryPath, html, 'utf8');
}

console.log(`Pre-rendered ${renderablePages.length} student-focused Commerce resource pages with canonical hub consolidation.`);
