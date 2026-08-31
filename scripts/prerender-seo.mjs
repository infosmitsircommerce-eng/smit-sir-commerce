import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { seoHubs, seoMaterials, getChapterMcqs, getHubMaterials, getImportantQuestions, getMaterialFaqs, getHubStructuredData, getMaterialStructuredData } from '../src/data/seoMaterials.js';

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
  const relatedHubs = seoHubs.filter((item) => item.id !== hub.id);
  return `<main class="page-container section-padding" data-prerendered="seo-hub">
    <nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/study-material">Study Material</a> / ${escapeHtml(hub.label)}</nav>
    <article>
      <h1>${escapeHtml(hub.seoTitle)}</h1>
      <p>${escapeHtml(hub.intro)}</p>
      <h2>Free chapter-wise PDF notes</h2>
      <ol>${materials.map((item) => `<li><a href="${escapeHtml(item.seo_path)}">Chapter ${item.chapterNumber}: ${escapeHtml(item.chapter)} notes PDF</a> — ${item.pages} pages</li>`).join('')}</ol>
      <p>All published resources are free to view online and download. Prepared by Smit Sir for clear CBSE Commerce revision.</p>
      <h2>Explore other CBSE Commerce subjects</h2>
      <ul>${relatedHubs.map((item) => `<li><a href="${escapeHtml(item.path)}">Free ${escapeHtml(item.label)} notes PDF</a></li>`).join('')}</ul>
      <p><a href="/cbse-notes">Browse all free CBSE Commerce notes</a>.</p>
    </article>
  </main>`;
}

