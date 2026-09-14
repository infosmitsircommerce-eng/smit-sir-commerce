import { readFile, writeFile } from 'node:fs/promises';
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
    `<link rel="canonical" href="${NEW_URL}" /><meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1" />\n</head>`,
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
