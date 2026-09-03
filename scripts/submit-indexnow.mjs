import { readFile } from 'node:fs/promises';

const HOST = 'www.smitsircommerce.in';
const KEY = '6489ed9080c4bf19fb1b88dc0d6ef6fc';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';

function extractUrls(xml) {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)]
    .map((match) => match[1].trim())
    .filter((url) => url.startsWith(`https://${HOST}/`));
}

try {
  const xml = await readFile(new URL('../public/sitemap.xml', import.meta.url), 'utf8');
  const urlList = [...new Set(extractUrls(xml))];

  if (!urlList.length) {
    console.warn('IndexNow: no canonical sitemap URLs found; skipping submission.');
    process.exit(0);
  }

  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList,
    }),
  });

  if (response.ok || response.status === 202) {
    console.log(`IndexNow: submitted ${urlList.length} sitemap URLs successfully (HTTP ${response.status}).`);
  } else {
    const body = await response.text().catch(() => '');
    console.warn(`IndexNow: submission returned HTTP ${response.status}${body ? ` — ${body.slice(0, 300)}` : ''}. Deployment will continue.`);
  }
} catch (error) {
  console.warn(`IndexNow: submission skipped because of a non-fatal error: ${error?.message || error}`);
}
