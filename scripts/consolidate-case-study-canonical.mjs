import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const dist = new URL('../dist/', import.meta.url);
const OLD_PATH = '/cbse-class-12-business-studies-case-study-questions.html';
const NEW_URL = 'https://www.smitsircommerce.in/cbse/class-12/business-studies-case-study-questions';

try {
  const sitemapPath = join(dist.pathname, 'sitemap.xml');
  let xml = await readFile(sitemapPath, 'utf8');
  const escaped = OLD_PATH.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const block = new RegExp(`\\s*<url>\\s*<loc>https://www\\.smitsircommerce\\.in${escaped}<\\/loc>[\\s\\S]*?<\\/url>`, 'g');
  const next = xml.replace(block, '');
  if (next !== xml) {
    await writeFile(sitemapPath, next, 'utf8');
    console.log('[canonical] Removed legacy Business Studies case-study URL from sitemap.');
  }
} catch (error) {
  console.warn('[canonical] Sitemap consolidation skipped:', error.message);
}

try {
  const oldFile = join(dist.pathname, OLD_PATH.slice(1));
  let html = await readFile(oldFile, 'utf8');
  html = html.replace(/<link rel="canonical"[^>]*>/gi, '');
  html = html.replace(/<meta name="robots"[^>]*>/gi, '');
  html = html.replace(
    '</head>',
    `<link rel="canonical" href="${NEW_URL}" /><meta name="robots" content="noindex,follow" /><meta name="googlebot" content="noindex,follow" />\n</head>`,
  );
  if (!html.includes('data-canonical-consolidation="true"')) {
    html = html.replace(
      '<body',
      `<body data-canonical-consolidation="true"`,
    );
  }
  await writeFile(oldFile, html, 'utf8');
  console.log('[canonical] Legacy Business Studies case-study page now points to canonical authority page.');
} catch (error) {
  if (error?.code !== 'ENOENT') console.warn('[canonical] Legacy page consolidation skipped:', error.message);
}


async function walkHtml(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walkHtml(full));
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(full);
  }
  return files;
}

try {
  const legacyRelative = OLD_PATH;
  const legacyAbsolute = 'https://www.smitsircommerce.in' + OLD_PATH;
  let changed = 0;
  for (const file of await walkHtml(dist.pathname)) {
    let html = await readFile(file, 'utf8');
    const next = html
      .replaceAll('href="' + legacyRelative + '"', 'href="' + NEW_URL.replace('https://www.smitsircommerce.in', '') + '"')
      .replaceAll("href='" + legacyRelative + "'", "href='" + NEW_URL.replace('https://www.smitsircommerce.in', '') + "'")
      .replaceAll('href="' + legacyAbsolute + '"', 'href="' + NEW_URL + '"')
      .replaceAll("href='" + legacyAbsolute + "'", "href='" + NEW_URL + "'");
    if (next !== html) {
      await writeFile(file, next, 'utf8');
      changed += 1;
    }
  }
  console.log('[canonical] Normalized legacy case-study internal links in ' + changed + ' HTML files.');
} catch (error) {
  console.warn('[canonical] Internal-link normalization skipped:', error.message);
}
