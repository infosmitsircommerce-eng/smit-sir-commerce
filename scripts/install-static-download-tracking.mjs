import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
const marker = 'data-ssc-download-tracking';
const config = await readFile('src/lib/supabaseConfig.js', 'utf8');
const code = (await readFile('src/lib/conversionTracking.js', 'utf8')).replace("import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabaseConfig.js';", config) + '\ninstallDownloadTracking();\n';
const asset = `ssc-download-tracking-${createHash('sha256').update(code).digest('hex').slice(0,12)}.js`;
await writeFile(`dist/assets/${asset}`, code);
let count = 0;
async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) { await walk(path); continue; }
    if (!entry.name.endsWith('.html')) continue;
    const html = await readFile(path, 'utf8');
    // SPA pages already install the tracker. Static notes pages need the small standalone module.
    if (html.includes(marker) || /<script[^>]+src=["'][^"']*assets\/index-[^"']*\.js/.test(html)) continue;
    if (!/<a\b[^>]*href=["'][^"']*\.pdf(?:[?#][^"']*)?["']/i.test(html)) continue;
    await writeFile(path, html.replace('</body>', `<script type="module" ${marker} src="/assets/${asset}"></script></body>`));
    count++;
  }
}
await walk('dist');
console.log(`Installed PDF click tracking on ${count} static notes pages.`);
