import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { seoHubs, seoMaterials, getHubMaterials, getHubStructuredData, getMaterialStructuredData } from '../src/data/seoMaterials.js';

const BASE = 'https://www.smitsircommerce.in';
const SITE = 'Smit Sir Commerce';
const source = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const distRoot = new URL('../dist/', import.meta.url);

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

function renderMaterial(material) {
  const hub = seoHubs.find((item) => item.id === material.hubId);
  return `<main class="page-container section-padding" data-prerendered="seo-chapter">
    <nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/study-material">Study Material</a> / <a href="${escapeHtml(hub.path)}">${escapeHtml(hub.label)}</a> / Chapter ${material.chapterNumber}</nav>
    <article>
      <h1>${escapeHtml(material.chapter)} Notes PDF — CBSE Class ${material.class_level}</h1>
      <p>${escapeHtml(material.summary)}</p>
      <h2>Important topics covered</h2>
      <ul>${material.keyTopics.map((topic) => `<li>${escapeHtml(topic)}</li>`).join('')}</ul>
      <h2>Exam-focused revision checklist</h2>
      <ol>${material.examFocus.map((point) => `<li>${escapeHtml(point)}</li>`).join('')}</ol>
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

console.log(`Pre-rendered ${seoHubs.length + seoMaterials.length} SEO landing pages.`);

