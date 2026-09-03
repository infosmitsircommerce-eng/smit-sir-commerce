const HOST = 'www.smitsircommerce.in';
const KEY = '6489ed9080c4bf19fb1b88dc0d6ef6fc';
const BING_ENDPOINT = 'https://www.bing.com/indexnow';
const changedPaths = [
  '/',
  '/commerce-coaching-mehsana',
  '/cbse-commerce-classes-mehsana',
  '/class-11-commerce-tuition-mehsana',
  '/class-12-commerce-tuition-mehsana',
  '/economics-tuition-mehsana',
  '/business-studies-tuition-mehsana',
  '/accountancy-tuition-mehsana',
  '/book-demo',
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function submit(url) {
  const requestUrl = `${BING_ENDPOINT}?url=${encodeURIComponent(url)}&key=${encodeURIComponent(KEY)}`;
  let lastStatus = 0;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(requestUrl, {
        method: 'GET',
        headers: { 'user-agent': 'SmitSirCommerce-IndexNow/1.0' },
      });
      lastStatus = response.status;

      if (response.ok || response.status === 202) return { ok: true, status: response.status };

      const body = await response.text().catch(() => '');
      if (response.status !== 403 || attempt === 3) {
        return { ok: false, status: response.status, body: body.slice(0, 240) };
      }
    } catch (error) {
      if (attempt === 3) return { ok: false, status: lastStatus, body: error?.message || String(error) };
    }

    await sleep(8000 * attempt);
  }

  return { ok: false, status: lastStatus };
}

let accepted = 0;
let failed = 0;

for (const path of changedPaths) {
  const url = `https://${HOST}${path}`;
  const result = await submit(url);
  if (result.ok) {
    accepted += 1;
    console.log(`IndexNow: accepted ${url} (HTTP ${result.status}).`);
  } else {
    failed += 1;
    console.warn(`IndexNow: could not confirm ${url} (HTTP ${result.status || 'network'})${result.body ? ` — ${result.body}` : ''}.`);
  }
}

console.log(`IndexNow summary: ${accepted}/${changedPaths.length} changed URLs accepted; ${failed} not confirmed. Deployment continues either way.`);
