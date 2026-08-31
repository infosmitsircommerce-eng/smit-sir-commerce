import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { seoHubs, seoMaterials, getChapterMcqs, getHubMaterials, getImportantQuestions, getHubStructuredData, getMaterialStructuredData } from '../src/data/seoMaterials.js';

const BASE = 'https://www.smitsircommerce.in';
const SITE = 'Smit Sir Commerce';
const source = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const distRoot = new URL('../dist/', import.meta.url);
const cbseNotesPath = '/cbse-notes';
const cbseNotesTitle = 'Free CBSE Notes for Class 11 & 12 Commerce';
const cbseNotesDescription = 'Free CBSE Commerce notes for Class 11 and 12. View and download chapter-wise PDF notes for Business Studies, Microeconomics and Macroeconomics.';

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderHub(hub) {
  const materials = getHubMaterials(hub.id);
  return `<main class="page-container section-padding" data-prerendered="seo-hub">
    <nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/study-material">Study Material</a> / ${escapeHtml(hub.label)}</nav>
    <article>
      <h1>${escapeHtml(hub.seoTitle)}</h1>
      <p>${escapeHtml(hub.intro)}</p>
      <h2>Free chapter-wise PDF notes</h2>
      <ol>${materials.map((item) => `<li><a href="${escapeHtml(item.seo_path)}">Chapter ${item.chapterNumber}: ${escapeHtml(item.chapter)} notes PDF</a> — ${item.pages} pages</li>`).join('')}</ol>
      <p>All published resources are free to view online and download. Prepared by Smit Sir for clear CBSE Commerce revision.</p>
    </article>
  </main>`;
}

function renderCbseNotes() {
  const totalChapters = seoMaterials.length;
  return `<main class="page-container section-padding" data-prerendered="cbse-notes">
    <nav aria-label="Breadcrumb"><a href="/">Home</a> / Free CBSE Notes</nav>
    <article>
      <h1>${escapeHtml(cbseNotesTitle)}</h1>
      <p>Study chapter by chapter with free CBSE Commerce notes prepared for concept clarity and board-exam revision. Every published PDF can be viewed online or downloaded without registration.</p>
      <p>${totalChapters} chapter-wise PDFs are currently available.</p>
      <h2>CBSE Commerce notes by class and subject</h2>
      <ul>${seoHubs.map((hub) => `<li><a href="${escapeHtml(hub.path)}">Free ${escapeHtml(hub.label)} notes PDF</a> — ${getHubMaterials(hub.id).length} chapters</li>`).join('')}</ul>
      <h2>How to use these notes</h2>
      <p>Read the chapter summary, revise the important topics, open the complete PDF and then practise NCERT questions and current CBSE sample papers.</p>
    </article>
  </main>`;
}

function getCbseNotesStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: cbseNotesTitle,
    description: cbseNotesDescription,
    url: `${BASE}${cbseNotesPath}`,
    isAccessibleForFree: true,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: seoHubs.length,
      itemListElement: seoHubs.map((hub, index) => ({
        '@type': 'ListItem', position: index + 1, name: hub.label, url: `${BASE}${hub.path}`,
      })),
    },
  };
}

function renderMaterial(material) {
  const hub = seoHubs.find((item) => item.id === material.hubId);
  const importantQuestions = getImportantQuestions(material);
  const chapterMcqs = getChapterMcqs(material);
  return `<main class="page-container section-padding" data-prerendered="seo-chapter">
    <nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/study-material">Study Material</a> / <a href="${escapeHtml(hub.path)}">${escapeHtml(hub.label)}</a> / Chapter ${material.chapterNumber}</nav>
    <article>
      <h1>${escapeHtml(material.chapter)} Notes PDF — CBSE Class ${material.class_level}</h1>
      <p>${escapeHtml(material.summary)}</p>
      <h2>Important topics covered</h2>
      <ul>${material.keyTopics.map((topic) => `<li>${escapeHtml(topic)}</li>`).join('')}</ul>
      <h2>Exam-focused revision checklist</h2>
      <ol>${material.examFocus.map((point) => `<li>${escapeHtml(point)}</li>`).join('')}</ol>
      <h2>Important questions with answer guidance</h2>
      ${importantQuestions.map((item) => `<h3>${escapeHtml(item.question)}</h3><p>${escapeHtml(item.answer)}</p>`).join('')}
      <h2>Chapter MCQs with answers</h2>
      ${chapterMcqs.map((mcq, index) => `<section><h3>MCQ ${index + 1}: ${escapeHtml(mcq.question)}</h3><ol type="A">${mcq.options.map((option) => `<li>${escapeHtml(option)}</li>`).join('')}</ol><p><strong>Answer: ${String.fromCharCode(65 + mcq.answer)}.</strong> ${escapeHtml(mcq.explanation)}</p></section>`).join('')}
      <p><a href="${escapeHtml(material.file_url)}">View or download the free ${escapeHtml(material.chapter)} PDF</a>.</p>
      <h2>Frequently asked questions</h2>
      <h3>Are these notes free?</h3><p>Yes. The complete PDF is free to view online and download.</p>
      <h3>Who prepared these notes?</h3><p>These CBSE Commerce revision notes are published by Smit Sir Commerce.</p>
    </article>
  </main>`;
}

function buildHtml({ path, title, description, body, schema, type = 'website' }) {
  const fullTitle = `${title} | ${SITE}`;
  const url = `${BASE}${path}`;
  const tags = `
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <link rel="canonical" href="${escapeHtml(url)}" />
    <meta property="og:type" content="${type}" />
    <meta property="og:site_name" content="${SITE}" />
    <meta property="og:title" content="${escapeHtml(fullTitle)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${escapeHtml(url)}" />
    <meta property="og:image" content="${BASE}/og-image.jpg" />
    <meta name="twitter:card" content="summary_large_image" />
    <script type="application/ld+json">${JSON.stringify(schema).replaceAll('<', '\\u003c')}</script>`;

  return source
    .replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(fullTitle)}</title>`)
    .replace('</head>', `${tags}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`);
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

await writeRoute(cbseNotesPath, buildHtml({
  path: cbseNotesPath,
  title: cbseNotesTitle,
  description: cbseNotesDescription,
  body: renderCbseNotes(),
  schema: getCbseNotesStructuredData(),
}));

for (const hub of seoHubs) {
  await writeRoute(hub.path, buildHtml({
    path: hub.path,
    title: hub.seoTitle,
    description: hub.description,
    body: renderHub(hub),
    schema: getHubStructuredData(hub),
  }));
}

for (const material of seoMaterials) {
  await writeRoute(material.seo_path, buildHtml({
    path: material.seo_path,
    title: material.seoTitle,
    description: material.description,
    body: renderMaterial(material),
    schema: getMaterialStructuredData(material),
    type: 'article',
  }));
}

console.log(`Pre-rendered ${1 + seoHubs.length + seoMaterials.length} SEO landing pages.`);
