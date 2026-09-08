import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const DIST = join(ROOT, 'dist');
const BASE = 'https://www.smitsircommerce.in';

async function exists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function stripRouteMeta(html) {
  return html
    .replace(/<meta\s+[^>]*name=["']description["'][^>]*>\s*/gi, '')
    .replace(/<meta\s+[^>]*name=["']robots["'][^>]*>\s*/gi, '')
    .replace(/<meta\s+[^>]*name=["']googlebot["'][^>]*>\s*/gi, '')
    .replace(/<link\s+[^>]*rel=["']canonical["'][^>]*>\s*/gi, '')
    .replace(/<meta\s+[^>]*property=["']og:url["'][^>]*>\s*/gi, '');
}

function replaceRoot(html, body) {
  if (/<div id=["']root["']>[\s\S]*?<\/div>\s*<\/body>/i.test(html)) {
    return html.replace(/<div id=["']root["']>[\s\S]*?<\/div>\s*<\/body>/i, `<div id="root">${body}</div>\n</body>`);
  }
  return html.replace(/<div id=["']root["']><\/div>/i, `<div id="root">${body}</div>`);
}

const sourcePath = join(DIST, 'index.html');
let source = await readFile(sourcePath, 'utf8');

const gamesTitle = 'Free Commerce Games for Class 11 & 12 — Learn Economics & Business';
const gamesDescription = 'Play free Commerce learning games for Class 11 and 12 students, including Economics, inflation, budgeting, pricing and business-decision practice.';
const gamesCanonical = `${BASE}/games`;
const gamesBody = `<main class="page-container section-padding" data-prerendered="games-seo">
  <article>
    <p style="font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#966313">Learning with fun</p>
    <h1>Free Commerce Games for Class 11 & 12 Students</h1>
    <p>Smit Sir Commerce games turn textbook ideas into simple decisions, simulations and practice. The goal is not random entertainment: each activity helps students connect Economics and Business concepts with situations they can understand in real life.</p>
    <section>
      <h2>What you can practise</h2>
      <ul>
        <li><strong>Market Shock Simulator:</strong> think about demand, supply and price after a real-world change.</li>
        <li><strong>Family Budget Challenge:</strong> manage income, needs, wants and savings.</li>
        <li><strong>Shopkeeper Price War:</strong> compare pricing, discount, stock and profit decisions.</li>
        <li><strong>Inflation Time Machine:</strong> understand purchasing power and changing money value.</li>
        <li><strong>Business Decision Game:</strong> compare cost, revenue, profit and break-even choices.</li>
      </ul>
    </section>
    <section>
      <h2>Best way to use the games</h2>
      <p>First read the related chapter notes, then play the activity, and finally explain why your decision worked. That sequence helps students move from memorising a definition to applying the concept.</p>
    </section>
    <section>
      <h2>Continue learning</h2>
      <p><a href="/study-material">Study Material</a> · <a href="/cbse-notes">CBSE Notes</a> · <a href="/gseb-class-12-economics.html">GSEB Economics PDFs</a> · <a href="/tools">Commerce Tools</a> · <a href="/free-class-12-commerce-study-pack.html">Free Class 12 Study Pack</a></p>
    </section>
  </article>
</main>`;

let gamesHtml = stripRouteMeta(source)
  .replace(/<title>[\s\S]*?<\/title>/i, `<title>${gamesTitle} | Smit Sir Commerce</title>`)
  .replace('</head>', `<meta name="description" content="${gamesDescription}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
<meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
<link rel="canonical" href="${gamesCanonical}">
<meta property="og:url" content="${gamesCanonical}">
<meta property="og:title" content="${gamesTitle} | Smit Sir Commerce">
<meta property="og:description" content="${gamesDescription}">
<meta name="twitter:title" content="${gamesTitle} | Smit Sir Commerce">
<meta name="twitter:description" content="${gamesDescription}">
<script type="application/ld+json">${JSON.stringify({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${gamesCanonical}#webpage`,
      url: gamesCanonical,
      name: gamesTitle,
      description: gamesDescription,
      inLanguage: 'en-IN',
      isPartOf: { '@id': `${BASE}/#website` }
    },
    {
      '@type': 'LearningResource',
      '@id': `${gamesCanonical}#learning-resource`,
      name: gamesTitle,
      description: gamesDescription,
      learningResourceType: 'Interactive learning game',
      educationalLevel: ['Class 11', 'Class 12'],
      isAccessibleForFree: true,
      provider: { '@type': 'EducationalOrganization', name: 'Smit Sir Commerce', url: BASE }
    }
  ]
})}</script>
</head>`);
gamesHtml = replaceRoot(gamesHtml, gamesBody);

const gamesClean = join(DIST, 'games.html');
const gamesDir = join(DIST, 'games', 'index.html');
await mkdir(dirname(gamesClean), { recursive: true });
await mkdir(dirname(gamesDir), { recursive: true });
await writeFile(gamesClean, gamesHtml, 'utf8');
await writeFile(gamesDir, gamesHtml, 'utf8');

const resourceLinks = `<section data-seo-resource-bridges>
  <h2>Popular free Commerce resource hubs</h2>
  <p>Use these focused hubs when you want a quick route to notes, PDFs or calculators.</p>
  <ul>
    <li><a href="/free-commerce-notes.html">Free Commerce Notes</a></li>
    <li><a href="/cbse-commerce-notes.html">CBSE Commerce Notes</a></li>
    <li><a href="/gseb-class-12-economics-notes-pdf.html">GSEB Class 12 Economics Notes PDF</a></li>
    <li><a href="/free-commerce-tools.html">Free Commerce Tools</a></li>
  </ul>
</section>`;

for (const candidate of [join(DIST, 'study-material.html'), join(DIST, 'study-material', 'index.html')]) {
  if (!(await exists(candidate))) continue;
  let html = await readFile(candidate, 'utf8');
  if (html.includes('data-seo-resource-bridges')) continue;

  if (/<\/article>/i.test(html)) {
    html = html.replace(/<\/article>/i, `${resourceLinks}</article>`);
  } else if (/<\/main>/i.test(html)) {
    html = html.replace(/<\/main>/i, `${resourceLinks}</main>`);
  } else {
    html = html.replace(/<\/body>/i, `${resourceLinks}</body>`);
  }
  await writeFile(candidate, html, 'utf8');
}

console.log('Resolved final SEO warnings: prerendered /games and linked 4 resource hub pages from Study Material.');