function renderCbseNotes() {
  const totalChapters = seoMaterials.length;
  const popularNotes = seoHubs.flatMap((hub) => getHubMaterials(hub.id).slice(0, 2));
  return `<main class="page-container section-padding" data-prerendered="cbse-notes">
    <nav aria-label="Breadcrumb"><a href="/">Home</a> / Free CBSE Notes</nav>
    <article>
      <h1>${escapeHtml(cbseNotesTitle)}</h1>
      <p>Study chapter by chapter with free CBSE Commerce notes prepared for concept clarity and board-exam revision. Every published PDF can be viewed online or downloaded without registration.</p>
      <p>${totalChapters} chapter-wise PDFs are currently available.</p>
      <h2>CBSE Commerce notes by class and subject</h2>
      <ul>${seoHubs.map((hub) => `<li><a href="${escapeHtml(hub.path)}">Free ${escapeHtml(hub.label)} notes PDF</a> — ${getHubMaterials(hub.id).length} chapters</li>`).join('')}</ul>
      <h2>Popular free CBSE Commerce notes</h2>
      <ul>${popularNotes.map((item) => `<li><a href="${escapeHtml(item.seo_path)}">Class ${item.class_level} Chapter ${item.chapterNumber}: ${escapeHtml(item.chapter)} notes PDF</a></li>`).join('')}</ul>
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
  const siblings = getHubMaterials(material.hubId);
  const currentIndex = siblings.findIndex((item) => item.id === material.id);
  const previous = currentIndex > 0 ? siblings[currentIndex - 1] : null;
  const next = currentIndex < siblings.length - 1 ? siblings[currentIndex + 1] : null;
  const relatedHubs = seoHubs.filter((item) => item.id !== material.hubId);
  const importantQuestions = getImportantQuestions(material);
  const chapterMcqs = getChapterMcqs(material);
  const faqs = getMaterialFaqs(material);
  return `<main class="page-container section-padding" data-prerendered="seo-chapter">
    <nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/study-material">Study Material</a> / <a href="${escapeHtml(hub.path)}">${escapeHtml(hub.label)}</a> / Chapter ${material.chapterNumber}</nav>
    <article>
      <h1>${escapeHtml(material.chapter)} Notes PDF — CBSE Class ${material.class_level}</h1>
      <p>${escapeHtml(material.summary)}</p>
      <p><strong>Board:</strong> CBSE · <strong>Class:</strong> ${material.class_level} · <strong>Updated:</strong> ${escapeHtml(material.updated)} · <strong>Access:</strong> Free, no registration</p>
      <h2>Important topics covered</h2>
      <ul>${material.keyTopics.map((topic) => `<li>${escapeHtml(topic)}</li>`).join('')}</ul>
      <h2>Exam-focused revision checklist</h2>
      <ol>${material.examFocus.map((point) => `<li>${escapeHtml(point)}</li>`).join('')}</ol>
      <h2>Important questions with answer guidance</h2>
      ${importantQuestions.map((item) => `<h3>${escapeHtml(item.question)}</h3><p>${escapeHtml(item.answer)}</p>`).join('')}
      <h2>Chapter MCQs with answers</h2>
      ${chapterMcqs.map((mcq, index) => `<section><h3>MCQ ${index + 1}: ${escapeHtml(mcq.question)}</h3><ol type="A">${mcq.options.map((option) => `<li>${escapeHtml(option)}</li>`).join('')}</ol><p><strong>Answer: ${String.fromCharCode(65 + mcq.answer)}.</strong> ${escapeHtml(mcq.explanation)}</p></section>`).join('')}
      <p><a href="${escapeHtml(material.file_url)}">View or download the free ${escapeHtml(material.chapter)} PDF</a>.</p>
      <h2>Why you can trust this study resource</h2>
      <p>This chapter-specific resource is organised by Smit Sir for Class ${material.class_level} Commerce students. It is free to view and download and should be used alongside NCERT questions and the latest official CBSE sample papers.</p>
      <h2>Frequently asked questions</h2>
      ${faqs.map((faq) => `<h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p>`).join('')}
      <h2>Continue learning</h2>
      <ul>${previous ? `<li><a href="${escapeHtml(previous.seo_path)}">Previous: Chapter ${previous.chapterNumber} ${escapeHtml(previous.chapter)} notes</a></li>` : ''}${next ? `<li><a href="${escapeHtml(next.seo_path)}">Next: Chapter ${next.chapterNumber} ${escapeHtml(next.chapter)} notes</a></li>` : ''}<li><a href="${escapeHtml(hub.path)}">All ${escapeHtml(hub.label)} notes</a></li><li><a href="/cbse-notes">All free CBSE Commerce notes</a></li></ul>
      <h2>Other free CBSE Commerce subjects</h2>
      <ul>${relatedHubs.map((item) => `<li><a href="${escapeHtml(item.path)}">Free ${escapeHtml(item.label)} notes PDF</a></li>`).join('')}</ul>
    </article>
  </main>`;
}

function buildHtml({ path, title, description, body, schema, type = 'website', modifiedTime = null }) {
  const fullTitle = `${title} | ${SITE}`;
  const url = `${BASE}${path}`;
  const robots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
  const image = `${BASE}/og-image.jpg`;
  const tags = `
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="robots" content="${robots}" />
    <meta name="googlebot" content="${robots}" />
    <meta name="bingbot" content="${robots}" />
    <link rel="canonical" href="${escapeHtml(url)}" />
    <meta property="og:type" content="${type}" />
    <meta property="og:site_name" content="${SITE}" />
    <meta property="og:locale" content="en_IN" />
    <meta property="og:title" content="${escapeHtml(fullTitle)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${escapeHtml(url)}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escapeHtml(fullTitle)}" />
    ${type === 'article' && modifiedTime ? `<meta property="article:published_time" content="${escapeHtml(modifiedTime)}" /><meta property="article:modified_time" content="${escapeHtml(modifiedTime)}" />` : ''}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(fullTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${image}" />
    <meta name="twitter:image:alt" content="${escapeHtml(fullTitle)}" />
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
    modifiedTime: material.updated,
  }));
}

console.log(`Pre-rendered ${1 + seoHubs.length + seoMaterials.length} SEO landing pages.`);
