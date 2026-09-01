import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { growthPages, growthStats, getGrowthStructuredData } from '../src/data/contentGrowth.js';

const BASE = 'https://www.smitsircommerce.in';
const SITE = 'Smit Sir Commerce';
const source = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const distRoot = new URL('../dist/', import.meta.url);

function escapeHtml(value) {
  return String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

function renderMcqs(page) {
  return `<h2>${escapeHtml(page.chapter)} MCQs with answers</h2>${page.mcqs.map((mcq, index) => `<section><h3>Q${index + 1}. ${escapeHtml(mcq.question)}</h3><ol type="A">${mcq.options.map((option) => `<li>${escapeHtml(option)}</li>`).join('')}</ol><p><strong>Answer: ${String.fromCharCode(65 + mcq.answer)}.</strong> ${escapeHtml(mcq.explanation)}</p></section>`).join('')}`;
}

function renderQuestions(page) {
  return `<h2>Important ${escapeHtml(page.chapter)} questions</h2><p>These are original board-style practice questions and are not represented as official previous-year CBSE questions.</p>${page.questions.map((item, index) => `<section><h3>Q${index + 1}. ${escapeHtml(item.question)}</h3><p>${escapeHtml(item.answer)}</p></section>`).join('')}`;
}

function renderRevision(page) {
  return `<h2>One-shot revision checklist</h2><ul>${page.revision.quickRecall.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul><h2>Exam traps to avoid</h2><ol>${page.revision.traps.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ol><h2>Final self-check</h2><ul>${page.revision.finalCheck.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
}

function renderAssertionReason(page) {
  return `<h2>Assertion–Reason practice</h2><p>Use the standard choices: A = both true and Reason correctly explains Assertion; B = both true but Reason does not correctly explain Assertion; C = Assertion true and Reason false; D = Assertion false and Reason true.</p>${page.assertionReason.map((item, index) => `<section><h3>Question ${index + 1}</h3><p><strong>Assertion:</strong> ${escapeHtml(item.assertion)}</p><p><strong>Reason:</strong> ${escapeHtml(item.reason)}</p><p><strong>Answer: ${escapeHtml(item.answer)}</strong></p></section>`).join('')}`;
}

function renderCaseStudy(page) {
  return `<h2>Original case study</h2><p>${escapeHtml(page.caseStudy.scenario)}</p>${page.caseStudy.questions.map((item, index) => `<section><h3>Q${index + 1}. ${escapeHtml(item.question)}</h3><p>${escapeHtml(item.answer)}</p></section>`).join('')}<p>This case study is original learning material and is not represented as an official CBSE case.</p>`;
}

function renderNumericals(page) {
  return `<h2>Worked numericals</h2>${page.numericals.map((item, index) => `<section><h3>Q${index + 1}. ${escapeHtml(item.question)}</h3><ol>${item.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join('')}</ol><p><strong>Answer:</strong> ${escapeHtml(item.answer)}</p></section>`).join('')}`;
}

function pageBody(page) {
  const main = page.type === 'mcqs' ? renderMcqs(page)
    : page.type === 'important-questions' ? renderQuestions(page)
      : page.type === 'revision' ? renderRevision(page)
        : page.type === 'assertion-reason' ? renderAssertionReason(page)
          : page.type === 'case-study' ? renderCaseStudy(page)
            : renderNumericals(page);
  return `<main class="page-container section-padding" data-prerendered="growth-practice"><nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/cbse-practice">CBSE Practice</a> / <a href="${escapeHtml(page.notesPath)}">${escapeHtml(page.chapter)}</a> / ${escapeHtml(page.label)}</nav><article><h1>${escapeHtml(page.title)}</h1><p>${escapeHtml(page.description)}</p><p><strong>Board:</strong> CBSE · <strong>Class:</strong> ${page.classLevel} · <strong>Subject:</strong> ${escapeHtml(page.subject)} · <strong>Access:</strong> Free</p>${main}<h2>Continue learning</h2><ul><li><a href="${escapeHtml(page.notesPath)}">Read ${escapeHtml(page.chapter)} notes</a></li><li><a href="/cbse-practice">Browse all free CBSE Commerce practice</a></li><li><a href="/test-series">Open the Commerce test series</a></li></ul></article></main>`;
}

function hubBody() {
  const byType = Object.entries(growthPages.reduce((acc, page) => { acc[page.label] = (acc[page.label] || 0) + 1; return acc; }, {}));
  const featured = growthPages.filter((page) => ['mcqs', 'numericals', 'case-study', 'assertion-reason'].includes(page.type)).slice(0, 30);
  return `<main class="page-container section-padding" data-prerendered="growth-hub"><nav aria-label="Breadcrumb"><a href="/">Home</a> / CBSE Practice</nav><article><h1>Free CBSE Commerce Practice — MCQs, Numericals & Case Studies</h1><p>Free chapter-wise Class 11 and 12 Commerce practice from Smit Sir Commerce. Use MCQs, important questions, original assertion–reason sets, case studies, worked numericals and revision checklists alongside the published chapter notes.</p><p>${growthStats.pages} practice pages currently cover ${growthStats.chapters} published chapters.</p><h2>Practice formats</h2><ul>${byType.map(([label, count]) => `<li>${escapeHtml(label)} — ${count} pages</li>`).join('')}</ul><h2>Featured chapter practice</h2><ul>${featured.map((page) => `<li><a href="${escapeHtml(page.path)}">Class ${page.classLevel} ${escapeHtml(page.chapter)} — ${escapeHtml(page.label)}</a></li>`).join('')}</ul><p>All practice is original learning material unless a source is explicitly identified. The site does not label original questions as official previous-year CBSE questions.</p></article></main>`;
}

function buildHtml({ path, title, description, body, schema, modifiedTime = '2026-09-01' }) {
  const fullTitle = `${title} | ${SITE}`;
  const url = `${BASE}${path}`;
  const robots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
  const image = `${BASE}/og-image.jpg`;
  const tags = `\n    <meta name="description" content="${escapeHtml(description)}" />\n    <meta name="robots" content="${robots}" />\n    <meta name="googlebot" content="${robots}" />\n    <meta name="bingbot" content="${robots}" />\n    <link rel="canonical" href="${escapeHtml(url)}" />\n    <meta property="og:type" content="article" />\n    <meta property="og:site_name" content="${SITE}" />\n    <meta property="og:locale" content="en_IN" />\n    <meta property="og:title" content="${escapeHtml(fullTitle)}" />\n    <meta property="og:description" content="${escapeHtml(description)}" />\n    <meta property="og:url" content="${escapeHtml(url)}" />\n    <meta property="og:image" content="${image}" />\n    <meta property="article:modified_time" content="${modifiedTime}" />\n    <meta name="twitter:card" content="summary_large_image" />\n    <meta name="twitter:title" content="${escapeHtml(fullTitle)}" />\n    <meta name="twitter:description" content="${escapeHtml(description)}" />\n    <meta name="twitter:image" content="${image}" />\n    <script type="application/ld+json">${JSON.stringify(schema).replaceAll('<', '\\u003c')}</script>`;
  return source.replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(fullTitle)}</title>`).replace('</head>', `${tags}\n  </head>`).replace('<div id="root"></div>', `<div id="root">${body}</div>`);
}

async function writeRoute(path, html) {
  const relative = path.replace(/^\//, '');
  const cleanFile = join(distRoot.pathname, `${relative}.html`);
  const directoryFile = join(distRoot.pathname, relative, 'index.html');
  await mkdir(dirname(cleanFile), { recursive: true });
  await mkdir(dirname(directoryFile), { recursive: true });
  await writeFile(cleanFile, html, 'utf8');
  await writeFile(directoryFile, html, 'utf8');
}

const hubPath = '/cbse-practice';
await writeRoute(hubPath, buildHtml({
  path: hubPath,
  title: 'Free CBSE Commerce Practice — MCQs, Numericals & Case Studies',
  description: 'Free CBSE Class 11 and 12 Commerce practice by chapter: MCQs, important questions, assertion–reason, case studies, numericals and one-shot revision.',
  body: hubBody(),
  schema: { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Free CBSE Commerce Practice', url: `${BASE}${hubPath}`, isAccessibleForFree: true },
}));

for (const page of growthPages) {
  await writeRoute(page.path, buildHtml({ path: page.path, title: page.title, description: page.description, body: pageBody(page), schema: getGrowthStructuredData(page), modifiedTime: page.updated }));
}

console.log(`Pre-rendered ${1 + growthPages.length} content-growth SEO pages.`);
