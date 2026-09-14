import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
const BASE = 'https://www.smitsircommerce.in';
const PREMIUM_PATH = '/premium';
const TITLE = 'Premium Access Update — Focused ₹199 Board Boosters | Smit Sir Commerce';
const DESCRIPTION = 'The old manual ₹999 Premium sales flow is retired for new purchases. Choose focused ₹199 Board Booster packs with visible contents, free previews and secure pack-specific access.';

function esc(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
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
    <p><strong>Smit Sir Commerce Premium access update</strong></p>
    <h1>Premium is now organised as focused ₹199 Board Booster packs</h1>
    <p>The old manual ₹999 QR and UTR sales flow is retired for new purchases. New students choose the exact board, class and subject pack they need, see the paid contents and free preview first, then use secure Cashfree checkout when the approved gateway is active.</p>
    <h2>How the new system works</h2>
    <ol><li>Choose a specific Board Booster.</li><li>See the exact PDFs, deep-dives and harder practice included.</li><li>Open the free preview before deciding.</li><li>Sign in so the purchase belongs to the correct student account.</li><li>After Cashfree confirms a successful order, only that purchased pack is unlocked.</li><li>Open <a href="/my-purchases.html">My Purchases</a> to see access and payment history.</li></ol>
    <h2>What about older Premium accounts?</h2>
    <p>Existing accounts that already have legacy full-library Premium access continue to be recognised. They do not need to repurchase the same covered resources. New purchases use the product-specific ₹199 system.</p>
    <p><a href="/board-booster-packs">Browse ₹199 Board Boosters</a> · <a href="/my-purchases.html">My Purchases</a> · <a href="/study-material">Free study material</a> · <a href="/quizzes">Free quizzes</a></p>
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
        name: 'Premium Access Update — Focused ₹199 Board Boosters',
        description: DESCRIPTION,
        inLanguage: 'en-IN',
        isPartOf: { '@id': `${BASE}/#website` },
        publisher: { '@id': `${BASE}/#organization` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/` },
          { '@type': 'ListItem', position: 2, name: 'Premium Access Update', item: `${BASE}${PREMIUM_PATH}` },
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
  next = next.replace(
    /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi,
    (match) => match.includes('/premium#webpage') || (match.includes('Smit Sir Commerce Premium') && match.includes('"price":"999"'))
      ? `<script type="application/ld+json">${schema}</script>`
      : match,
  );
  next = next.replace(
    /<main\b[^>]*data-prerendered=["']core-page["'][^>]*>[\s\S]*?<\/main>/i,
    premiumBody(),
  );
  return next;
}

const files = await walk(DIST);
let changed = 0;
for (const file of files) {
  const before = await readFile(file, 'utf8');
  let after = before
    .replaceAll('₹999 Lifetime Premium', 'Premium access')
    .replaceAll('₹999 Premium option', 'focused Board Booster option')
    .replaceAll('₹999 Premium', 'legacy Premium');

  const normalized = file.replaceAll('\\', '/');
  if (normalized.endsWith('/premium.html') || normalized.endsWith('/premium/index.html')) {
    after = patchPremium(after);
  }

  if (after !== before) {
    await writeFile(file, after, 'utf8');
    changed += 1;
  }
}

console.log(`Finalized Premium transition copy in ${changed} static HTML files.`);
