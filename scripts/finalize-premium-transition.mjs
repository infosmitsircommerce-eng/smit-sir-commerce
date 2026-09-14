import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
const BASE = 'https://www.smitsircommerce.in';
const PREMIUM_PATH = '/premium';
const TITLE = '₹699 Commerce Mega Premium — All Current Premium Resources | Smit Sir Commerce';
const DESCRIPTION = 'Get the complete current Smit Sir Commerce Premium ecosystem for ₹699 one time: protected Commerce PDFs, Accountancy and Economics libraries, advanced notes, worked numericals, Hard + Extreme MCQs, Pro tests and Premium study tools.';

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
    <p><strong>Smit Sir Commerce Premium</strong></p>
    <h1>Commerce Mega Premium — complete current Premium access for ₹699</h1>
    <p>The ₹699 Commerce Mega Premium Pack is the all-in-one option for students who want the complete Premium ecosystem currently published on Smit Sir Commerce. It is one purchase connected to one signed-in student account.</p>
    <h2>What is included</h2>
    <ul>
      <li><strong>GSEB Std. 11 Accountancy Part 1:</strong> 720-page master book, 10 detailed chapter PDFs, accounting formats, tables, worked numericals, practice, MCQs and revision.</li>
      <li><strong>GSEB Std. 12 Economics:</strong> 10 Premium revision PDFs covering 117 pages plus Hard and Extreme Premium practice.</li>
      <li><strong>CBSE Class 12 Economics:</strong> 18 chapter deep-dives, 360 focused concept explanations and 360 worked Hard and Extreme challenges across Macroeconomics and Indian Economic Development.</li>
      <li><strong>CBSE Class 11 Microeconomics:</strong> 13 chapter deep-dives, 260 focused concept explanations and 260 worked Hard and Extreme challenges.</li>
      <li><strong>Premium practice:</strong> Premium-gated MCQs, Pro-labelled tests, exam practice and Premium study tools currently published on the platform.</li>
    </ul>
    <h2>One purchase, organised library</h2>
    <p>Instead of forcing every subject into one thousands-page file, Mega Premium keeps each subject, chapter, PDF and practice set organised while giving the student one full-access purchase. This makes the material faster to find and easier to revise.</p>
    <h2>Need only one subject?</h2>
    <p>Focused ₹199 Board Booster packs remain available separately. They unlock only the matching subject pack. Existing legacy full-library Premium accounts continue to be recognised.</p>
    <p><a href="/premium/accountancy">Open Premium Accountancy</a> · <a href="/premium/economics">Open Premium Economics</a> · <a href="/board-booster-packs">Browse ₹199 Board Boosters</a> · <a href="/my-purchases.html">My Purchases</a></p>
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
        name: '₹699 Commerce Mega Premium — All Current Premium Resources',
        description: DESCRIPTION,
        inLanguage: 'en-IN',
        isPartOf: { '@id': `${BASE}/#website` },
        publisher: { '@id': `${BASE}/#organization` },
        mainEntity: { '@id': `${BASE}${PREMIUM_PATH}#mega-premium` },
      },
      {
        '@type': 'Product',
        '@id': `${BASE}${PREMIUM_PATH}#mega-premium`,
        name: 'Commerce Mega Premium Pack',
        description: 'Complete current Smit Sir Commerce Premium access including protected Premium study libraries and Premium-gated practice resources.',
        brand: { '@type': 'Brand', name: 'Smit Sir Commerce' },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'INR',
          price: '699',
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
