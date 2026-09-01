import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { growthManifest } from './growth-manifest.mjs';

const BASE = 'https://www.smitsircommerce.in';
const SITE = 'Smit Sir Commerce';
const source = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const distRoot = new URL('../dist/', import.meta.url);

function escapeHtml(value) {
  return String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

function genericPractice(page) {
  if (page.type === 'mcqs') return `<h2>${escapeHtml(page.chapter)} MCQ practice</h2><p>Use the interactive page for the full answerable MCQ set. Before attempting it, revise these chapter areas:</p><ul>${page.keyTopics.map((topic) => `<li>${escapeHtml(topic)}</li>`).join('')}</ul><h2>How to use the MCQs</h2><ol><li>Attempt every question without opening the answer first.</li><li>Write down the concept behind every incorrect answer.</li><li>Return to the chapter notes for weak topics and retry the set.</li></ol>`;
  if (page.type === 'important-questions') return `<h2>Important board-style questions</h2>${page.keyTopics.map((topic, index) => `<section><h3>Q${index + 1}. Explain or apply ${escapeHtml(topic)}.</h3><p>Begin with the meaning, write the key points in order and connect the answer to ${escapeHtml(page.chapter)}. ${escapeHtml(page.examFocus[index % page.examFocus.length] || '')}</p></section>`).join('')}<p>These are original revision prompts and are not claimed previous-year CBSE questions.</p>`;
  if (page.type === 'revision') return `<h2>One-shot revision checklist</h2><ul>${page.keyTopics.map((topic) => `<li>Explain ${escapeHtml(topic)} without opening the notes.</li>`).join('')}</ul><h2>Exam-focus checklist</h2><ol>${page.examFocus.map((point) => `<li>${escapeHtml(point)}</li>`).join('')}</ol>`;
  if (page.type === 'assertion-reason') return `<h2>Assertion–Reason preparation</h2><p>The interactive page contains original assertion–reason items with answers. Revise the relationships behind these topics before attempting them:</p><ul>${page.keyTopics.map((topic) => `<li>${escapeHtml(topic)}</li>`).join('')}</ul><p>For every item, separately test whether the Assertion is true, whether the Reason is true, and whether the Reason actually explains the Assertion.</p>`;
  if (page.type === 'case-study') return `<h2>Case-study preparation</h2><p>${escapeHtml(page.summary)}</p><p>The interactive page presents an original application case. Focus on identifying the concept from facts rather than copying a definition.</p><ul>${page.keyTopics.map((topic) => `<li>Be ready to apply ${escapeHtml(topic)} to a short business situation.</li>`).join('')}</ul><h2>Answering strategy</h2><ol>${page.examFocus.map((point) => `<li>${escapeHtml(point)}</li>`).join('')}</ol>`;
  return `<h2>Numerical practice</h2><p>The interactive page contains worked original numericals for ${escapeHtml(page.chapter)}. Revise the formula or relationship first, show each step, keep units clear and interpret the final answer.</p><ul>${page.keyTopics.map((topic) => `<li>${escapeHtml(topic)}</li>`).join('')}</ul><h2>Numerical checklist</h2><ol><li>Write the relevant formula or condition.</li><li>Substitute the given values carefully.</li><li>Show the calculation in steps.</li><li>State the final answer with units or interpretation.</li></ol>`;
}

function pageBody(page) {
  return `<main class="page-container section-padding" data-prerendered="growth-practice"><nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/cbse-practice">CBSE Practice</a> / <a href="${escapeHtml(page.notesPath)}">${escapeHtml(page.chapter)}</a> / ${escapeHtml(page.label)}</nav><article><h1>${escapeHtml(page.title)}</h1><p>${escapeHtml(page.description)}</p><p><strong>Board:</strong> CBSE · <strong>Class:</strong> ${page.classLevel} · <strong>Subject:</strong> ${escapeHtml(page.subject)} · <strong>Access:</strong> Free</p>${genericPractice(page)}<h2>Continue learning</h2><ul><li><a href="${escapeHtml(page.notesPath)}">Read ${escapeHtml(page.chapter)} notes</a></li><li><a href="/cbse-practice">Browse all free CBSE Commerce practice</a></li><li><a href="/test-series">Open the Commerce test series</a></li></ul><p>Practice material is original unless a source is explicitly identified. Original questions are not represented as official CBSE or previous-year questions.</p></article></main>`;
}

function hubBody() {
  const chapters = new Set(growthManifest.map((page) => page.materialId)).size;
  const byType = Object.entries(growthManifest.reduce((acc, page) => { acc[page.label] = (acc[page.label] || 0) + 1; return acc; }, {}));
  const featured = growthManifest.filter((page) => ['mcqs', 'numericals', 'case-study', 'assertion-reason'].includes(page.type)).slice(0, 30);
  return `<main class="page-container section-padding" data-prerendered="growth-hub"><nav aria-label="Breadcrumb"><a href="/">Home</a> / CBSE Practice</nav><article><h1>Free CBSE Commerce Practice — MCQs, Numericals & Case Studies</h1><p>Free chapter-wise Class 11 and 12 Commerce practice from Smit Sir Commerce. Use MCQs, important questions, original assertion–reason sets, case studies, worked numericals and revision checklists alongside the published chapter notes.</p><p>${growthManifest.length} practice pages currently cover ${chapters} published chapters.</p><h2>Practice formats</h2><ul>${byType.map(([label, count]) => `<li>${escapeHtml(label)} — ${count} pages</li>`).join('')}</ul><h2>Featured chapter practice</h2><ul>${featured.map((page) => `<li><a href="${escapeHtml(page.path)}">Class ${page.classLevel} ${escapeHtml(page.chapter)} — ${escapeHtml(page.label)}</a></li>`).join('')}</ul><p>All practice is original learning material unless a source is explicitly identified. The site does not label original questions as official previous-year CBSE questions.</p></article></main>`;
}

function structuredData(page) {
  return { '@context': 'https://schema.org', '@type': 'LearningResource', name: page.title, description: page.description, url: `${BASE}${page.path}`, educationalLevel: `CBSE Class ${page.classLevel}`, learningResourceType: page.label, isAccessibleForFree: true, inLanguage: 'en-IN', dateModified: page.updated, about: [page.chapter, page.subject], provider: { '@type': 'EducationalOrganization', name: SITE, url: BASE } };
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

for (const page of growthManifest) {
  await writeRoute(page.path, buildHtml({ path: page.path, title: page.title, description: page.description, body: pageBody(page), schema: structuredData(page), modifiedTime: page.updated }));
}

console.log(`Pre-rendered ${1 + growthManifest.length} content-growth SEO pages.`);
