import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
const BASE = 'https://www.smitsircommerce.in';
const PREMIUM_PATH = '/premium';
const TITLE = 'Premium Commerce Notes, PDFs & Quizzes | Smit Sir Commerce';
const DESCRIPTION = 'Compare free resources, a ₹199 single-subject pack and ₹999 Complete Commerce access with Premium notes, quizzes, papers, PPTs and study tools.';

function esc(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(full);
  }
  return files;
}

function replaceMeta(html, key, value, attribute = 'name') {
  const pattern = new RegExp(`<meta\\s+${attribute}=["']${key}["'][^>]*>`, 'i');
  const tag = `<meta ${attribute}="${key}" content="${esc(value)}">`;
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', `${tag}\n</head>`);
}

function premiumBody() {
  return `<main class="page-container section-padding" data-prerendered="core-page"><article>
    <p><strong>Smit Sir Commerce Premium</strong></p>
    <h1>Choose what you need. See everything before you pay.</h1>
    <p>Free resources stay free. Choose the ₹199 Subject Pack for one subject's Premium PDFs and quizzes, or ₹999 Complete Commerce for the full Premium library.</p>
    <h2>₹199 Subject Pack</h2>
    <p>Choose Economics, Accountancy or Business Studies / OCM. The selected subject includes Premium PDFs, chapter organisation and Easy, Moderate, Hard and Extreme quizzes.</p>
    <h2>₹999 Complete Commerce</h2>
    <ul>
      <li>All subjects Premium notes and PDFs</li>
      <li>All quiz difficulties and worked explanations</li>
      <li>Previous five years' question papers and important-question sets</li>
      <li>Exclusive chapter PPT presentations and revision sheets</li>
      <li>Premium test series, Exam Mode and new resources added to the plan</li>
    </ul>
    <h2>Visible, but protected</h2>
    <p>Students can inspect the Premium categories before buying. Actual files remain locked until the QR payment and UTR are manually verified.</p>
    <p><a href="/premium">Choose a Premium plan</a> · <a href="/my-purchases">My Purchases</a> · <a href="/study-material">Free study material</a></p>
  </article></main>`;
}

function premiumSchema() {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${BASE}${PREMIUM_PATH}#webpage`,
        url: `${BASE}${PREMIUM_PATH}`,
        name: 'Premium Commerce Notes, PDFs & Quizzes',
        description: DESCRIPTION,
        inLanguage: 'en-IN',
        isPartOf: { '@id': `${BASE}/#website` },
        publisher: { '@id': `${BASE}/#organization` },
        mainEntity: { '@id': `${BASE}${PREMIUM_PATH}#complete-commerce` },
      },
      {
        '@type': 'Product',
        '@id': `${BASE}${PREMIUM_PATH}#complete-commerce`,
        name: 'Complete Commerce Premium',
        description: 'All-subject Premium notes, quizzes, papers, PPTs, test series and study tools with manual payment verification.',
        brand: { '@type': 'Brand', name: 'Smit Sir Commerce' },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'INR',
          price: '999',
          availability: 'https://schema.org/InStock',
          url: `${BASE}${PREMIUM_PATH}`,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/` },
          { '@type': 'ListItem', position: 2, name: 'Premium', item: `${BASE}${PREMIUM_PATH}` },
        ],
      },
    ],
  }).replaceAll('<', '\\u003c');
}

function patchPremium(html) {
  let next = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(TITLE)}</title>`);
  next = replaceMeta(next, 'description', DESCRIPTION);
  next = replaceMeta(next, 'og:title', TITLE, 'property');
  next = replaceMeta(next, 'og:description', DESCRIPTION, 'property');
  next = replaceMeta(next, 'twitter:title', TITLE);
  next = replaceMeta(next, 'twitter:description', DESCRIPTION);
  const schema = premiumSchema();
  next = next.replace(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi, match =>
    match.includes('/premium#webpage') || match.includes('Smit Sir Commerce Premium')
      ? `<script type="application/ld+json">${schema}</script>`
      : match);
  return next.replace(/<main\b[^>]*data-prerendered=["']core-page["'][^>]*>[\s\S]*?<\/main>/i, premiumBody());
}

const files = await walk(DIST);
let changed = 0;
for (const file of files) {
  const before = await readFile(file, 'utf8');
  const normalized = file.replaceAll('\\', '/');
  const after = normalized.endsWith('/premium.html') || normalized.endsWith('/premium/index.html') ? patchPremium(before) : before;
  if (after !== before) {
    await writeFile(file, after, 'utf8');
    changed += 1;
  }
}

console.log(`Finalized Premium transition copy in ${changed} static HTML files.`);
