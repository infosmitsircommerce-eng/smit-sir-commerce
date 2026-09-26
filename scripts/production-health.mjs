const ORIGIN = process.env.SITE_ORIGIN || 'https://www.smitsircommerce.in';

async function fetchWithTimeout(path, init = {}) {
  return fetch(new URL(path, ORIGIN), {
    redirect: 'follow',
    signal: AbortSignal.timeout(15000),
    headers: {
      'user-agent': 'SmitSirCommerceHealth/1.3',
      ...(init.headers || {}),
    },
    ...init,
  });
}

async function check(path, { contains, contentType, statuses = [200] } = {}) {
  const response = await fetchWithTimeout(path);
  if (!statuses.includes(response.status)) {
    throw new Error(`${path}: expected ${statuses.join('/')}, got ${response.status}`);
  }

  const actualType = (response.headers.get('content-type') || '').toLowerCase();
  if (contentType && !actualType.includes(contentType)) {
    throw new Error(`${path}: expected content-type containing ${contentType}, got ${actualType || 'none'}`);
  }

  let text = '';
  if (contains) {
    text = await response.text();
    if (!text.includes(contains)) {
      throw new Error(`${path}: expected text ${JSON.stringify(contains)}`);
    }
  }

  console.log(`✓ ${path} ${response.status}`);
  return { response, text };
}

const home = await check('/', { contains: 'Smit Sir Commerce', contentType: 'text/html' });
if (!home.text.includes('https://www.smitsircommerce.in/')) {
  throw new Error('Homepage: canonical production domain is missing from rendered HTML');
}
console.log('✓ homepage canonical domain');

await check('/study-material', { contentType: 'text/html' });
await check('/quizzes', { contentType: 'text/html' });
await check('/tools', { contentType: 'text/html' });
await check('/premium', { contentType: 'text/html' });
await check('/login', { contentType: 'text/html' });
await check('/my-purchases', { contentType: 'text/html' });

const netGset = await check('/net-gset-commerce', {
  contains: 'unique PDFs live',
  contentType: 'text/html',
});
await check('/ugc-net-commerce-notes', {
  contains: 'UGC NET Commerce notes',
  contentType: 'text/html',
});
await check('/gset-commerce-code-17-notes', {
  contains: 'GSET Commerce Code 17 notes',
  contentType: 'text/html',
});
await check('/net-gset-commerce/unit-1-business-environment-international-business-notes', {
  contains: 'Unit 1: Business Environment',
  contentType: 'text/html',
});
await check('/net-gset-commerce/unit-10-income-tax-corporate-tax-planning-notes', {
  contains: 'Unit 10: Income-tax',
  contentType: 'text/html',
});

const sitemap = await check('/sitemap.xml', { contains: '/ugc-net-commerce-notes', contentType: 'xml' });
if (!sitemap.text.includes('/gset-commerce-code-17-notes')
  || !sitemap.text.includes('/net-gset-commerce/unit-10-income-tax-corporate-tax-planning-notes')) {
  throw new Error('Sitemap is missing NET/GSET organic search landing pages');
}
console.log('✓ sitemap contains NET/GSET search cluster');

await check('/robots.txt', { contentType: 'text/plain' });
await check('/ads.txt', { contentType: 'text/plain' });
await check('/sw.js', { contains: 'Legacy PWA retirement worker', contentType: 'javascript' });
await check('/registerSW.js', { contains: 'Legacy compatibility cleanup', contentType: 'javascript' });
await check('/manifest.json', { contains: 'Smit Sir Commerce', contentType: 'json' });

const manifestResponse = await fetchWithTimeout('/net-gset-pdfs/frozen/manifest.json');
if (!manifestResponse.ok) {
  throw new Error(`Frozen PDF manifest: HTTP ${manifestResponse.status}`);
}
const manifest = await manifestResponse.json();
const fileEntries = Object.entries(manifest.files || {});

if (!Number.isInteger(manifest.count) || manifest.count < 1) {
  throw new Error(`Frozen PDF manifest: invalid count ${manifest.count ?? 'unknown'}`);
}
if (fileEntries.length !== manifest.count) {
  throw new Error(`Frozen PDF manifest: count=${manifest.count}, files=${fileEntries.length}`);
}
if (!netGset.text.includes(`\"numberOfItems\":${manifest.count}`)
  && !netGset.text.includes(`>${manifest.count}</b><small>unique PDFs live`)) {
  throw new Error(`NET/GSET page and frozen manifest disagree about PDF count ${manifest.count}`);
}
console.log(`✓ frozen NET/GSET manifest ${manifest.count}/${manifest.count}`);

const firstPdf = fileEntries[0]?.[1];
const lastPdf = fileEntries[fileEntries.length - 1]?.[1];
for (const pdfPath of new Set([firstPdf, lastPdf].filter(Boolean))) {
  await check(pdfPath, { contentType: 'application/pdf' });
}

console.log('Production smoke test passed.');
