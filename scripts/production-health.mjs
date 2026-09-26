const ORIGIN = process.env.SITE_ORIGIN || 'https://www.smitsircommerce.in';

async function fetchWithTimeout(path, init = {}) {
  return fetch(new URL(path, ORIGIN), {
    redirect: 'follow',
    signal: AbortSignal.timeout(15000),
    headers: {
      'user-agent': 'SmitSirCommerceHealth/1.0',
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
  if (contains) {
    const text = await response.text();
    if (!text.includes(contains)) throw new Error(`${path}: expected text ${JSON.stringify(contains)}`);
  }
  console.log(`✓ ${path} ${response.status}`);
}

await check('/', { contains: 'Smit Sir Commerce', contentType: 'text/html' });
await check('/study-material', { contentType: 'text/html' });
await check('/quizzes', { contentType: 'text/html' });
await check('/net-gset-commerce', { contains: '43', contentType: 'text/html' });
await check('/sitemap.xml', { contains: 'smitsircommerce.in', contentType: 'xml' });
await check('/robots.txt', { contentType: 'text/plain' });

const manifestResponse = await fetchWithTimeout('/net-gset-pdfs/frozen/manifest.json');
if (!manifestResponse.ok) throw new Error(`Frozen PDF manifest: HTTP ${manifestResponse.status}`);
const manifest = await manifestResponse.json();
if (manifest.count !== 43 || Object.keys(manifest.files || {}).length !== 43) {
  throw new Error(`Frozen PDF manifest: expected 43 files, found ${manifest.count ?? 'unknown'}`);
}
console.log('✓ frozen NET/GSET manifest 43/43');

await check('/net-gset-pdfs/frozen/u1c1-unit1-ch01-business-environment.pdf', { contentType: 'application/pdf' });
await check('/net-gset-pdfs/frozen/u10c10-unit10-ch10-tds-tcs-advance-tax-efiling.pdf', { contentType: 'application/pdf' });

console.log('Production smoke test passed.');
