import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { BOARD_BOOSTER_PRODUCTS } from '../src/data/boardBoosterProducts.js';
import { PREMIUM_MEGA_PACK, PREMIUM_MEGA_SECTIONS } from '../src/data/premiumMegaPack.js';

const DIST = new URL('../dist/', import.meta.url).pathname;
const BASE = 'https://www.smitsircommerce.in';
const PREMIUM_PATH = '/premium';
const TITLE = 'Premium Commerce Notes, PDFs & Quizzes | Smit Sir Commerce';
const DESCRIPTION = `Compare free resources, focused ₹199 study packs and ₹${PREMIUM_MEGA_PACK.price} Complete Commerce access with protected notes, advanced practice and Premium study tools.`;

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
  const focusedPacks = BOARD_BOOSTER_PRODUCTS
    .map((product) => `<li><a href="${esc(product.previewPath || '/board-booster-packs')}">${esc(product.name)}</a> — ₹${product.price} one time.</li>`)
    .join('');
  const completeSections = PREMIUM_MEGA_SECTIONS
    .map((section) => `<li><a href="${esc(section.href)}"><strong>${esc(section.title)}</strong></a> — ${esc(section.meta)}. ${esc(section.detail)}</li>`)
    .join('');

  return `<main class="page-container section-padding" data-prerendered="core-page"><article>
    <p><strong>Smit Sir Commerce Premium</strong></p>
    <h1>Choose the Premium study access that matches your need.</h1>
    <p>Public free resources stay free. Focused packs are available for selected Economics courses, while ₹${PREMIUM_MEGA_PACK.price} Complete Commerce unlocks the current all-in-one Premium ecosystem tied to the signed-in student account.</p>
    <h2>Focused ₹199 study packs currently published</h2>
    <ul>${focusedPacks}</ul>
    <p><a href="/board-booster-packs">Compare all focused packs and their exact included resources</a>.</p>
    <h2>₹${PREMIUM_MEGA_PACK.price} Complete Commerce</h2>
    <ul>${completeSections}</ul>
    <h2>Secure account-based access</h2>
    <p>Students can inspect public catalogues and free previews before buying. Complete Commerce checkout uses Cashfree, and Premium access is granted only after the server verifies a successful payment for the signed-in student account. Never share a UPI PIN or OTP with anyone.</p>
    <p><a href="/premium/cbse-12-business-studies">CBSE Class 12 Business Studies Premium</a> · <a href="/premium/cbse-12-accountancy">CBSE Class 12 Accountancy Premium</a> · <a href="/premium/accountancy">GSEB Class 11 Accountancy Premium</a> · <a href="/my-purchases">My Purchases</a> · <a href="/study-material">Free study material</a></p>
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
        name: PREMIUM_MEGA_PACK.name,
        description: PREMIUM_MEGA_PACK.focus,
        brand: { '@type': 'Brand', name: 'Smit Sir Commerce' },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'INR',
          price: String(PREMIUM_MEGA_PACK.price),
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

console.log(`Finalized canonical Premium product and secure-checkout copy in ${changed} static HTML files.`);
